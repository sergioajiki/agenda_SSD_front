"use client";
import { useEffect } from "react";
import MeetingForm from "@/components/MeetingForm";
import { MeetingResponse } from "@/models/Meetings";

import "./MeetingModal.css";

type MeetingModalProps = {
  onClose: () => void;
  onMeetingAdded: () => void;
  isBlocked: boolean;
  userId?: number;
  editMeeting?: MeetingResponse | null;
  selectedDate?: string | null;
};

export default function MeetingModal({
  onClose,
  onMeetingAdded,
  isBlocked,
  userId,
  editMeeting,
  selectedDate,
}: MeetingModalProps) {
  /* Fecha o modal ao pressionar Esc */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="meeting-modal-overlay" onClick={onClose}>
      <div className="meeting-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="meeting-modal-close"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>

        <MeetingForm
          onMeetingAdded={onMeetingAdded}
          isBlocked={isBlocked}
          userId={userId}
          editMeeting={editMeeting}
          onCancelEdit={onClose}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
}
