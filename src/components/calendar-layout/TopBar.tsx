"use client";
import Image from "next/image";
import LoginForm from "@/components/LoginForm";
import { LoginResponse } from "@/models/Auth";
import { MessageType } from "@/hooks/useFloatingMessage";

import "./TopBar.css";

type TopBarProps = {
  user: LoginResponse | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

  view: "monthly" | "weekly";
  setView: (v: "monthly" | "weekly") => void;

  onNewMeeting: () => void;

  showMessage: (msg: string, type?: MessageType, duration?: number) => void;
};

export default function TopBar({
  user,
  login,
  logout,
  view,
  setView,
  onNewMeeting,
  showMessage,
}: TopBarProps) {
  return (
    <header className="calendar-topbar">
      <Image
        src="/governo-do-estado-de-ms.png"
        alt="Logo Governo do Estado de MS"
        className="topbar-logo"
        width={120}
        height={60}
        priority
      />

      <div className="calendar-toggle">
        <button
          className={view === "monthly" ? "active" : ""}
          onClick={() => setView("monthly")}
        >
          Calendário Mensal
        </button>

        <button
          className={view === "weekly" ? "active" : ""}
          onClick={() => setView("weekly")}
        >
          Agenda Semanal
        </button>
      </div>

      <button className="btn-new-meeting" onClick={onNewMeeting}>
        + Nova Reunião
      </button>

      <div className="topbar-spacer" />

      <div className="topbar-auth">
        <LoginForm
          onLogin={login}
          onLogout={logout}
          loggedUser={user}
          showMessage={showMessage}
        />
      </div>
    </header>
  );
}
