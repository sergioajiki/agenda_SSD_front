"use client";
import { FormEvent, ChangeEvent, useMemo, useState } from "react";
import { createMeeting } from "@/services/meetingService";
import { MeetingRequest, MeetingResponse } from "@/models/Meetings";
import { formatDateToYYYYMMDD, parseDDMMYYYYtoDate } from "@/utils/Utils";
import axios from "axios";
import "./styles/MeetingForm.css";

type MeetingFormProps = {
  onMeetingAdded?: () => void | Promise<void>;
  isBlocked?: boolean; // botão desativado até login
};

const HALF_HOUR_TIMES = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

export default function MeetingForm({ onMeetingAdded, isBlocked = false }: MeetingFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    meetingDate: "",
    timeStart: "",
    timeEnd: "",
    meetingRoom: "",
    userId: ""
  });
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value, ...(name === "timeStart" ? { timeEnd: "" } : {}) }));
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
    if (!validateTimeRange()) {
      setMessage("⚠️ O horário final deve ser posterior ao horário inicial.");
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
        userId: formData.userId
      };

      const meetingCreated: MeetingResponse = await createMeeting(payload);
      setMessage(`✅ Reunião ${meetingCreated.id} cadastrada com sucesso!`);
      setIsError(false);

      setFormData({ title: "", meetingDate: "", timeStart: "", timeEnd: "", meetingRoom: "", userId: "" });
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
    <div className="meeting-form-container">
      <h3>Cadastro de Reunião</h3>
      <form className="meeting-form" onSubmit={handleSubmit}>
        <label>Título</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required disabled={isBlocked} />

        <label>Data (DD/MM/AAAA)</label>
        <input type="text" name="meetingDate" value={formData.meetingDate} onChange={handleChange} required disabled={isBlocked} />

        <div className="time-row">
          <div className="time-field">
            <label>Início</label>
            <select name="timeStart" value={formData.timeStart} onChange={handleChange} required disabled={isBlocked}>
              <option value="">--</option>
              {HALF_HOUR_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="time-field">
            <label>Fim</label>
            <select name="timeEnd" value={formData.timeEnd} onChange={handleChange} required disabled={isBlocked}>
              <option value="">--</option>
              {availableEndTimes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <label>Sala</label>
        <input type="text" name="meetingRoom" value={formData.meetingRoom} onChange={handleChange} required disabled={isBlocked} />

        <label>ID Usuário</label>
        <input type="text" name="userId" value={formData.userId} onChange={handleChange} required disabled={isBlocked} />

        <button className="btn-submit" type="submit" disabled={isBlocked}>Cadastrar</button>

        {message && (
          <p className={`meeting-form-message ${isError ? "error" : "success"}`}>{message}</p>
        )}
      </form>
    </div>
  );
}
