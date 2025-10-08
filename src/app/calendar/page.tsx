"use client";

import { useCallback, useEffect, useState } from "react";
import MeetingForm from "@/components/MeetingForm";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import WeeklyCalendar2v from "@/components/WeeklyCalendar2v";
import MeetingCard from "@/components/MeetingCard";
import { getMeetings } from "@/services/meetingService";
import { MeetingResponse } from "@/models/Meetings";
import "./styles/Page.css";

export default function CalendarPage() {
  const [view, setView] = useState<"monthly" | "weekly">("monthly");
  const [meetings, setMeetings] = useState<MeetingResponse[]>([]);
  const [selectedMeetings, setSelectedMeetings] = useState<MeetingResponse[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

      <div className="calendar-layout">
        {/* Formulário à esquerda */}
        <div className="calendar-form">
          <MeetingForm onMeetingAdded={fetchMeetings} />
        </div>

        {/* Calendário e cards */}
        <div className="calendar-display">
          {view === "monthly" ? (
            <>
              <MonthlyCalendar meetings={meetings} onDayClick={handleDayClick} />
              {selectedDate && (
                <div className="meeting-cards-container">
                  <h3>Reuniões de {selectedDate.split("-").reverse().join("/")}</h3>
                  {selectedMeetings.length > 0 ? (
                    selectedMeetings.map((m) => (
                      <MeetingCard key={m.id} meeting={m} />
                    ))
                  ) : (
                    <p>Sem reuniões para esta data.</p>
                  )}
                </div>
              )}
            </>
          ) : (
            <WeeklyCalendar2v meetings={meetings} />
          )}
        </div>
      </div>
    </div>
  );
}
