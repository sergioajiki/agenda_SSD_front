"use client";

import { useState, useEffect } from "react";
import { createMeeting, updateMeeting } from "@/services/meetingService";
import { MeetingRequest, MeetingResponse } from "@/models/Meetings";
import "./styles/MeetingForm.css";

type MeetingFormProps = {
  onMeetingAdded: () => void;
  isBlocked: boolean;
  userId?: number;
  editMeeting?: MeetingResponse | null;
  onCancelEdit?: () => void;
};

export default function MeetingForm({
  onMeetingAdded,
  isBlocked,
  userId,
  editMeeting,
  onCancelEdit,
}: MeetingFormProps) {
  const [title, setTitle] = useState("");
  const [meetingRoom, setMeetingRoom] = useState("APOIO");
  const [meetingDate, setMeetingDate] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({
    text: "",
    type: "",
  });

  /** 🔹 Gera horários de 07:30 até 18:30 em intervalos de 30 minutos */
  const generateTimeOptions = () => {
    const times: string[] = [];
    let hour = 7;
    let minute = 30;
    while (hour < 19) {
      times.push(`${String(hour).padStart(2, "0")}:${minute === 0 ? "00" : "30"}`);
      minute += 30;
      if (minute === 60) {
        minute = 0;
        hour++;
      }
    }
    return times;
  };

  const allTimes = generateTimeOptions();

  /** 🔹 Preenche os campos no modo de edição */
  useEffect(() => {
    if (editMeeting) {
      setTitle(editMeeting.title || "");
      setMeetingRoom(editMeeting.meetingRoom || "APOIO");
      setMeetingDate(editMeeting.meetingDate || "");
      setTimeStart(editMeeting.timeStart?.substring(0, 5) || "");
      setTimeEnd(editMeeting.timeEnd?.substring(0, 5) || "");
    } else {
      resetForm();
    }
  }, [editMeeting]);

  const resetForm = () => {
    setTitle("");
    setMeetingRoom("APOIO");
    setMeetingDate("");
    setTimeStart("");
    setTimeEnd("");
    if (onCancelEdit) onCancelEdit();
  };

  /** 🔹 Calcula o dia atual em formato YYYY-MM-DD */
  const todayDate = new Date().toISOString().split("T")[0];

  /** 🔹 Opções de horário final: só exibe horários posteriores ao início */
  const filteredEndTimes = timeStart
    ? allTimes.filter((t) => t > timeStart)
    : allTimes;

  /** 🔹 Submissão do formulário */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setMessage({ text: "Usuário não autenticado.", type: "error" });
      return;
    }

    if (timeStart >= timeEnd) {
      setMessage({
        text: "O horário final deve ser posterior ao horário inicial.",
        type: "error",
      });
      return;
    }

    const meeting: MeetingRequest = {
      title,
      meetingRoom,
      meetingDate,
      timeStart,
      timeEnd,
      userId,
    };

    try {
      if (editMeeting) {
        await updateMeeting(editMeeting.id, meeting, userId);
        setMessage({ text: "Reunião atualizada com sucesso!", type: "success" });
      } else {
        await createMeeting(meeting);
        setMessage({ text: "Reunião cadastrada com sucesso!", type: "success" });
      }

      onMeetingAdded();
      resetForm();
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Erro ao salvar reunião.";
      setMessage({ text: errMsg, type: "error" });
    }
  };

  return (
    <div className="meeting-form-container">
      <h3>{editMeeting ? "Editar Reunião" : "Agendar Reunião"}</h3>

      <form onSubmit={handleSubmit} className="meeting-form">
        {/* 🔹 Título */}
        <label>Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isBlocked}
          required
        />

        {/* 🔹 Data (mínimo = hoje) */}
        <label>Data</label>
        <input
          type="date"
          value={meetingDate}
          min={todayDate}
          onChange={(e) => setMeetingDate(e.target.value)}
          disabled={isBlocked}
          required
        />

        {/* 🔹 Horários */}
        <div className="time-row">
          <div className="time-field">
            <label>Início</label>
            <select
              value={timeStart}
              onChange={(e) => {
                setTimeStart(e.target.value);
                setTimeEnd("");
              }}
              disabled={isBlocked}
              required
            >
              <option value="">Selecione</option>
              {allTimes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="time-field">
            <label>Término</label>
            <select
              value={timeEnd}
              onChange={(e) => setTimeEnd(e.target.value)}
              disabled={isBlocked || !timeStart}
              required
            >
              <option value="">Selecione</option>
              {filteredEndTimes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 🔹 Sala */}
        <label htmlFor="meetingRoom">Sala</label>
        <select
          id="meetingRoom"
          value={meetingRoom}
          onChange={(e) => setMeetingRoom(e.target.value)}
          required
          disabled={isBlocked}
        >
          {/* 🏢 Aqui serão adicionadas as outras opções de sala futuramente */}
          <option value="APOIO">APOIO</option>
        </select>

        {/* 🔹 Botões */}
        <div className="form-buttons">
          <button
            type="submit"
            className="btn-submit"
            disabled={isBlocked || !userId}
          >
            {editMeeting ? "Atualizar" : "Cadastrar"}
          </button>

          {editMeeting && (
            <button
              type="button"
              className="btn-cancel"
              onClick={resetForm}
              disabled={isBlocked}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {message.text && (
        <p className={`meeting-form-message ${message.type}`}>{message.text}</p>
      )}
    </div>
  );
}
