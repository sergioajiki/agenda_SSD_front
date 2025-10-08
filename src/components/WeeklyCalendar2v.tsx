"use client";

import { useMemo, useState } from "react";
import { MeetingResponse } from "@/models/Meetings";
import "./styles/WeeklyCalendar2v.css";

interface WeeklyCalendar2vProps {
  meetings: MeetingResponse[];
}

/** Gera lista de horas (intervalos de 30 min) */
const generateHours = () => {
  return Array.from({ length: 48 }, (_, i) => {
    const h = Math.floor(i / 2)
      .toString()
      .padStart(2, "0");
    const m = i % 2 === 0 ? "00" : "30";
    return `${h}:${m}`;
  });
};

const startOfWeek = (d: Date) => {
  const x = new Date(d);
  const dow = x.getDay(); // domingo = 0
  x.setDate(x.getDate() - dow);
  x.setHours(0, 0, 0, 0);
  return x;
};

const addDays = (d: Date, days: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
};

const ymd = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const combineYmdAndHHmm = (ymdStr: string, hhmm: string) => {
  const [y, m, d] = ymdStr.split("-").map(Number);
  const [hh, mm] = hhmm.split(":").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, 0, 0);
};

const formatBR = (d: Date) =>
  d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

export default function WeeklyCalendar2v({ meetings }: WeeklyCalendar2vProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() =>
    startOfWeek(new Date())
  );
  const [startHour, setStartHour] = useState("07:00");
  const [endHour, setEndHour] = useState("18:00");

  const allHours = useMemo(() => generateHours(), []);
  const displayedHours = useMemo(() => {
    const startIndex = allHours.indexOf(startHour);
    const endIndex = allHours.indexOf(endHour) + 1;
    return allHours.slice(startIndex, endIndex);
  }, [startHour, endHour, allHours]);

  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const weekRangeText = useMemo(() => {
    const end = addDays(currentWeekStart, 6);
    return `${formatBR(currentWeekStart)} - ${formatBR(end)}`;
  }, [currentWeekStart]);

  const prevWeek = () => setCurrentWeekStart((p) => addDays(p, -7));
  const nextWeek = () => setCurrentWeekStart((p) => addDays(p, +7));
  const goToCurrentWeek = () => setCurrentWeekStart(startOfWeek(new Date()));

  const isMeeting = (dayIndex: number, time: string) => {
    const date = addDays(currentWeekStart, dayIndex);
    const dateStr = ymd(date);
    const [h, m] = time.split(":").map(Number);
    const cellTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m).getTime();

    return meetings.some((meeting) => {
      if (meeting.meetingDate !== dateStr) return false;
      const start = combineYmdAndHHmm(meeting.meetingDate, meeting.timeStart).getTime();
      const end = combineYmdAndHHmm(meeting.meetingDate, meeting.timeEnd).getTime();
      return cellTime >= start && cellTime < end;
    });
  };

  const getMeetingTitle = (dayIndex: number, time: string) => {
    const date = addDays(currentWeekStart, dayIndex);
    const dateStr = ymd(date);
    const [h, m] = time.split(":").map(Number);
    const cellTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m).getTime();

    const found = meetings.find((meeting) => {
      if (meeting.meetingDate !== dateStr) return false;
      const start = combineYmdAndHHmm(meeting.meetingDate, meeting.timeStart).getTime();
      const end = combineYmdAndHHmm(meeting.meetingDate, meeting.timeEnd).getTime();
      return cellTime >= start && cellTime < end;
    });
    return found ? found.title : "";
  };

  return (
    <div className="weekly-calendar2v">
      {/* Controles superiores */}
      <div className="calendar-controls2v">
        <div className="calendar-buttons">
          <button onClick={prevWeek}>← Semana Anterior</button>
          <button onClick={nextWeek}>Próxima Semana →</button>
          <button onClick={goToCurrentWeek}>Semana Atual</button>
        </div>

        <span className="calendar-range2v">{weekRangeText}</span>

        <div className="calendar-hour-range">
          <label>Início:</label>
          <select value={startHour} onChange={(e) => setStartHour(e.target.value)}>
            {allHours.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
          <label>Fim:</label>
          <select value={endHour} onChange={(e) => setEndHour(e.target.value)}>
            {allHours.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grade principal */}
      <div className="calendar-grid2v">
        {/* Cabeçalho dos dias */}
        <div className="calendar-header2v">
          <div className="calendar-time-col2v"></div>
          {daysOfWeek.map((day, i) => (
            <div key={i} className="calendar-day-col2v">
              {day}
              <br />
              {formatBR(addDays(currentWeekStart, i))}
            </div>
          ))}
        </div>

        {/* Corpo: linhas = horas, colunas = dias */}
        <div className="calendar-body2v">
          {displayedHours.map((time, i) => (
            <div key={i} className="calendar-row2v">
              <div className="calendar-time-col2v">{time}</div>
              {daysOfWeek.map((_, dayIdx) => (
                <div
                  key={`${i}-${dayIdx}`}
                  className={`calendar-cell2v ${isMeeting(dayIdx, time) ? "busy2v" : ""}`}
                >
                  {isMeeting(dayIdx, time) && (
                    <span className="meeting-title2v">
                      {getMeetingTitle(dayIdx, time)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
