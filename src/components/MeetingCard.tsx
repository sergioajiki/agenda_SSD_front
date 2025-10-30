"use client";

import { MeetingResponse } from "@/models/Meetings";
import "./styles/MeetingCard.css";

interface MeetingCardProps {
  meeting: MeetingResponse;             // Dados da reunião
  userId?: number | null;               // ID do usuário logado (para validação)
  onDelete?: (id: number) => void;      // Função para excluir reunião
  onEdit?: (meeting: MeetingResponse) => void; // Função para editar reunião
}

export default function MeetingCard({
  meeting,
  userId,
  onDelete,
  onEdit,
}: MeetingCardProps) {

  /** 🔹 Converte a data do formato YYYY-MM-DD para DD/MM/YYYY */
  const formatDateBR = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  /** 🔹 Apenas o criador da reunião pode editar/excluir */
  const canModify = !!userId && userId === meeting.userId;

  return (
    <div className="meeting-card">
      {/* 🔹 Cabeçalho com título e ID */}
      <div className="meeting-card-header">
        <h4>{meeting.title}</h4>
        <span className="meeting-id">ID: {meeting.id}</span>
      </div>

      {/* 🔹 Corpo do card com dados principais */}
      <div className="meeting-card-body">
        <p>
          <strong>Data:</strong> {formatDateBR(meeting.meetingDate)}
        </p>
        <p>
          <strong>Horário:</strong> {meeting.timeStart} - {meeting.timeEnd}
        </p>
        <p>
          <strong>Local:</strong> {meeting.meetingRoom}
        </p>
        <p>
          <strong>Responsável (ID):</strong> {meeting.userId}
        </p>
                <p>
          <strong>Responsável (Nome):</strong> {meeting.userName}
        </p>
      </div>

      {/* 🔹 Ações visíveis apenas para o usuário dono da reunião */}
      {canModify && (
        <div className="meeting-card-actions">
          {/* ✏️ Botão Editar */}
          {onEdit && (
            <button
              type="button"
              className="btn-edit"
              onClick={() => onEdit(meeting)}
              title="Editar reunião"
            >
              ✏️ Editar
            </button>
          )}

          {/* 🗑️ Botão Excluir */}
          {onDelete && (
            <button
              type="button"
              className="btn-delete"
              onClick={() => onDelete(meeting.id)}
              title="Excluir reunião"
            >
              🗑️ Excluir
            </button>
          )}
        </div>
      )}
    </div>
  );
}
