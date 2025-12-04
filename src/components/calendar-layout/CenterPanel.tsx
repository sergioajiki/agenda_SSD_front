"use client";
import MonthlyCalendar from "@/components/MonthlyView";
import WeeklyCalendar from "@/components/WeeklyView";

import "./CenterPanel.css"

type Props = {
  view: "monthly" | "weekly";
  meetings: any[];
  onDayClick: (date: string) => void;
};

export default function CenterPanel({ view, meetings, onDayClick }: Props) {
  return view === "monthly" ? (
    <MonthlyCalendar meetings={meetings} onDayClick={onDayClick} />
  ) : (
    <WeeklyCalendar meetings={meetings} onDayClick={onDayClick} />
  );
}
