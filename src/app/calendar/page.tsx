"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import MeetingForm from "@/components/MeetingForm";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import WeeklyCalendar2v from "@/components/WeeklyCalendar2v";
import MeetingCard from "@/components/MeetingCard";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { getMeetings, deleteMeeting } from "@/services/meetingService";
import { MeetingResponse } from "@/models/Meetings";
import { LoginResponse } from "@/models/Auth";
import "./styles/Page.css";

/** 🔹 Tipo de usuário autenticado */
type User = LoginResponse;

export default function CalendarPage() {
  // Controle de visualização: mensal ou semanal
  const [view, setView] = useState<"monthly" | "weekly">("monthly");

  // Lista de reuniões vindas do backend
  const [meetings, setMeetings] = useState<MeetingResponse[]>([]);

  // Lista de reuniões do dia selecionado
  const [selectedMeetings, setSelectedMeetings] = useState<MeetingResponse[]>([]);

  // Data atualmente selecionada (inicia com o dia atual)
  const [selectedDate, setSelectedDate] = useState<string>(
    () => new Date().toISOString().split("T")[0]
  );

  // Usuário autenticado
  const [user, setUser] = useState<User | null>(null);

  // Reunião em modo de edição
  const [editingMeeting, setEditingMeeting] = useState<MeetingResponse | null>(null);

  // Controle de exibição: login ↔ cadastro
  const [showRegister, setShowRegister] = useState(false);

  /** 🔹 Busca todas as reuniões do backend */
  const fetchMeetings = useCallback(async () => {
    try {
      const data = await getMeetings();
      setMeetings(data);

      // Exibe automaticamente as reuniões do dia atual
      const today = new Date().toISOString().split("T")[0];
      const filtered = data.filter((m) => m.meetingDate === today);
      setSelectedMeetings(filtered);
      setSelectedDate(today);
    } catch {
      alert("❌ Erro ao carregar as reuniões. Tente novamente mais tarde.");
    }
  }, []);

  // Executa busca inicial
  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  /** 🔹 Filtra as reuniões da data clicada */
  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    const filtered = meetings.filter((m) => m.meetingDate === dateStr);
    setSelectedMeetings(filtered);
  };

  /** 🔹 Exclui reunião (somente se logado) */
  const handleDelete = async (id: number) => {
    if (!user) return alert("⚠️ É necessário estar logado para excluir uma reunião.");
    if (!confirm("Deseja realmente excluir esta reunião?")) return;

    try {
      await deleteMeeting(id, user.id);
      await fetchMeetings();
      alert("🗑️ Reunião excluída com sucesso!");
    } catch {
      alert("❌ Não foi possível excluir a reunião.");
    }
  };

  /** 🔹 Coloca uma reunião em modo de edição */
  const handleEdit = (meeting: MeetingResponse) => {
    const now = new Date();
    const start = new Date(`${meeting.meetingDate}T${meeting.timeStart}`);
    if (start <= now)
      return alert("⛔ Não é possível editar uma reunião que já iniciou.");
    setEditingMeeting(meeting);
  };

  /** 🔹 Faz logout do usuário */
  const handleLogout = () => {
    setUser(null);
    alert("👋 Você saiu do sistema.");
  };

   // =======================================================
  // 🔹 RENDERIZAÇÃO PRINCIPAL
  // =======================================================
  return (
    <div className="calendar-page">
      <div className="calendar-layout">
        {/* =======================================================
            🔸 COLUNA ESQUERDA — Login / Cadastro / Formulário
           ======================================================= */}
        <div className="calendar-left-column">
          <Image
            src="/governo-do-estado-de-ms.png"
            alt="Logo Governo do Estado de MS"
            className="app-logo"
            width={180}
            height={60}
            priority
            style={{ objectFit: "contain", width: "100%", height: "60px" }}
          />


          {/* 🔹 Alternância de visão */}
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
          <div className="auth-section">
            {!user ? (
              <>
                {showRegister ? (
                  <>
                    <RegisterForm />
                    <button
                      className="switch-auth-button"
                      onClick={() => setShowRegister(false)}
                    >
                      Já possui cadastro? Fazer Login
                    </button>
                  </>
                ) : (
                  <>
                    <LoginForm
                      onLoginSuccess={setUser}
                      onLogout={handleLogout}
                      loggedUser={null}
                    />
                    <button
                      className="switch-auth-button"
                      onClick={() => setShowRegister(true)}
                    >
                      Primeiro Acesso? Cadastrar Usuário
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="logged-user-info">
                <p>👤 {user.name}</p>
                <button onClick={handleLogout} className="btn-logout">
                  Sair
                </button>
              </div>
            )}
          </div>


          {/* 🔹 Formulário de agendamento */}
          <MeetingForm
            onMeetingAdded={fetchMeetings}
            isBlocked={!user}
            userId={user?.id}
            editMeeting={editingMeeting}
            onCancelEdit={() => setEditingMeeting(null)}
            selectedDate={selectedDate}
          />
        </div>

        {/* =======================================================
            🔸 COLUNA CENTRAL — Calendário
           ======================================================= */}
        <div className="calendar-center-column">
          {view === "monthly" ? (
            <MonthlyCalendar meetings={meetings} onDayClick={handleDayClick} />
          ) : (
            <WeeklyCalendar2v meetings={meetings} onDayClick={handleDayClick} />
          )}
        </div>

        {/* =======================================================
            🔸 COLUNA DIREITA — Cards de Reuniões
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
    </div>
  );
}
