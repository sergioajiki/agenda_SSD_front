"use client";

import Image from "next/image";
import { ApiErrorResponse } from "@/models/ApiErrorResponse";
import { MeetingRequest, MeetingResponse } from "@/models/Meetings";
import { createMeeting, getMeetings } from "@/services/meetingService";
import { formatDateToYYYYMMDD, parseDDMMYYYYtoDate } from "@/utils/Utils";
import axios from "axios";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import "./styles/MeetingForm.css";

type MeetingFormProps = {
  onMeetingAdded?: () => void;
  view: "monthly" | "weekly";
  setView: (v: "monthly" | "weekly") => void;
};

// gera lista de horários
const generateHalfHourTimes = () => {
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    times.push(`${String(h).padStart(2, "0")}:00`);
    times.push(`${String(h).padStart(2, "0")}:30`);
  }
  return times;
};
const HALF_HOUR_TIMES = generateHalfHourTimes();

export default function MeetingForm({ onMeetingAdded, view, setView }: MeetingFormProps) {
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "timeStart" ? { timeEnd: "" } : {}),
    }));
  };

  const availableEndTimes = useMemo(() => {
    if (!formData.timeStart) return HALF_HOUR_TIMES;
    const startIdx = HALF_HOUR_TIMES.indexOf(formData.timeStart);
    return HALF_HOUR_TIMES.slice(startIdx + 1);
  }, [formData.timeStart]);

  const validateTimeRange = (): boolean => {
    if (!formData.timeStart || !formData.timeEnd) return true;
    const startIdx = HALF_HOUR_TIMES.indexOf(formData.timeStart);
    const endIdx = HALF_HOUR_TIMES.indexOf(formData.timeEnd);
    return endIdx > startIdx;
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

      await createMeeting(payload);
      setMessage(`✅ Reunião cadastrada com sucesso!`);
      setIsError(false);

      setFormData({
        title: "",
        meetingDate: "",
        timeStart: "",
        timeEnd: "",
        meetingRoom: "",
        userId: "",
      });

      if (onMeetingAdded) onMeetingAdded();
    } catch (error: unknown) {
      let errorMessage = "Erro ao enviar o formulário";

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setMessage(errorMessage);
      setIsError(true);
    }
  };

  return (
    <div className="meeting-form-container">
      {/* Cabeçalho */}
      <div className="form-header">
        <Image
          src="/governo-do-estado-de-ms.png"
          alt="Governo do Estado de Mato Grosso do Sul"
          width={160}
          height={50}
          priority
        />
        <h2>Agenda de Reuniões</h2>
        <div className="calendar-toggle">
          <button
            className={view === "monthly" ? "active" : ""}
            onClick={() => setView("monthly")}
          >
            Calendário Mensal
          </button>
          <button
            className={view === "weekly" ? "active" : ""}
            onClick={() => setView("weekly")}
          >
            Agenda Semanal
          </button>
        </div>
      </div>

      {/* Formulário */}
      <h3>Cadastro de Reunião</h3>
      <form className="meeting-form" onSubmit={handleSubmit}>
        <label htmlFor="title">Título da Reunião:</label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Título da reunião"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="meetingDate">Data da Reunião:</label>
        <input
          type="text"
          name="meetingDate"
          id="meetingDate"
          placeholder="Data (dd-MM-yyyy)"
          value={formData.meetingDate}
          onChange={handleChange}
          required
        />

        {/* Horários na mesma linha */}
        <div className="time-row">
          <div className="time-field">
            <label htmlFor="timeStart">Início:</label>
            <select
              name="timeStart"
              id="timeStart"
              value={formData.timeStart}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              {HALF_HOUR_TIMES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="time-field">
            <label htmlFor="timeEnd">Fim:</label>
            <select
              name="timeEnd"
              id="timeEnd"
              value={formData.timeEnd}
              onChange={handleChange}
              required
              disabled={!formData.timeStart}
            >
              <option value="">
                {formData.timeStart ? "Selecione..." : "Escolha o início"}
              </option>
              {availableEndTimes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <label htmlFor="meetingRoom">Sala da Reunião:</label>
        <input
          type="text"
          name="meetingRoom"
          id="meetingRoom"
          placeholder="Sala da reunião"
          value={formData.meetingRoom}
          onChange={handleChange}
          required
        />

        <label htmlFor="userId">ID do Responsável:</label>
        <input
          type="number"
          name="userId"
          id="userId"
          placeholder="ID do responsável"
          value={formData.userId}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn-submit">Cadastrar Reunião</button>
      </form>

      {message && (
        <p className={`meeting-form-message ${isError ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
