"use client";

import { useCallback, useEffect, useState } from "react";
import MeetingForm from "@/components/MeetingForm";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import WeeklyCalendar2v from "@/components/WeeklyCalendar2v";
import { getMeetings } from "@/services/meetingService";
import { MeetingResponse } from "@/models/Meetings";
import "./styles/Page.css";

export default function CalendarPage() {
  const [view, setView] = useState<"monthly" | "weekly">("monthly");
  const [meetings, setMeetings] = useState<MeetingResponse[]>([]);

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

  return (
    <div className="calendar-page">
      <span className="calendar-navy">
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

      </span>
      <br />
      <div className="calendar-layout">
        {/* Lado esquerdo: Formulário */}
        <div className="calendar-form">
          {/* Passa a função para atualizar o calendário */}
          <MeetingForm onMeetingAdded={fetchMeetings} />
        </div>

        {/* Lado direito: alterna entre mensal/semanal */}
        <div className="calendar-display">
          {view === "monthly" ? (
            <MonthlyCalendar meetings={meetings} />
          ) : (
            <WeeklyCalendar2v meetings={meetings} />
          )}

        </div>
      </div>
    </div>
  );
}

