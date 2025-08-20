"use client";

import { useState } from "react";
import MeetingForm from "@/components/MeetingForm";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import WeeklyCalendar from "@/components/WeeklyCalendar"; // ✅ importar o semanal
import "./styles/Page.css";

export default function CalendarPage() {
  const [view, setView] = useState<"monthly" | "weekly">("monthly");

  return (
    <div className="calendar-page">
      <h1>Calendário</h1>

      <div className="calendar-toggle">
        <button
          className={view === "monthly" ? "active" : ""}
          onClick={() => setView("monthly")}
        >
          Calendário Mensal
        </button>
        <button
          className={view === "weekly" ? "active" : ""}
          onClick={() => setView("weekly")}
        >
          Agenda Semanal
        </button>
      </div>

      <div className="calendar-layout">
        {/* Lado esquerdo: Formulário */}
        <div className="calendar-form">
          <MeetingForm />
        </div>

        {/* Lado direito: alterna entre mensal/semanal */}
        <div className="calendar-display">
          {view === "monthly" ? <MonthlyCalendar /> : <WeeklyCalendar />}
        </div>
      </div>
    </div>
  );
}

