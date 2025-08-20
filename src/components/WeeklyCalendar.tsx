"use client";

import { useEffect, useState } from "react";
import { MeetingResponse } from "@/models/Meetings";
import { getMeetings } from "@/services/meetingService";
import "./styles/WeeklyCalendar.css" 

export default function WeeklyAgenda() {
  const [meetings, setMeetings] = useState<MeetingResponse[]>([]);
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const today = new Date();
    const day = today.getDay(); // 0 = domingo
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - day); // volta até domingo
    return sunday;
  });

  useEffect(() => {
    fetchMeetings();
  }, [weekStart]);

  const fetchMeetings = async () => {
    try {
      const data = await getMeetings();
      setMeetings(data);
    } catch (error) {
      console.error("Erro ao carregar reuniões", error);
    }
  };

  // gera os dias da semana
  const getWeekDays = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return date;
    });
  };

  // filtra reuniões de um dia
  const getMeetingsForDay = (date: Date) => {
    return meetings.filter((m) => {
      const meetingDate = new Date(m.meetingDate);
      return (
        meetingDate.getFullYear() === date.getFullYear() &&
        meetingDate.getMonth() === date.getMonth() &&
        meetingDate.getDate() === date.getDate()
      );
    });
  };

  const handlePrevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(weekStart.getDate() - 7);
    setWeekStart(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(weekStart.getDate() + 7);
    setWeekStart(next);
  };

  return (
    <div className="weekly-agenda">
      <div className="agenda-header">
        <button onClick={handlePrevWeek}>◀ Semana anterior</button>
        <h2>
          Semana de {weekStart.toLocaleDateString()} até{" "}
          {new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()}
        </h2>
        <button onClick={handleNextWeek}>Próxima semana ▶</button>
      </div>

      <div className="agenda-grid">
        {getWeekDays().map((day, index) => (
          <div key={index} className="agenda-day">
            <h3>
              {day.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
              })}
            </h3>

            <ul>
              {getMeetingsForDay(day).length === 0 ? (
                <li className="no-meetings">Nenhuma reunião</li>
              ) : (
                getMeetingsForDay(day).map((m) => (
                  <li key={m.id} className="meeting-item">
                    <strong>{m.title}</strong>
                    <br />
                    {m.timeStart} - {m.timeEnd} ({m.meetingRoom})
                  </li>
                ))
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
