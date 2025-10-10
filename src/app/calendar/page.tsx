"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import MeetingForm from "@/components/MeetingForm";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import WeeklyCalendar2v from "@/components/WeeklyCalendar2v";
import MeetingCard from "@/components/MeetingCard";
import LoginForm from "@/components/LoginForm";
import { getMeetings } from "@/services/meetingService";
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

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleDayClick = (dateStr: string) => {
    const filtered = meetings.filter((m) => m.meetingDate === dateStr);
    setSelectedMeetings(filtered);
    setSelectedDate(dateStr);
  };

  return (
    <div className="calendar-page">
      {/* Login fixo no topo direito */}
      <div className="calendar-login-top-right">
        {!user ? <LoginForm onLoginSuccess={setUser} /> : <p className="welcome-message">👤 {user.name}</p>}
      </div>

      <div className="calendar-layout">
        {/* Coluna esquerda - logo, título, toggle e formulário */}
        <div className="calendar-left-column">
          <Image
            src="/governo-do-estado-de-ms.png"
            alt="Governo do Estado de Mato Grosso do Sul"
            width={180}
            height={50}
            priority
          />
          <h1>Agenda de Reuniões</h1>
          <div className="calendar-toggle">
            <button className={view === "monthly" ? "active" : ""} onClick={() => setView("monthly")}>Calendário Mensal</button>
            <button className={view === "weekly" ? "active" : ""} onClick={() => setView("weekly")}>Agenda Semanal</button>
          </div>

          {/* MeetingForm abaixo do logo, título e toggle */}
          <MeetingForm onMeetingAdded={fetchMeetings} isBlocked={!user} />
        </div>

        {/* Coluna direita - calendário e cards */}
        <div className="calendar-display">
          {view === "monthly" ? (
            <div className="monthly-view">
              <MonthlyCalendar meetings={meetings} onDayClick={handleDayClick} />

              {selectedDate && (
                <div className="meeting-cards-container">
                  <h3>Reuniões de {selectedDate.split("-").reverse().join("/")}</h3>
                  <div className="meeting-cards-grid">
                    {selectedMeetings.length > 0 ? (
                      selectedMeetings.map((m) => (
                        <div key={m.id} className="meeting-card-wrapper">
                          <MeetingCard meeting={m} />
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
            <WeeklyCalendar2v meetings={meetings} />
          )}
        </div>
      </div>
    </div>
  );
}
