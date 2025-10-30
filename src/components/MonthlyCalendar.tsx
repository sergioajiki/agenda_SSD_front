"use client";

import { MeetingResponse } from "@/models/Meetings";
import "./styles/MonthlyCalendar.css";
import { useState } from "react";

type MonthlyCalendarProps = {
  meetings: MeetingResponse[];
  onDayClick?: (dateStr: string) => void;
};

export default function MonthlyCalendar({ meetings, onDayClick }: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay(); // domingo = 0

  const today = new Date().toISOString().split("T")[0];

  const getMeetingsForDay = (day: number) => {
    const dateStr = new Date(year, month, day).toISOString().split("T")[0];
    return meetings.filter((m) => m.meetingDate === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>◀</button>
        <h2>
          {currentDate.toLocaleString("pt-BR", { month: "long", year: "numeric" })}
        </h2>
        <button onClick={handleNextMonth}>▶</button>
      </div>

      <div className="calendar-grid">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
          <div key={d} className="calendar-day-header">
            {d}
          </div>
        ))}

        {/* espaços antes do 1º dia */}
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-cell empty"></div>
        ))}

        {/* dias */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = new Date(year, month, day).toISOString().split("T")[0];
          const dailyMeetings = getMeetingsForDay(day);
          const isToday = dateStr === today;

          return (
            <div
              key={day}
              className={`calendar-cell ${isToday ? "today" : ""}`}
              onClick={() => onDayClick && onDayClick(dateStr)}
            >
              <div className="calendar-day-number">{day}</div>
              <ul className="meeting-list">
                {dailyMeetings.map((m) => (
                  <li key={m.id} className="meeting-item">
                    {m.title}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
