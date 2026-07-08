"use client";

import MonthlyCalendar from "@/components/MonthlyView";
import WeeklyCalendar from "@/components/WeeklyView";
import RoomLegend from "@/components/RoomLegend";

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
  meetings: any[];              // Lista de reuniões (pode tipar depois com interface)
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

  // 🔹 A legenda de salas fica fixa acima do calendário, nas duas visões
  return (
    <>
      <RoomLegend selectedRoom={selectedRoom} onToggle={onRoomToggle} />

      {/* 🔹 Se a view for "monthly", renderiza o calendário mensal */}
      {/* 🔹 Caso contrário, renderiza o semanal */}
      {view === "monthly" ? (
        <MonthlyCalendar
          meetings={meetings}     // Passa as reuniões para o calendário mensal
          onDayClick={onDayClick} // Passa a função ao clicar no dia
          selectedRoom={selectedRoom}
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
