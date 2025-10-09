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
      <div className="calendar-layout">
        {/* Coluna esquerda - MeetingForm agora contém logo, título e botões */}
        <div className="calendar-form">
          <MeetingForm onMeetingAdded={fetchMeetings} view={view} setView={setView} />
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
