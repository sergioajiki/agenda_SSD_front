"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import MeetingForm from "@/components/MeetingForm";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import WeeklyCalendar2v from "@/components/WeeklyCalendar2v";
import MeetingCard from "@/components/MeetingCard";
import LoginForm from "@/components/LoginForm";
import { getMeetings, deleteMeeting } from "@/services/meetingService";
import { MeetingResponse } from "@/models/Meetings";
import "./styles/Page.css";

type User = { id: number; name: string; email: string; role: string };

export default function CalendarPage() {
  // 🔹 Estado de controle da visão atual (mensal ou semanal)
  const [view, setView] = useState<"monthly" | "weekly">("monthly");

  // 🔹 Lista completa de reuniões
  const [meetings, setMeetings] = useState<MeetingResponse[]>([]);

  // 🔹 Lista de reuniões filtradas pela data selecionada
  const [selectedMeetings, setSelectedMeetings] = useState<MeetingResponse[]>([]);

  // 🔹 Data atualmente selecionada (inicia com hoje)
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    new Date().toISOString().split("T")[0]
  );

  // 🔹 Usuário autenticado
  const [user, setUser] = useState<User | null>(null);

  // 🔹 Reunião em modo de edição
  const [editingMeeting, setEditingMeeting] = useState<MeetingResponse | null>(null);

  /**
   * 🔹 Carrega todas as reuniões do backend
   * e exibe inicialmente as reuniões do dia atual.
   */
  const fetchMeetings = useCallback(async () => {
    try {
      const data = await getMeetings();
      setMeetings(data);

      // Filtra as reuniões do dia de hoje
      const today = new Date().toISOString().split("T")[0];
      const filtered = data.filter((m) => m.meetingDate === today);
      setSelectedMeetings(filtered);
      setSelectedDate(today);
    } catch (error) {
      console.error("Erro ao carregar reuniões:", error);
    }
  }, []);

  // 🔹 Carrega as reuniões assim que o componente for montado
  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  /**
   * 🔹 Ao clicar em um dia do calendário
   * filtra as reuniões daquela data.
   */
  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    const filtered = meetings.filter((m) => m.meetingDate === dateStr);
    setSelectedMeetings(filtered);
  };

  /**
   * 🔹 Exclui uma reunião (requer login)
   */
  const handleDelete = async (id: number) => {
    if (!user) return alert("É necessário estar logado.");
    if (!confirm("Deseja realmente excluir esta reunião?")) return;
    await deleteMeeting(id, user.id);
    await fetchMeetings();
  };

  /**
   * 🔹 Coloca a reunião em modo de edição,
   * impedindo edição de reuniões já iniciadas.
   */
  const handleEdit = (meeting: MeetingResponse) => {
    const now = new Date();
    const start = new Date(`${meeting.meetingDate}T${meeting.timeStart}`);
    if (start <= now) return alert("Não é possível editar uma reunião que já iniciou.");
    setEditingMeeting(meeting);
  };

  return (
    <div className="calendar-page">
      {/* 🔹 Área de login fixada no canto superior direito */}
      <div className="calendar-login-top-right">
        {!user ? (
          <LoginForm onLoginSuccess={setUser} />
        ) : (
          <p className="welcome-message">👤 {user.name}</p>
        )}
      </div>

      {/* 🔹 Estrutura principal da página: lado esquerdo = form / lado direito = calendário + cards */}
      <div className="calendar-layout">
        {/* Coluna lateral esquerda com logo, botões e formulário */}
        <div className="calendar-left-column">
          <Image
            src="/governo-do-estado-de-ms.png"
            alt="Logo"
            width={150}
            height={55}
            priority
          />

          {/* Botões de alternância entre calendário mensal e semanal */}
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

          {/* Formulário de agendamento */}
          <MeetingForm
            onMeetingAdded={fetchMeetings}
            isBlocked={!user}
            userId={user?.id}
            editMeeting={editingMeeting}
            onCancelEdit={() => setEditingMeeting(null)}
          />
        </div>

        {/* 🔹 Área do calendário e cards lado a lado */}
        <div className="calendar-right-column">
          <div className="calendar-display">
            {view === "monthly" ? (
              <MonthlyCalendar meetings={meetings} onDayClick={handleDayClick} />
            ) : (
              <WeeklyCalendar2v meetings={meetings} onDayClick={handleDayClick} />
            )}
          </div>

          {/* 🔹 Cards de reuniões exibidos ao lado do calendário */}
          {selectedDate && (
            <div className="meeting-cards-container">
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
                  <p>Sem reuniões para esta data.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
