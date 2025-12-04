"use client";
import Image from "next/image";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import MeetingForm from "@/components/MeetingForm";

import "./LeftPanel.css"

type LeftPanelProps = {
    user: any;
    login: (u: any) => void;
    logout: () => void;
    showRegister: boolean;
    toggleRegister: () => void;

    view: "monthly" | "weekly";
    setView: (v: "monthly" | "weekly") => void;

    selectedDate: string;
    editingMeeting: any;
    setEditingMeeting: (m: any) => void;
    fetchMeetings: (force?: boolean) => void;
    showMessage: (msg: string, type?: any) => void;
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
    showMessage
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

            {/* Autenticação */}
            <div className="auth-section">
                {!user ? (
                    <>
                        {/* Apenas login */}
                        <LoginForm onLoginSuccess={login} loggedUser={null} />
                    </>
                ) : (
                    <div className="logged-user-info">
                        <p>👤 {user.name}</p>
                        <button className="btn-logout" onClick={logout}>
                            Sair
                        </button>
                    </div>
                )}
            </div>

            {/* Autenticação com primeiro acesso 
      <div className="auth-section">
        {!user ? (
          <>
            {showRegister ? (
              <>
                <RegisterForm />
                <button className="switch-auth-button" onClick={toggleRegister}>
                  Já tem acesso? Fazer Login
                </button>
              </>
            ) : (
              <>
                <LoginForm onLoginSuccess={login} loggedUser={null} />
                <button className="switch-auth-button" onClick={toggleRegister}>
                  Primeiro Acesso? Cadastrar Usuário
                </button>
              </>
            )}
          </>
        ) : (
          <div className="logged-user-info">
            <p>👤 {user.name}</p>
            <button className="btn-logout" onClick={logout}>Sair</button>
          </div>
        )}
      </div>
       */}

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
