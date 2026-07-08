"use client";

import CalendarLayout from "@/components/calendar-layout/CalendarLayout";
import TopBar from "@/components/calendar-layout/TopBar";
import MeetingModal from "@/components/calendar-layout/MeetingModal";
import CenterPanel from "@/components/calendar-layout/CenterPanel";
import RightPanel from "@/components/calendar-layout/RightPanel";
import FloatingMessage from "@/components/FloatingMessage";

import { loginUser } from "@/services/authService";

import { useFloatingMessage } from "@/hooks/useFloatingMessage";
import { useAuth } from "@/hooks/useAuth";
import { useMeetings } from "@/hooks/useMeetings";
import { useState } from "react";

export default function CalendarPage() {
  /* 🔹 Hook de mensagens flutuantes (global) */
  const { floatingMessage, showMessage } = useFloatingMessage();

  /* 🔹 Hook de autenticação */
  const { user, logout, setUser } = useAuth(showMessage);

  /* 🔹 Hook de reuniões */
  const {
    meetings,
    selectedDate,
    selectedMeetings,
    editingMeeting,
    showUpdateNotice,
    setEditingMeeting,
    handleDayClick,
    handleDelete,
    handleEdit,
    fetchMeetings,
  } = useMeetings(user?.id, showMessage);

  /* 🔹 Alternância entre mensal/semanal */
  const [view, setView] = useState<"monthly" | "weekly">("monthly");

  /* 🔹 Filtro por sala — ativado clicando numa sala da legenda */
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const toggleRoomFilter = (room: string) => {
    setSelectedRoom((prev) => (prev === room ? null : room));
  };
  const displayedMeetings = selectedRoom
    ? meetings.filter((m) => m.meetingRoom === selectedRoom)
    : meetings;
  const displayedSelectedMeetings = selectedRoom
    ? selectedMeetings.filter((m) => m.meetingRoom === selectedRoom)
    : selectedMeetings;

  /* 🔹 Controla a abertura do modal de nova reunião (edição abre via editingMeeting) */
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const isMeetingModalOpen = isNewMeetingOpen || !!editingMeeting;

  const closeMeetingModal = () => {
    setIsNewMeetingOpen(false);
    setEditingMeeting(null);
  };

  /**
   * 🔥 LOGIN ALINHADO AO LoginForm
   * (email: string, password: string) => Promise<void>
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const userData = await loginUser({ email, password });

      setUser(userData);

      showMessage("Login realizado com sucesso!", "success");
    } catch {
      showMessage("Erro ao realizar login", "error");
      throw new Error("Login failed");
    }
  };

  return (
    <CalendarLayout
      top={
        <TopBar
          user={user}
          login={login}
          logout={logout}
          view={view}
          setView={setView}
          onNewMeeting={() => {
            if (!user) {
              showMessage("⚠️ Faça login para agendar uma reunião.", "warning");
              return;
            }
            setIsNewMeetingOpen(true);
          }}
          showMessage={showMessage}
        />
      }
      center={
        <CenterPanel
          view={view}
          meetings={displayedMeetings}
          onDayClick={handleDayClick}
          selectedRoom={selectedRoom}
          onRoomToggle={toggleRoomFilter}
        />
      }
      right={
        <RightPanel
          selectedDate={selectedDate}
          selectedMeetings={displayedSelectedMeetings}
          userId={user?.id}
          userRole={user?.role}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      }
      modal={
        isMeetingModalOpen && (
          <MeetingModal
            onClose={closeMeetingModal}
            onMeetingAdded={() => {
              fetchMeetings(true);
              showMessage("✅ Reunião cadastrada com sucesso!", "success");
              closeMeetingModal();
            }}
            isBlocked={!user}
            userId={user?.id}
            editMeeting={editingMeeting}
            selectedDate={selectedDate}
          />
        )
      }
      updateNotice={showUpdateNotice}
      floatingMessage={
        floatingMessage && (
          <FloatingMessage
            text={floatingMessage.text}
            type={floatingMessage.type}
            duration={3000}
          />
        )
      }
    />
  );
}
