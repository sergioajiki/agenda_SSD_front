"use client";

import Image from "next/image";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import WeeklyCalendar2v from "@/components/WeeklyCalendar2v";
import MeetingForm from "@/components/MeetingForm";
import MeetingCard from "@/components/MeetingCard";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import FloatingMessage from "@/components/FloatingMessage";

import { useFloatingMessage } from "@/hooks/useFloatingMessage";
import { useAuth } from "@/hooks/useAuth";
import { useMeetings } from "@/hooks/useMeetings";

import "./styles/Page.css";
import { useState } from "react";

export default function CalendarPage() {
  /** =======================================================
   *  🔹 HOOK DE MENSAGEM GLOBAL
   * ======================================================= */
  const { floatingMessage, showMessage } = useFloatingMessage();

  /** =======================================================
   *  🔹 AUTENTICAÇÃO
   * ======================================================= */
  const { user, login, logout, showRegister, toggleRegister } = useAuth(showMessage);

  /** =======================================================
   *  🔹 REUNIÕES / CALENDÁRIO / POLLING
   * ======================================================= */
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

  /** 🔹 Controle da visão atual */
  const [view, setView] = useState<"monthly" | "weekly">("monthly");

  // =======================================================
  // 🔹 RENDER COMPONENT
  // =======================================================
  return (
    <div className="calendar-page">
      <div className="calendar-layout">

        {/* =======================================================
            🔸 COLUNA ESQUERDA — LOGIN / FORM
        ======================================================= */}
        <div className="calendar-left-column">
          <Image
            src="/governo-do-estado-de-ms.png"
            alt="Logo Governo do Estado de MS"
            className="app-logo"
            width={180}
            height={60}
            priority
          />

          {/* 🔹 Alternância mensal / semanal */}
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

          {/* 🔹 BLOCO DE AUTENTICAÇÃO */}
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
                    <LoginForm
                      onLoginSuccess={login}
                      onLogout={logout}
                      loggedUser={null}
                    />
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

          {/* 🔹 Formulário de Agendamento */}
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
        </div>

        {/* =======================================================
            🔸 COLUNA CENTRAL — CALENDÁRIO
        ======================================================= */}
        <div className="calendar-center-column">
          {view === "monthly" ? (
            <MonthlyCalendar meetings={meetings} onDayClick={handleDayClick} />
          ) : (
            <WeeklyCalendar2v meetings={meetings} onDayClick={handleDayClick} />
          )}
        </div>

        {/* =======================================================
            🔸 COLUNA DIREITA — CARDS
        ======================================================= */}
        <div className="calendar-right-column">
          <h3>Reuniões de {selectedDate.split("-").reverse().join("/")}</h3>

          <div className="meeting-cards-grid">
            {selectedMeetings.length > 0 ? (
              selectedMeetings.map((m) => (
                <MeetingCard
                  key={m.id}
                  meeting={m}
                  userId={user?.id}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))
            ) : (
              <p>📅 Sem reuniões para esta data.</p>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 Notificação de atualização */}
      {showUpdateNotice && <div className="update-notice">🔄 Atualizando...</div>}

      {/* 🔹 Mensagem flutuante global */}
      {floatingMessage && (
        <FloatingMessage
          text={floatingMessage.text}
          type={floatingMessage.type}
          duration={3000}
        />
      )}
    </div>
  );
}
