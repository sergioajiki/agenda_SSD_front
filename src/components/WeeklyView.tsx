"use client";

import { useMemo, useState } from "react";
import { MeetingResponse } from "@/models/Meetings";

// Funções utilitárias
import {
  addDays,
  startOfWeek,
  formatBR,
  ymd,
  generateHours
} from "@/utils/dateUtils";

import "./styles/WeeklyView.css";

type WeeklyCalendarProps = {
  meetings: MeetingResponse[];
  onDayClick?: (dateStr: string) => void;
};

export default function WeeklyCalendar2v({ meetings, onDayClick }: WeeklyCalendarProps) {

  /**
   * 🔹 Estado que mantém o primeiro dia da semana exibida.
   * A semana sempre inicia no domingo, calculado via startOfWeek().
   */
  const [currentWeekStart, setCurrentWeekStart] =
    useState<Date>(() => startOfWeek(new Date()));

  /** 🔹 Estados que controlam o intervalo de horários visível na grade */
  const [startHour, setStartHour] = useState("07:00");
  const [endHour, setEndHour] = useState("18:00");

  /** 🔹 Dia atual em YYYY-MM-DD para comparações rápidas */
  const today = new Date().toISOString().split("T")[0];

  /** 🔹 Gera a lista de horários (00:00 → 23:30) apenas uma vez */
  const allHours = useMemo(() => generateHours(), []);

  /**
   * 🔹 Filtra quais horários devem ser exibidos conforme o intervalo selecionado.
   */
  const displayedHours = useMemo(() => {
    const startIndex = allHours.indexOf(startHour);
    const endIndex = allHours.indexOf(endHour) + 1;
    return allHours.slice(startIndex, endIndex);
  }, [startHour, endHour, allHours]);

  /**
   * 🔹 Texto que aparece acima do calendário:
   * Exemplo: “10/02/2025 - 16/02/2025”
   */
  const weekRangeText = useMemo(() => {
    const end = addDays(currentWeekStart, 6);
    return `${formatBR(currentWeekStart)} - ${formatBR(end)}`;
  }, [currentWeekStart]);

  /** 🔹 Navegação semanal */
  const prevWeek = () => setCurrentWeekStart((p) => addDays(p, -7));
  const nextWeek = () => setCurrentWeekStart((p) => addDays(p, +7));
  const goToCurrentWeek = () => setCurrentWeekStart(startOfWeek(new Date()));

  /**
   * 🔹 Retorna todas as reuniões que ocupam aquele horário específico.
   * Uma reunião aparece em cada intervalo entre timeStart e timeEnd.
   */
  const getMeetingsAt = (dateStr: string, time: string) =>
    meetings.filter(
      (m) =>
        m.meetingDate === dateStr &&
        m.timeStart <= time &&
        m.timeEnd > time
    );

  /** 🔹 Cabeçalho fixo com os nomes dos dias */
  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="weekly-calendar2v">

      {/* =================== CONTROLES DE TOPO =================== */}
      <div className="calendar-controls2v">
        <div className="calendar-buttons">
          <button onClick={prevWeek}>← Semana Anterior</button>
          <button onClick={nextWeek}>Próxima Semana →</button>
          <button onClick={goToCurrentWeek}>Semana Atual</button>
        </div>

        <span className="calendar-range2v">{weekRangeText}</span>

        {/* 🔹 Seleção do intervalo de horas exibido */}
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

      {/* =================== GRADE DO CALENDÁRIO =================== */}
      <div className="calendar-grid2v">

        {/* 🔹 Cabeçalho com os dias da semana */}
        <div className="calendar-header2v">
          {/* Coluna vazia (para alinhar com horários) */}
          <div className="calendar-time-col2v"></div>

          {daysOfWeek.map((day, i) => {
            const date = addDays(currentWeekStart, i);
            const dateStr = ymd(date);
            const isToday = dateStr === today;

            return (
              <div
                key={i}
                className={`calendar-day-col2v ${isToday ? "today" : ""}`}
                onClick={() => onDayClick?.(dateStr)}
              >
                {day} <br /> {formatBR(date)}
              </div>
            );
          })}
        </div>

        {/* =================== CORPO DA GRADE =================== */}
        <div className="calendar-body2v">

          {displayedHours.map((time, i) => (
            <div key={i} className="calendar-row2v">

              {/* Coluna da esquerda com o horário */}
              <div className="calendar-time-col2v">{time}</div>

              {/* Colunas dos dias */}
              {daysOfWeek.map((_, dayIdx) => {
                const date = addDays(currentWeekStart, dayIdx);
                const dateStr = ymd(date);

                // 🔹 Reuniões que ocupam aquele horário
                const cellMeetings = getMeetingsAt(dateStr, time);

                /** 
                 * 🔹 Cores por sala:
                 * - apoio-room → azul
                 * - cieges-room → verde
                 * - mixed-room → roxo (reuniões sobrepostas)
                 */
                let cellClass = "calendar-cell2v";

                const hasApoio = cellMeetings.some((m) => m.meetingRoom === "APOIO");
                const hasCieges = cellMeetings.some((m) => m.meetingRoom === "CIEGES");

                if (hasApoio && hasCieges) cellClass += " mixed-room";
                else if (hasApoio) cellClass += " apoio-room";
                else if (hasCieges) cellClass += " cieges-room";

                if (dateStr === today) cellClass += " today";

                return (
                  <div
                    key={`${i}-${dayIdx}`}
                    className={cellClass}
                    onClick={() => onDayClick?.(dateStr)}
                  >
                    {/* Exibe o título das reuniões */}
                    {cellMeetings.map((m) => (
                      <div key={m.id} className="meeting-title">
                        {m.title}
                      </div>
                    ))}
                  </div>
                );
              })}

            </div>
          ))}

        </div>
      </div>

    </div>
  );
}
