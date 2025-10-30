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
  // 🔹 Estado principal da aplicação
  const [view, setView] = useState<"monthly" | "weekly">("monthly");
  const [meetings, setMeetings] = useState<MeetingResponse[]>([]);
  const [selectedMeetings, setSelectedMeetings] = useState<MeetingResponse[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    new Date().toISOString().split("T")[0]
  );
  const [user, setUser] = useState<User | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<MeetingResponse | null>(null);

  /** 🔹 Busca as reuniões no backend e define as do dia atual */
  const fetchMeetings = useCallback(async () => {
    try {
      const data = await getMeetings();
      setMeetings(data);

      // Mostra as reuniões do dia atual ao carregar
      const today = new Date().toISOString().split("T")[0];
      const filtered = data.filter((m) => m.meetingDate === today);
      setSelectedMeetings(filtered);
      setSelectedDate(today);
    } catch (error) {
      console.error("Erro ao carregar reuniões:", error);
    }
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  /** 🔹 Quando o usuário clica em um dia no calendário */
  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    const filtered = meetings.filter((m) => m.meetingDate === dateStr);
    setSelectedMeetings(filtered);
  };

  /** 🔹 Exclusão de reunião */
  const handleDelete = async (id: number) => {
    if (!user) return alert("É necessário estar logado.");
    if (!confirm("Deseja realmente excluir esta reunião?")) return;
    await deleteMeeting(id, user.id);
    await fetchMeetings();
  };

  /** 🔹 Edição de reunião (somente se ainda não começou) */
  const handleEdit = (meeting: MeetingResponse) => {
    const now = new Date();
    const start = new Date(`${meeting.meetingDate}T${meeting.timeStart}`);
    if (start <= now) return alert("Não é possível editar uma reunião que já iniciou.");
    setEditingMeeting(meeting);
  };

  return (
    <div className="calendar-page">
      {/* 🔹 Login fixo no topo direito */}
      <div className="calendar-login-top-right">
        {!user ? (
          <LoginForm onLoginSuccess={setUser} />
        ) : (
          <p className="welcome-message">👤 {user.name}</p>
        )}
      </div>

      {/* 🔹 Layout em 3 colunas */}
      <div className="calendar-layout">
        {/* 🧩 Coluna esquerda: logo, botões e formulário */}
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

        {/* 📅 Coluna central: calendário */}
        <div className="calendar-center">
          {view === "monthly" ? (
            <MonthlyCalendar meetings={meetings} onDayClick={handleDayClick} />
          ) : (
            <WeeklyCalendar2v meetings={meetings} onDayClick={handleDayClick} />
          )}
        </div>

        {/* 🗂️ Coluna direita: cards das reuniões do dia selecionado */}
        <div className="calendar-right-column">
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
