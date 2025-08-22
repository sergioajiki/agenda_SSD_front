"use client";

import { JSX, useCallback, useEffect, useMemo, useState } from "react";
import { getMeetings } from "@/services/meetingService";
import { MeetingResponse } from "@/models/Meetings";
import "./styles/WeeklyCalendar2v.css";

/** 48 passos de 30min */
const HOURS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, "0");
  const m = i % 2 === 0 ? "00" : "30";
  return `${h}:${m}`;
});

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

export default function WeeklyCalendar2v() {
  const [meetings, setMeetings] = useState<MeetingResponse[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => startOfWeek(new Date()));
  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const fetchMeetings = useCallback(async () => {
    const data = await getMeetings();
    setMeetings(data);
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const weekRangeText = useMemo(() => {
    const end = addDays(currentWeekStart, 6);
    return `${formatBR(currentWeekStart)} - ${formatBR(end)}`;
  }, [currentWeekStart]);

  const prevWeek = () => setCurrentWeekStart((p) => addDays(p, -7));
  const nextWeek = () => setCurrentWeekStart((p) => addDays(p, +7));
  const goToCurrentWeek = () => setCurrentWeekStart(startOfWeek(new Date()));

  const getMeetingCells = (meeting: MeetingResponse) => {
    const start = combineYmdAndHHmm(meeting.meetingDate, meeting.timeStart).getTime();
    const end = combineYmdAndHHmm(meeting.meetingDate, meeting.timeEnd).getTime();
    return (end - start) / (30 * 60 * 1000); // 30 min por célula
  };

  const meetingStartingHere = (dayIndex: number, hhmm: string) => {
    const date = addDays(currentWeekStart, dayIndex);
    const dateStr = ymd(date);
    const startMsHere = combineYmdAndHHmm(dateStr, hhmm).getTime();
    return meetings.find(
      (mt) =>
        mt.meetingDate === dateStr &&
        combineYmdAndHHmm(mt.meetingDate, mt.timeStart).getTime() === startMsHere
    );
  };

  return (
    <>
      {/* Controles da semana - agora separados */}
      <div className="calendar-controls2v">
        <button onClick={prevWeek}>← Semana Anterior</button>
        <span className="calendar-range2v">{weekRangeText}</span>
        <button onClick={nextWeek}>Próxima Semana →</button>
        <button onClick={goToCurrentWeek}>Semana Atual</button>
      </div>

      {/* Calendário em si */}
      <div className="weekly-calendar2v">
        {/* Cabeçalho de horas */}
        <div className="calendar-header2v">
          <div className="calendar-day-col2v" />
          {HOURS.map((t) => (
            <div key={t} className="calendar-hour-col2v">
              {t}
            </div>
          ))}
        </div>

        {/* Corpo: linhas = dias */}
        <div className="calendar-body2v">
          {daysOfWeek.map((day, dayIndex) => (
            <div key={dayIndex} className="calendar-row2v">
              <div className="calendar-day-col2v">
                {day}
                <br />
                {formatBR(addDays(currentWeekStart, dayIndex))}
              </div>

              {(() => {
                const rowCells: JSX.Element[] = [];
                let cellIndex = 0;

                while (cellIndex < HOURS.length) {
                  const t = HOURS[cellIndex];
                  const meeting = meetingStartingHere(dayIndex, t);

                  if (meeting) {
                    const span = getMeetingCells(meeting);
                    rowCells.push(
                      <div
                        key={`${dayIndex}-${cellIndex}`}
                        className="calendar-cell2v busy2v"
                        style={{ gridColumn: `span ${span}` }}
                      >
                        <span className="meeting-title2v">{meeting.title}</span>
                      </div>
                    );
                    cellIndex += span;
                  } else {
                    rowCells.push(
                      <div key={`${dayIndex}-${cellIndex}`} className="calendar-cell2v" />
                    );
                    cellIndex++;
                  }
                }
                return rowCells;
              })()}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
