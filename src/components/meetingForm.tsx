"use client";
import { FormEvent, ChangeEvent, useMemo, useState } from "react";
import { createMeeting } from "@/services/meetingService";
import { MeetingRequest, MeetingResponse } from "@/models/Meetings";
import { formatDateToYYYYMMDD, parseDDMMYYYYtoDate } from "@/utils/Utils";
import axios from "axios";
import "./styles/MeetingForm.css";

type MeetingFormProps = {
  onMeetingAdded?: () => void | Promise<void>;
  isBlocked?: boolean;          // 🔒 bloqueia se não autenticado
  userId?: number | null;       // 🔹 recebemos do usuário logado
};

const HALF_HOUR_TIMES = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

// 🔹 Filtra os horários para começar em 07:30
const START_OPTIONS = HALF_HOUR_TIMES.filter(t => t >= "07:30");

export default function MeetingForm({ onMeetingAdded, isBlocked = false, userId }: MeetingFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    meetingDate: "",
    timeStart: "",
    timeEnd: "",
    meetingRoom: ""
  });
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [dateError, setDateError] = useState<string>("");

  const validateDateNotPast = (dateStr: string): boolean => {
    try {
      const date = parseDDMMYYYYtoDate(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    } catch {
      return false;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "timeStart" ? { timeEnd: "" } : {})
    }));

    if (name === "meetingDate") {
      if (value.trim() === "") {
        setDateError("");
      } else if (!validateDateNotPast(value)) {
        setDateError("⚠️ Data inválida ou retroativa");
      } else {
        setDateError("");
      }
    }
  };

  const availableEndTimes = useMemo(() => {
    if (!formData.timeStart) return HALF_HOUR_TIMES;
    const startIdx = HALF_HOUR_TIMES.indexOf(formData.timeStart);
    return HALF_HOUR_TIMES.slice(startIdx + 1);
  }, [formData.timeStart]);

  const validateTimeRange = () => {
    if (!formData.timeStart || !formData.timeEnd) return true;
    return HALF_HOUR_TIMES.indexOf(formData.timeEnd) > HALF_HOUR_TIMES.indexOf(formData.timeStart);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (dateError) {
      setMessage(dateError);
      setIsError(true);
      return;
    }

    if (!validateTimeRange()) {
      setMessage("⚠️ O horário final deve ser posterior ao horário inicial.");
      setIsError(true);
      return;
    }

    if (!userId) {
      setMessage("⚠️ Você precisa estar logado para cadastrar uma reunião.");
      setIsError(true);
      return;
    }

    try {
      const parsedDate = parseDDMMYYYYtoDate(formData.meetingDate);
      const payload: MeetingRequest = {
        title: formData.title,
        meetingDate: formatDateToYYYYMMDD(parsedDate),
        timeStart: formData.timeStart,
        timeEnd: formData.timeEnd,
        meetingRoom: formData.meetingRoom,
        userId: String(userId)
      };

      const meetingCreated: MeetingResponse = await createMeeting(payload);
      setMessage(`✅ Reunião ${meetingCreated.id} cadastrada com sucesso!`);
      setIsError(false);

      setFormData({
        title: "",
        meetingDate: "",
        timeStart: "",
        timeEnd: "",
        meetingRoom: ""
      });

      if (onMeetingAdded) await onMeetingAdded();
    } catch (error: unknown) {
      let errorMessage = "Erro ao enviar o formulário";
      if (axios.isAxiosError(error)) errorMessage = error.response?.data?.detail || error.message;
      else if (error instanceof Error) errorMessage = error.message;
      setMessage(errorMessage);
      setIsError(true);
    }
  };

  return (
    <div className={`meeting-form-container ${isBlocked ? "blocked" : ""}`}>
      <h3>Cadastro de Reunião</h3>
      <form className="meeting-form" onSubmit={handleSubmit}>
        <label>Título</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={isBlocked}
        />

        <label>Data (DD-MM-AAAA)</label>
        <input
          type="text"
          name="meetingDate"
          value={formData.meetingDate}
          onChange={handleChange}
          placeholder="Ex: 15-10-2025"
          required
          disabled={isBlocked}
          className={dateError ? "input-error" : formData.meetingDate ? "input-valid" : ""}
        />
        {dateError && <p className="error-message">{dateError}</p>}

        <div className="time-row">
          <div className="time-field">
            <label>Início</label>
            <select
              name="timeStart"
              value={formData.timeStart}
              onChange={handleChange}
              required
              disabled={isBlocked}
            >
              <option value="">--</option>
              {START_OPTIONS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="time-field">
            <label>Fim</label>
            <select
              name="timeEnd"
              value={formData.timeEnd}
              onChange={handleChange}
              required
              disabled={isBlocked}
            >
              <option value="">--</option>
              {availableEndTimes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <label>Sala</label>
        <input
          type="text"
          name="meetingRoom"
          value={formData.meetingRoom}
          onChange={handleChange}
          required
          disabled={isBlocked}
        />

        <button className="btn-submit" type="submit" disabled={isBlocked}>
          {isBlocked ? "🔒 Faça login" : "Cadastrar"}
        </button>

        {message && (
          <p className={`meeting-form-message ${isError ? "error" : "success"}`}>{message}</p>
        )}
      </form>
    </div>
  );
}
