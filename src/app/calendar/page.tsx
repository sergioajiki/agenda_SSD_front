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
  const [view, setView] = useState<"monthly" | "weekly">("monthly");
  const [meetings, setMeetings] = useState<MeetingResponse[]>([]);
  const [selectedMeetings, setSelectedMeetings] = useState<MeetingResponse[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<MeetingResponse | null>(null);

  /** Busca reuniões do backend */
  const fetchMeetings = useCallback(async () => {
    const data = await getMeetings();
    setMeetings(data);
  }, []);

  /** Inicializa a página */
  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  /** Exibe as reuniões de um dia selecionado */
  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    const filtered = meetings.filter((m) => m.meetingDate === dateStr);
    setSelectedMeetings(filtered);
  };

  /** Exclusão de reunião */
  const handleDelete = async (id: number) => {
    if (!user) return alert("É necessário estar logado.");
    if (!confirm("Deseja realmente excluir esta reunião?")) return;
    await deleteMeeting(id, user.id);
    await fetchMeetings();
    if (selectedDate) handleDayClick(selectedDate);
  };

  /** Edição de reunião */
  const handleEdit = (meeting: MeetingResponse) => {
    const now = new Date();
    const start = new Date(`${meeting.meetingDate}T${meeting.timeStart}`);
    if (start <= now) return alert("Não é possível editar uma reunião que já iniciou.");
    setEditingMeeting(meeting);
  };

  /** Define o dia inicial automaticamente */
  useEffect(() => {
    if (meetings.length === 0) return;

    let initialDate: string;
    const today = new Date();

    if (view === "monthly") {
      // Primeiro dia do mês
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      initialDate = firstDay.toISOString().split("T")[0];
    } else {
      // Primeiro dia da semana (domingo)
      const firstDayOfWeek = new Date(today);
      const dow = firstDayOfWeek.getDay(); // 0 = domingo
      firstDayOfWeek.setDate(firstDayOfWeek.getDate() - dow);
      initialDate = firstDayOfWeek.toISOString().split("T")[0];
    }

    handleDayClick(initialDate);
  }, [meetings, view]);

  return (
    <div className="calendar-page">
      {/* Login */}
      <div className="calendar-login-top-right">
        {!user ? (
          <LoginForm onLoginSuccess={setUser} />
        ) : (
          <p className="welcome-message">👤 {user.name}</p>
        )}
      </div>

      <div className="calendar-layout">
        {/* Coluna esquerda */}
        <div className="calendar-left-column">
          <Image
            src="/governo-do-estado-de-ms.png"
            alt="Logo"
            width={150}
            height={55}
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

          <MeetingForm
            onMeetingAdded={fetchMeetings}
            isBlocked={!user}
            userId={user?.id}
            editMeeting={editingMeeting}
            onCancelEdit={() => setEditingMeeting(null)}
          />
        </div>

        {/* Coluna principal */}
        <div className="calendar-main">
          <div className="calendar-and-cards">
            <div className="calendar-display">
              {view === "monthly" ? (
                <MonthlyCalendar meetings={meetings} onDayClick={handleDayClick} />
              ) : (
                <WeeklyCalendar2v meetings={meetings} onDayClick={handleDayClick} />
              )}
            </div>

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
    </div>
  );
}
