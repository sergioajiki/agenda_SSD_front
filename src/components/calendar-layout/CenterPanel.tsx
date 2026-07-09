"use client";

import { useState } from "react";
import MonthlyCalendar from "@/components/MonthlyView";
import WeeklyCalendar from "@/components/WeeklyView";
import RoomLegend from "@/components/RoomLegend";
import { MeetingResponse } from "@/models/Meetings";

import "./CenterPanel.css";

/**
 * Tipagem das props recebidas pelo CenterPanel.
 *
 * - view: controla se a visualização será "monthly" (mensal) ou "weekly" (semanal).
 * - meetings: lista completa de reuniões (sem filtro de sala) — o próprio
 *   calendário decide o que exibir com base em `selectedRoom`, pra manter
 *   os indicadores de "tem outra reunião aqui" mesmo com o filtro ativo.
 * - onDayClick: função disparada quando um dia é clicado no calendário.
 * - selectedRoom / onRoomToggle: filtro por sala, controlado via clique na legenda.
 */
type Props = {
  view: "monthly" | "weekly";   // Qual visualização deve ser exibida
  meetings: MeetingResponse[];  // Lista de reuniões
  onDayClick: (date: string) => void; // Callback acionado ao clicar em um dia
  selectedRoom: string | null;
  onRoomToggle: (room: string) => void;
};

/**
 * 🔹 CenterPanel
 *
 * Este componente funciona como um "switch" entre o calendário mensal e semanal.
 * Ele NÃO contém lógica interna — apenas decide qual componente exibir,
 * baseado no estado externo `view`.
 */
export default function CenterPanel({
  view,
  meetings,
  onDayClick,
  selectedRoom,
  onRoomToggle,
}: Props) {
  // 🔹 Mês exibido no calendário mensal — mora aqui pra poder ser controlado
  // pela navegação que agora vive na barra da legenda.
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleGoToToday = () => {
    setCurrentDate(new Date());
  };

  const formattedMonth =
    currentDate
      .toLocaleString("pt-BR", { month: "long" }) // "novembro"
      .charAt(0)
      .toUpperCase() +
    currentDate
      .toLocaleString("pt-BR", { month: "long", year: "numeric" })
      .slice(1); // "Novembro de 2025"

  // 🔹 A legenda de salas fica fixa acima do calendário, nas duas visões
  return (
    <>
      <RoomLegend
        selectedRoom={selectedRoom}
        onToggle={onRoomToggle}
        monthNav={
          view === "monthly"
            ? {
                label: formattedMonth,
                onPrev: handlePrevMonth,
                onNext: handleNextMonth,
                onToday: handleGoToToday,
              }
            : undefined
        }
      />

      {/* 🔹 Se a view for "monthly", renderiza o calendário mensal */}
      {/* 🔹 Caso contrário, renderiza o semanal */}
      {view === "monthly" ? (
        <MonthlyCalendar
          meetings={meetings}     // Passa as reuniões para o calendário mensal
          onDayClick={onDayClick} // Passa a função ao clicar no dia
          selectedRoom={selectedRoom}
          currentDate={currentDate}
        />
      ) : (
        <WeeklyCalendar
          meetings={meetings}     // Mesmo props, mas agora para o calendário semanal
          onDayClick={onDayClick}
          selectedRoom={selectedRoom}
        />
      )}
    </>
  );
}
