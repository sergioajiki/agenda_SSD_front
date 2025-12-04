"use client";

import CalendarLayout from "@/components/calendar-layout/CalendarLayout";
import LeftPanel from "@/components/calendar-layout/LeftPanel";
import CenterPanel from "@/components/calendar-layout/CenterPanel";
import RightPanel from "@/components/calendar-layout/RightPanel";
import FloatingMessage from "@/components/FloatingMessage";

import { useFloatingMessage } from "@/hooks/useFloatingMessage";
import { useAuth } from "@/hooks/useAuth";
import { useMeetings } from "@/hooks/useMeetings";
import { useState } from "react";

export default function CalendarPage() {
  const { floatingMessage, showMessage } = useFloatingMessage();
  const { user, login, logout, showRegister, toggleRegister } = useAuth(showMessage);

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
    fetchMeetings
  } = useMeetings(user?.id, showMessage);

  const [view, setView] = useState<"monthly" | "weekly">("monthly");

  return (
    <CalendarLayout
      left={
        <LeftPanel
          user={user}
          login={login}
          logout={logout}
          showRegister={showRegister}
          toggleRegister={toggleRegister}
          view={view}
          setView={setView}
          selectedDate={selectedDate}
          editingMeeting={editingMeeting}
          setEditingMeeting={setEditingMeeting}
          fetchMeetings={fetchMeetings}
          showMessage={showMessage}
        />
      }
      center={<CenterPanel view={view} meetings={meetings} onDayClick={handleDayClick} />}
      right={
        <RightPanel
          selectedDate={selectedDate}
          selectedMeetings={selectedMeetings}
          userId={user?.id}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      }
      updateNotice={showUpdateNotice}
      floatingMessage={floatingMessage && (
        <FloatingMessage text={floatingMessage.text} type={floatingMessage.type} duration={3000} />
      )}
    />
  );
}
