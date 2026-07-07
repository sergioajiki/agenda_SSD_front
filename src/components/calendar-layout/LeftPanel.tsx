"use client";
import MeetingForm from "@/components/MeetingForm";
import { LoginResponse } from "@/models/Auth";
import { MessageType } from "@/hooks/useFloatingMessage";

import "./LeftPanel.css";

/**
 * LeftPanel Props — painél esquerdo do layout
 */
type LeftPanelProps = {
  user: LoginResponse | null;

  selectedDate: string;
  editingMeeting: any;
  setEditingMeeting: (m: any) => void;

  fetchMeetings: (force?: boolean) => void;

  showMessage: (msg: string, type?: MessageType, duration?: number) => void;
};

export default function LeftPanel({
  user,
  selectedDate,
  editingMeeting,
  setEditingMeeting,
  fetchMeetings,
  showMessage,
}: LeftPanelProps) {
  return (
    <MeetingForm
      onMeetingAdded={() => {
        fetchMeetings(true);
        showMessage("✅ Reunião cadastrada com sucesso!", "success");
      }}
      isBlocked={!user}
      userId={user?.id}
      editMeeting={editingMeeting}
      onCancelEdit={() => setEditingMeeting(null)}
      selectedDate={selectedDate}
    />
  );
}
