"use client";

import { MeetingResponse } from "@/models/Meetings";
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

  /* Formata data */
  const formatDateBR = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  /* Permissões */
  const isOwner = userId === meeting.userId;
  const isAdmin = userRole === "ADMIN";
  const canModify = isOwner || isAdmin;

  /* Classe visual da sala */
  let roomClass = "";
  if (meeting.meetingRoom === "APOIO") roomClass = "apoio-border";
  else if (meeting.meetingRoom === "CIEGES") roomClass = "cieges-border";
  else roomClass = "mixed-border";

  return (
    <div className={`meeting-card ${roomClass}`}>
      
      <div className="meeting-card-header">
        <h4>{meeting.title}</h4>
        <span className="meeting-id">ID: {meeting.id}</span>
      </div>

      <div className="meeting-card-body">
        <p><strong>Data:</strong> {formatDateBR(meeting.meetingDate)}</p>
        <p><strong>Horário:</strong> {meeting.timeStart} - {meeting.timeEnd}</p>
        <p><strong>Local:</strong> {meeting.meetingRoom}</p>
        <p><strong>Responsável:</strong> {meeting.userName}</p>
      </div>

      {/* Botões só para Owner OU Admin */}
      {canModify && (
        <div className="meeting-card-actions">
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
