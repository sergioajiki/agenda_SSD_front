"use client";

import CalendarLayout from "@/components/calendar-layout/CalendarLayout";
import TopBar from "@/components/calendar-layout/TopBar";
import LeftPanel from "@/components/calendar-layout/LeftPanel";
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
          showMessage={showMessage}
        />
      }
      left={
        <LeftPanel
          user={user}
          selectedDate={selectedDate}
          editingMeeting={editingMeeting}
          setEditingMeeting={setEditingMeeting}
          fetchMeetings={fetchMeetings}
          showMessage={showMessage}
        />
      }
      center={
        <CenterPanel
          view={view}
          meetings={meetings}
          onDayClick={handleDayClick}
        />
      }
      right={
        <RightPanel
          selectedDate={selectedDate}
          selectedMeetings={selectedMeetings}
          userId={user?.id}
          userRole={user?.role}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
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
