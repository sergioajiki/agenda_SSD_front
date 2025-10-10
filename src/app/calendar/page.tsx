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

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function CalendarPage() {
  const [view, setView] = useState<"monthly" | "weekly">("monthly");
  const [meetings, setMeetings] = useState<MeetingResponse[]>([]);
  const [selectedMeetings, setSelectedMeetings] = useState<MeetingResponse[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const fetchMeetings = useCallback(async () => {
    try {
      const data = await getMeetings();
      setMeetings(data);
    } catch (error) {
      console.error("Erro ao carregar reuniões", error);
    }
  }, []);

  const handleDelete = async (id: number) => {
    if (!user) return;
    try {
      await deleteMeeting(id, user.id);
      await fetchMeetings();
      if (selectedDate) {
        const filtered = meetings.filter((m) => m.meetingDate === selectedDate);
        setSelectedMeetings(filtered);
      }
    } catch (error) {
      alert("Erro ao excluir reunião.");
      console.error(error);
    }
  };

  // 🔹 Gera YYYY-MM-DD
  const ymd = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // 🔹 Início da semana (domingo)
  const startOfWeek = (d: Date) => {
    const x = new Date(d);
    const dow = x.getDay(); // 0 = domingo
    x.setDate(x.getDate() - dow);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  const handleDayClick = (dateStr: string) => {
    const filtered = meetings.filter((m) => m.meetingDate === dateStr);
    setSelectedMeetings(filtered);
    setSelectedDate(dateStr);
  };

  useEffect(() => {
    fetchMeetings().then(() => {
      let initialDate: string;
      if (view === "monthly") {
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        initialDate = ymd(firstDayOfMonth);
      } else {
        const firstDayOfWeek = startOfWeek(new Date());
        initialDate = ymd(firstDayOfWeek);
      }
      handleDayClick(initialDate);
    });
  }, [fetchMeetings, view]);

  return (
    <div className="calendar-page">
      <div className="calendar-login-top-right">
        {!user ? (
          <LoginForm onLoginSuccess={setUser} />
        ) : (
          <p className="welcome-message">👤 {user.name}</p>
        )}
      </div>

      <div className="calendar-layout">
        <div className="calendar-left-column">
          <Image
            src="/governo-do-estado-de-ms.png"
            alt="Governo do Estado de Mato Grosso do Sul"
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
          />
        </div>

        <div className="calendar-display">
          {view === "monthly" ? (
            <div className="monthly-view">
              <MonthlyCalendar meetings={meetings} onDayClick={handleDayClick} />
              {selectedDate && (
                <div className="meeting-cards-container">
                  <h3>
                    Reuniões de {selectedDate.split("-").reverse().join("/")}
                  </h3>
                  <div className="meeting-cards-grid">
                    {selectedMeetings.length > 0 ? (
                      selectedMeetings.map((m) => (
                        <div key={m.id} className="meeting-card-wrapper">
                          <MeetingCard meeting={m} userId={user?.id} onDelete={handleDelete} />
                        </div>
                      ))
                    ) : (
                      <p>Sem reuniões para esta data.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="weekly-view">
              <WeeklyCalendar2v meetings={meetings} onDayClick={handleDayClick} />
              {selectedDate && (
                <div className="meeting-cards-container">
                  <h3>
                    Reuniões de {selectedDate.split("-").reverse().join("/")}
                  </h3>
                  <div className="meeting-cards-grid">
                    {selectedMeetings.length > 0 ? (
                      selectedMeetings.map((m) => (
                        <div key={m.id} className="meeting-card-wrapper">
                          <MeetingCard meeting={m} userId={user?.id} onDelete={handleDelete} />
                        </div>
                      ))
                    ) : (
                      <p>Sem reuniões para esta data.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
