"use client";

import { MeetingResponse } from "@/models/Meetings";
import "./styles/MeetingCard.css";

interface MeetingCardProps {
  meeting: MeetingResponse;
  userId?: number | null;
  onDelete?: (id: number) => void;
}

export default function MeetingCard({ meeting, userId, onDelete }: MeetingCardProps) {
  const formatDateBR = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="meeting-card">
      <div className="meeting-card-header">
        <h4>{meeting.title}</h4>
        <span className="meeting-id">ID: {meeting.id}</span>
      </div>

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
      </div>

      {/* 🔹 Botão de excluir aparece só para o dono da reunião */}
      {userId && Number(meeting.userId) === userId && (
        <button
          className="btn-delete"
          onClick={() => onDelete && onDelete(meeting.id)}
        >
          🗑 Excluir
        </button>
      )}
    </div>
  );
}
