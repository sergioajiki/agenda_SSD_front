"use client";

import { MeetingResponse } from "@/models/Meetings";
import "./styles/MonthlyCalendar.css";
import { useState } from "react";

type MonthlyCalendarProps = {
  meetings: MeetingResponse[];       // Lista de todas as reuniões recebidas do backend
  onDayClick?: (dateStr: string) => void; // Callback ao clicar em um dia (ex: atualizar cards)
};

export default function MonthlyCalendar({ meetings, onDayClick }: MonthlyCalendarProps) {
  // 🔹 Estado de controle da data base do calendário
  const [currentDate, setCurrentDate] = useState(new Date());

  // 🔹 Extrai o ano e o mês da data atual
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 🔹 Define o primeiro e o último dia do mês atual
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate(); // quantidade total de dias
  const startDay = firstDay.getDay(); // dia da semana em que o mês começa (0 = domingo)

  // 🔹 Guarda a data de hoje no formato YYYY-MM-DD para comparação
  const today = new Date().toISOString().split("T")[0];

  /**
   * 🔹 Retorna todas as reuniões que acontecem em determinado dia
   * (comparando meeting.meetingDate com a data formatada do dia).
   */
  const getMeetingsForDay = (day: number) => {
    const dateStr = new Date(year, month, day).toISOString().split("T")[0];
    return meetings.filter((m) => m.meetingDate === dateStr);
  };

  // 🔹 Navega para o mês anterior
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // 🔹 Navega para o próximo mês
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="calendar-container">
      {/* ===== Cabeçalho do calendário (título + botões de navegação) ===== */}
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>◀</button>
        <h2>
          {currentDate.toLocaleString("pt-BR", { month: "long", year: "numeric" })}
        </h2>
        <button onClick={handleNextMonth}>▶</button>
      </div>

      {/* ===== Estrutura de grade 7xN ===== */}
      <div className="calendar-grid">
        {/* Cabeçalho com dias da semana */}
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
          <div key={d} className="calendar-day-header">{d}</div>
        ))}

        {/* Espaços vazios antes do 1º dia do mês */}
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-cell empty"></div>
        ))}

        {/* Renderização dos dias do mês */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = new Date(year, month, day).toISOString().split("T")[0];
          const dailyMeetings = getMeetingsForDay(day);
          const isToday = dateStr === today; // destaca o dia atual

          return (
            <div
              key={day}
              className={`calendar-cell ${isToday ? "today" : ""}`}
              onClick={() => onDayClick && onDayClick(dateStr)}
            >
              <div className="calendar-day-number">{day}</div>

              {/* Lista resumida das reuniões do dia */}
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
