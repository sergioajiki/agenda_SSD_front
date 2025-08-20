import MeetingForm from "@/components/MeetingForm";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import "./styles/Page.css";

export default function CalendarPage() {
  return (
    <div className="calendar-page">
      <h1>Calendário</h1>

      <div className="calendar-layout">
        {/* Lado esquerdo: Formulário */}
        <div className="calendar-form">
          <MeetingForm />
        </div>

        {/* Lado direito: Calendário mensal */}
        <div className="calendar-month">
          <MonthlyCalendar />
        </div>
      </div>
    </div>
  );
}
