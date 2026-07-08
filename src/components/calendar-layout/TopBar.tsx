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
        src="/logotipo_ssd_no_background.png"
        alt="Logo SSD"
        className="topbar-logo"
        width={130}
        height={60}
        priority
      />

      <div className={`seg-toggle${view === "weekly" ? " second" : ""}`}>
        <span className="seg-thumb" />
        <button
          type="button"
          className={`seg-option${view === "monthly" ? " active" : ""}`}
          onClick={() => setView("monthly")}
        >
          Mensal
        </button>

        <button
          type="button"
          className={`seg-option${view === "weekly" ? " active" : ""}`}
          onClick={() => setView("weekly")}
        >
          Semanal
        </button>
      </div>

      <button className="btn-new-meeting" onClick={onNewMeeting}>
        Agendar
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
