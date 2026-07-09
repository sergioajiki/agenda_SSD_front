"use client";

import { useState, useEffect } from "react";
import { createMeeting, updateMeeting } from "@/services/meetingService";
import { MeetingRequest, MeetingResponse } from "@/models/Meetings";
import "./styles/MeetingForm.css";

type MeetingFormProps = {
  onMeetingAdded: () => void;          // 🔹 Callback para atualizar lista após salvar
  isBlocked: boolean;                  // 🔹 Bloqueia o formulário se usuário não estiver logado
  userId?: number;                     // 🔹 ID do usuário logado
  editMeeting?: MeetingResponse | null;// 🔹 Dados da reunião sendo editada (opcional)
  onCancelEdit?: () => void;           // 🔹 Função chamada ao cancelar edição
  selectedDate?: string | null;        // 🔹 Data clicada no calendário
};

export default function MeetingForm({
  onMeetingAdded,
  isBlocked,
  userId,
  editMeeting,
  onCancelEdit,
  selectedDate,
}: MeetingFormProps) {
  /** 🔹 Estados controlados */
  const [title, setTitle] = useState("");           // Título da reunião
  const [meetingRoom, setMeetingRoom] = useState("APOIO"); // Sala escolhida
  const [meetingDate, setMeetingDate] = useState("");       // Data da reunião
  const [timeStart, setTimeStart] = useState("");           // Horário de início
  const [timeEnd, setTimeEnd] = useState("");               // Horário de término
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "warning" | "";
  }>({ text: "", type: "" });  // Exibe mensagens temporárias (success | error | warning)

  /** 🔹 Gera os horários disponíveis de 07:30 até 18:30 em intervalos de 30 minutos */
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

  /** 🔹 Limpa os campos do formulário (não notifica o pai) */
  const clearFields = () => {
    setTitle("");
    setMeetingRoom("APOIO");
    setMeetingDate("");
    setTimeStart("");
    setTimeEnd("");
  };

  /** 🔹 Quando entra em modo edição, preenche os campos com os dados da reunião */
  useEffect(() => {
    if (editMeeting) {
      setTitle(editMeeting.title || "");
      setMeetingRoom(editMeeting.meetingRoom || "APOIO");
      setMeetingDate(editMeeting.meetingDate || "");
      setTimeStart(editMeeting.timeStart?.substring(0, 5) || "");
      setTimeEnd(editMeeting.timeEnd?.substring(0, 5) || "");
    } else {
      clearFields(); // limpa tudo se não estiver editando
    }
  }, [editMeeting]);

  /** 🔹 Quando o usuário clica em um dia no calendário */
  useEffect(() => {
    if (selectedDate && !editMeeting) {
      setMeetingDate(selectedDate); // Preenche o campo de data automaticamente
    }
  }, [selectedDate, editMeeting]);

  /** 🔹 Reseta o formulário após salvar (não notifica o pai) */
  const resetForm = () => {
    clearFields();
  };

  /** 🔹 Cancela a edição em andamento — limpa e avisa o pai */
  const cancelEdit = () => {
    clearFields();
    if (onCancelEdit) onCancelEdit();
  };

  /** 🔹 Define a data mínima possível (hoje) */
  const todayDate = new Date().toISOString().split("T")[0];

  /** 🔹 Filtra os horários de término para mostrar apenas opções após o início */
  const filteredEndTimes = timeStart
    ? allTimes.filter((t) => t > timeStart)
    : allTimes;

  /** 🔹 Submissão do formulário */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bloqueia se usuário não autenticado
    if (!userId) {
      setTempMessage("⚠️ Faça login para agendar uma reunião.", "warning");
      return;
    }

    // Valida intervalo de horários
    if (timeStart >= timeEnd) {
      setTempMessage("⚠️ O horário final deve ser posterior ao inicial.", "warning");
      return;
    }

    // Monta objeto para enviar ao backend
    const meeting: MeetingRequest = {
      title,
      meetingRoom,
      meetingDate,
      timeStart,
      timeEnd,
      userId,
    };

    try {
      // Se estiver editando, atualiza
      if (editMeeting) {
        await updateMeeting(editMeeting.id, meeting, userId);
        setTempMessage("✅ Reunião atualizada com sucesso!", "success");
      }
      // Caso contrário, cria nova
      else {
        await createMeeting(meeting);
        setTempMessage("✅ Reunião cadastrada com sucesso!", "success");
      }

      onMeetingAdded(); // atualiza a lista
      resetForm(); // limpa o formulário            
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao salvar reunião.";
      setTempMessage("❌ " + msg, "error");
    }
  };

  /** 🔹 Mostra mensagem temporária e desaparece em 3s */
  const setTempMessage = (text: string, type: "success" | "error" | "warning") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };
  return (
    <div className="meeting-form-container">
      <h3>{editMeeting ? "Editar Reunião" : "Agendar Reunião"}</h3>

      <form onSubmit={handleSubmit} className="meeting-form">
        {/* 🔹 Campo de título */}
        <label htmlFor="meetingTitle">Título</label>
        <input
          id="meetingTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isBlocked}
          required
        />

        {/* 🔹 Campo de data (mínimo = hoje) */}
        <label htmlFor="meetingDate">Data</label>
        <input
          id="meetingDate"
          type="date"
          value={meetingDate}
          min={todayDate}
          onChange={(e) => setMeetingDate(e.target.value)}
          disabled={isBlocked}
          required
        />

        {/* 🔹 Seleção de horários */}
        <div className="time-row">
          <div className="time-field">
            <label htmlFor="meetingTimeStart">Início</label>
            <select
              id="meetingTimeStart"
              value={timeStart}
              onChange={(e) => {
                setTimeStart(e.target.value);
                setTimeEnd(""); // limpa término ao mudar início
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
            <label htmlFor="meetingTimeEnd">Término</label>
            <select
              id="meetingTimeEnd"
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

        {/* 🔹 Campo de sala (fixo com placeholder para futuras opções) */}
        <label htmlFor="meetingRoom">Sala</label>
        <select
          id="meetingRoom"
          value={meetingRoom}
          onChange={(e) => setMeetingRoom(e.target.value)}
          required
          disabled={isBlocked}
        >
          <option value="APOIO">APOIO</option>
          <option value="CIEGES">CIEGES</option>
          <option value="SALA WEB">SALA WEB</option>
        </select>


        {!isBlocked && (
          <div className="form-buttons">
            <button type="submit" className="btn-submit">
              {editMeeting ? "Atualizar" : "Cadastrar"}
            </button>
            {editMeeting && (
              <button type="button" className="btn-cancel" onClick={cancelEdit}>
                Cancelar
              </button>
            )}
          </div>
        )}

        {/* 🔹 Mensagem flutuante (não empurra conteúdo) */}
        {message.text && (
          <div className={`floating-message ${message.type}`}>{message.text}</div>
        )}
      </form>

    </div>
  );
}
