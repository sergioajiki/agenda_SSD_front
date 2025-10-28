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

  /** 🔹 Buscar todas as reuniões */
  const fetchMeetings = useCallback(async () => {
    try {
      const data = await getMeetings();
      setMeetings(data);
      if (selectedDate) {
        const filtered = data.filter((m) => m.meetingDate === selectedDate);
        setSelectedMeetings(filtered);
      }
    } catch (err) {
      console.error("Erro ao carregar reuniões:", err);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  /** 🔹 Quando o usuário clica num dia */
  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    const filtered = meetings.filter((m) => m.meetingDate === dateStr);
    setSelectedMeetings(filtered);
  };

  /** 🔹 Excluir reunião */
  const handleDelete = async (id: number) => {
    if (!user) return alert("É necessário estar logado.");
    if (!confirm("Deseja realmente excluir esta reunião?")) return;

    try {
      await deleteMeeting(id, user.id);
      await fetchMeetings();
    } catch (error) {
      alert("Erro ao excluir reunião.");
      console.error(error);
    }
  };

  /** 🔹 Editar reunião */
  const handleEdit = (meeting: MeetingResponse) => {
    if (!user) return alert("Faça login para editar reuniões.");

    const now = new Date();
    const start = new Date(`${meeting.meetingDate}T${meeting.timeStart}`);

    if (start <= now) {
      alert("Não é possível editar uma reunião que já iniciou.");
      return;
    }

    if (meeting.userId !== user.id) {
      alert("Você só pode editar suas próprias reuniões.");
      return;
    }

    setEditingMeeting(meeting);
  };

  return (
    <div className="calendar-page">
      {/* 🔹 Login no canto superior direito */}
      <div className="calendar-login-top-right">
        {!user ? (
          <LoginForm onLoginSuccess={setUser} />
        ) : (
          <p className="welcome-message">👤 {user.name}</p>
        )}
      </div>

      <div className="calendar-layout">
        {/* 🔹 Coluna lateral */}
        <div className="calendar-left-column">
          <Image
            src="/governo-do-estado-de-ms.png"
            alt="Logo Governo do Estado de MS"
            width={150}
            height={55}
            priority
          />

          {/* 🔹 Botões de alternância */}
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

          {/* 🔹 Formulário de Reunião */}
          <MeetingForm
            onMeetingAdded={fetchMeetings}
            isBlocked={!user}
            userId={user?.id}
            editMeeting={editingMeeting}
            onCancelEdit={() => setEditingMeeting(null)}
          />
        </div>

        {/* 🔹 Área principal */}
        <div className="calendar-display">
          {view === "monthly" ? (
            <MonthlyCalendar meetings={meetings} onDayClick={handleDayClick} />
          ) : (
            <WeeklyCalendar2v meetings={meetings} onDayClick={handleDayClick} />
          )}

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
