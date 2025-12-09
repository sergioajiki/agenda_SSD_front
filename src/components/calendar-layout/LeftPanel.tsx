"use client";
import Image from "next/image";
import LoginForm from "@/components/LoginForm";
import MeetingForm from "@/components/MeetingForm";
import { LoginResponse } from "@/models/Auth";
import { MessageType } from "@/hooks/useFloatingMessage";

import "./LeftPanel.css";

/**
 * LeftPanel Props — painél esquerdo do layout
 */
type LeftPanelProps = {
  user: LoginResponse | null;
  login: (email: string, password: string) => Promise<void>; // compatível com LoginForm
  logout: () => void;
  showRegister: boolean;
  toggleRegister: () => void;

  view: "monthly" | "weekly";
  setView: (v: "monthly" | "weekly") => void;

  selectedDate: string;
  editingMeeting: any;
  setEditingMeeting: (m: any) => void;

  fetchMeetings: (force?: boolean) => void;

  showMessage: (msg: string, type?: MessageType, duration?: number) => void;
};

export default function LeftPanel({
  user,
  login,
  logout,
  showRegister,
  toggleRegister,
  view,
  setView,
  selectedDate,
  editingMeeting,
  setEditingMeeting,
  fetchMeetings,
  showMessage,
}: LeftPanelProps) {
  return (
    <>
      <Image
        src="/governo-do-estado-de-ms.png"
        alt="Logo Governo do Estado de MS"
        className="app-logo"
        width={160}
        height={80}
        priority
      />

      {/* Alternância de calendário */}
      <div className="calendar-toggle">
        <button className={view === "monthly" ? "active" : ""} onClick={() => setView("monthly")}>
          Calendário Mensal
        </button>

        <button className={view === "weekly" ? "active" : ""} onClick={() => setView("weekly")}>
          Agenda Semanal
        </button>
      </div>

      {/* Área de autenticação — passamos onLogin e showMessage para o LoginForm */}
      <div className="auth-section">
        {!user ? (
          <LoginForm onLogin={login} onLogout={logout} loggedUser={null} showMessage={showMessage} />
        ) : (
          <div className="logged-user-info">
            <p>👤 {user.name}</p>
            <button className="btn-logout" onClick={logout}>
              Sair
            </button>
          </div>
        )}
      </div>

      {/* Formulário de Reunião */}
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
    </>
  );
}
