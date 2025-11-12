"use client";

import { MeetingResponse } from "@/models/Meetings";
import "./styles/MonthlyCalendar.css";
import { useEffect, useState } from "react";

type MonthlyCalendarProps = {
  meetings: MeetingResponse[];             // Lista de todas as reuniões recebidas do backend
  onDayClick?: (dateStr: string) => void;  // Callback ao clicar em um dia (ex: atualizar cards)
  selectedDate?: string;                   // Data atualmente selecionada (para destacar visualmente)
};

export default function MonthlyCalendar({
  meetings,
  onDayClick,
  selectedDate,
}: MonthlyCalendarProps) {
  // 🔹 Estado de controle da data base do calendário (mês atual exibido)
  const [currentDate, setCurrentDate] = useState(new Date());

  // 🔹 Estado interno para armazenar a data clicada (para destacar visualmente)
  const [localSelectedDate, setLocalSelectedDate] = useState<string | null>(null);

  // 🔹 Sincroniza o estado local com a prop recebida do componente pai
  useEffect(() => {
    if (selectedDate) {
      setLocalSelectedDate(selectedDate);
    }
  }, [selectedDate]);

  // 🔹 Extrai o ano e o mês atuais
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 🔹 Define o primeiro e o último dia do mês
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay(); // 0 = domingo, 6 = sábado

  // 🔹 Guarda a data de hoje no formato YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  /**
   * 🔹 Retorna todas as reuniões que acontecem em determinado dia
   * (comparando meeting.meetingDate com a data formatada do dia)
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

  // 🔹 Ao clicar em uma célula do calendário
  const handleDayClick = (dateStr: string) => {
    setLocalSelectedDate(dateStr);      //
    if (onDayClick) onDayClick(dateStr);
  };

  const formattedMonth =
    currentDate
      .toLocaleString("pt-BR", { month: "long" }) // "novembro"
      .charAt(0)
      .toUpperCase() +
    currentDate
      .toLocaleString("pt-BR", { month: "long", year: "numeric" })
      .slice(1); // "Novembro de 2025"

  return (
    <div className="calendar-container">
      {/* ===== Cabeçalho do calendário (título + botões de navegação) ===== */}
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>◀</button>        
          <h2>{formattedMonth || "Carregando..."}</h2>     
        <button onClick={handleNextMonth}>▶</button>
      </div>

      {/* ===== Estrutura de grade 7xN ===== */}
      <div className="calendar-grid">
        {/* Cabeçalho com dias da semana */}
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
          <div key={d} className="calendar-day-header">
            {d}
          </div>
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

          // 🔹 Verifica salas
          const hasApoio = dailyMeetings.some((m) => m.meetingRoom === "APOIO");
          const hasCieges = dailyMeetings.some((m) => m.meetingRoom === "CIEGES");

          // 🔹 Define classes de cor com base na sala e estado
          let cellClass = "calendar-cell";
          if (hasApoio && hasCieges) cellClass += " mixed-room";
          else if (hasApoio) cellClass += " apoio-room";
          else if (hasCieges) cellClass += " cieges-room";
          if (isToday) cellClass += " today";

          // 🟢 NOVO — aplica borda azul na célula selecionada
          const isSelected = localSelectedDate === dateStr;
          if (isSelected) cellClass += " selected";

          return (
            <div
              key={day}
              className={cellClass}
              onClick={() => handleDayClick(dateStr)}
            >
              {/* Número do dia */}
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
