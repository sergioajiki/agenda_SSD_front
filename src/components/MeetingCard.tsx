"use client";

import { MeetingResponse } from "@/models/Meetings";
import { getRoomBorderClass, getRoomColor } from "@/utils/roomStyles";
import "./styles/MeetingCard.css";

interface MeetingCardProps {
  meeting: MeetingResponse;
  userId?: number | null;
  userRole?: string | null;
  onDelete?: (id: number) => void;
  onEdit?: (meeting: MeetingResponse) => void;
}

export default function MeetingCard({
  meeting,
  userId,
  userRole,
  onDelete,
  onEdit,
}: MeetingCardProps) {

  /* Permissões */
  const isOwner = userId === meeting.userId;
  const isAdmin = userRole === "ADMIN";
  const canModify = isOwner || isAdmin;

  /* Classe visual da sala */
  const roomClass = getRoomBorderClass(meeting.meetingRoom);
  const roomColor = getRoomColor(meeting.meetingRoom);

  /* Reunião que já começou (mesma regra usada para bloquear edição) */
  const isPast =
    new Date(`${meeting.meetingDate}T${meeting.timeStart}`) <= new Date();

  const handleDeleteClick = () => {
    if (window.confirm(`Excluir a reunião "${meeting.title}"?`)) {
      onDelete?.(meeting.id);
    }
  };

  return (
    <div
      className={`meeting-card ${roomClass}${isPast ? " meeting-card--past" : ""}`}
    >
      <div className="meeting-card-top">
        <span className="meeting-card-time">
          {meeting.timeStart} – {meeting.timeEnd}
        </span>
        <span className="meeting-card-room">
          <span
            className="meeting-card-dot"
            style={{ backgroundColor: roomColor }}
          />
          {meeting.meetingRoom}
        </span>
      </div>

      <p className="meeting-card-title">{meeting.title}</p>

      <div className="meeting-card-footer">
        <span className="meeting-card-owner">Marcado por {meeting.userName}</span>

        {/* Ícones só para Owner OU Admin */}
        {canModify && (
          <div className="meeting-card-icons">
            {onEdit && (
              <button
                type="button"
                className="icon-btn"
                onClick={() => onEdit(meeting)}
                disabled={isPast}
                title={
                  isPast
                    ? "Não é possível editar uma reunião que já começou"
                    : "Editar reunião"
                }
                aria-label="Editar reunião"
              >
                ✏️
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                className="icon-btn"
                onClick={handleDeleteClick}
                title="Excluir reunião"
                aria-label="Excluir reunião"
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
