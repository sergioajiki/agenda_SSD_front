"use client"; 

import MonthlyCalendar from "@/components/MonthlyView";
import WeeklyCalendar from "@/components/WeeklyView";

import "./CenterPanel.css";

/**
 * Tipagem das props recebidas pelo CenterPanel.
 * 
 * - view: controla se a visualização será "monthly" (mensal) ou "weekly" (semanal).
 * - meetings: lista de reuniões carregadas do backend.
 * - onDayClick: função disparada quando um dia é clicado no calendário.
 */
type Props = {
  view: "monthly" | "weekly";   // Qual visualização deve ser exibida
  meetings: any[];              // Lista de reuniões (pode tipar depois com interface)
  onDayClick: (date: string) => void; // Callback acionado ao clicar em um dia
};

/**
 * 🔹 CenterPanel
 * 
 * Este componente funciona como um "switch" entre o calendário mensal e semanal.
 * Ele NÃO contém lógica interna — apenas decide qual componente exibir,
 * baseado no estado externo `view`.
 */
export default function CenterPanel({ view, meetings, onDayClick }: Props) {

  // 🔹 Se a view for "monthly", renderiza o calendário mensal
  // 🔹 Caso contrário, renderiza o semanal
  return view === "monthly" ? (
    <MonthlyCalendar
      meetings={meetings}     // Passa as reuniões para o calendário mensal
      onDayClick={onDayClick} // Passa a função ao clicar no dia
    />
  ) : (
    <WeeklyCalendar
      meetings={meetings}     // Mesmo props, mas agora para o calendário semanal
      onDayClick={onDayClick}
    />
  );
}
