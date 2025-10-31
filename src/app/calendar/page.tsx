"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import MeetingForm from "@/components/MeetingForm";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import WeeklyCalendar2v from "@/components/WeeklyCalendar2v";
import MeetingCard from "@/components/MeetingCard";
import LoginForm from "@/components/LoginForm";
import { getMeetings, deleteMeeting } from "@/services/meetingService";
import { MeetingResponse } from "@/models/Meetings";
import "./styles/Page.css";

/** 🔹 Tipo para o usuário autenticado */
type User = { id: number; name: string; email: string; role: string };

export default function CalendarPage() {
  // 🔹 Controle de visualização: "monthly" (mensal) ou "weekly" (semanal)
  const [view, setView] = useState<"monthly" | "weekly">("monthly");

  // 🔹 Lista geral de reuniões vindas do backend
  const [meetings, setMeetings] = useState<MeetingResponse[]>([]);

  // 🔹 Lista de reuniões da data atualmente selecionada
  const [selectedMeetings, setSelectedMeetings] = useState<MeetingResponse[]>([]);

  // 🔹 Data selecionada (inicia como o dia de hoje)
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    new Date().toISOString().split("T")[0]
  );

  // 🔹 Usuário autenticado (ou null se não logado)
  const [user, setUser] = useState<User | null>(null);

  // 🔹 Reunião em modo de edição
  const [editingMeeting, setEditingMeeting] = useState<MeetingResponse | null>(null);

  /**
   * 🔹 Busca todas as reuniões do backend e exibe inicialmente as do dia atual.
   */
  const fetchMeetings = useCallback(async () => {
    try {
      const data = await getMeetings();
      setMeetings(data);

      // Filtra automaticamente as reuniões do dia atual
      const today = new Date().toISOString().split("T")[0];
      const filtered = data.filter((m) => m.meetingDate === today);
      setSelectedMeetings(filtered);
      setSelectedDate(today);
    } catch {
      alert("❌ Erro ao carregar as reuniões. Tente novamente mais tarde.");
    }
  }, []);

  // 🔹 Executa a busca inicial de reuniões ao montar o componente
  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  /**
   * 🔹 Quando o usuário clica em um dia, filtra as reuniões daquele dia.
   */
  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    const filtered = meetings.filter((m) => m.meetingDate === dateStr);
    setSelectedMeetings(filtered);
  };

  /**
   * 🔹 Exclui uma reunião (somente se logado e com confirmação)
   */
  const handleDelete = async (id: number) => {
    if (!user) return alert("⚠️ É necessário estar logado para excluir uma reunião.");
    if (!confirm("Deseja realmente excluir esta reunião?")) return;

    try {
      await deleteMeeting(id, user.id);
      await fetchMeetings();
      alert("🗑️ Reunião excluída com sucesso!");
    } catch {
      alert("❌ Não foi possível excluir a reunião.");
    }
  };

  /**
   * 🔹 Coloca uma reunião em modo de edição,
   * impedindo edição de reuniões já iniciadas.
   */
  const handleEdit = (meeting: MeetingResponse) => {
    const now = new Date();
    const start = new Date(`${meeting.meetingDate}T${meeting.timeStart}`);
    if (start <= now) return alert("⛔ Não é possível editar uma reunião que já iniciou.");
    setEditingMeeting(meeting);
  };

  /**
   * 🔹 Faz logout (limpa o estado do usuário)
   */
  const handleLogout = () => {
    setUser(null);
    alert("👋 Você saiu do sistema.");
  };

  return (
    <div className="calendar-page">
      {/* 🔹 Área de login ou usuário logado */}
      <div className="calendar-login-top-right">
        <LoginForm
          onLoginSuccess={setUser}
          onLogout={() => setUser(null)}
          loggedUser={user}
        />
      </div>

      {/* 🔹 Layout principal: esquerda (formulário) | direita (calendário e cards) */}
      <div className="calendar-layout">
        {/* ==== COLUNA ESQUERDA ==== */}
        <div className="calendar-left-column">
          <Image
            src="/governo-do-estado-de-ms.png"
            alt="Logo Governo do Estado de MS"
            width={150}
            height={55}
            priority
          />

          {/* Botões de alternância entre visões */}
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

          {/* Formulário de agendamento */}
          <MeetingForm
            onMeetingAdded={fetchMeetings}
            isBlocked={!user}
            userId={user?.id}
            editMeeting={editingMeeting}
            onCancelEdit={() => setEditingMeeting(null)}
          />
        </div>

        {/* ==== COLUNA DIREITA ==== */}
        <div className="calendar-right-column">
          {/* Exibição do calendário (mensal ou semanal) */}
          <div className="calendar-display">
            {view === "monthly" ? (
              <MonthlyCalendar meetings={meetings} onDayClick={handleDayClick} />
            ) : (
              <WeeklyCalendar2v meetings={meetings} onDayClick={handleDayClick} />
            )}
          </div>

          {/* Lista de cards das reuniões da data selecionada */}
          {selectedDate && (
            <div className="meeting-cards-container">
              <h3>Reuniões de {selectedDate.split("-").reverse().join("/")}</h3>

              <div className="meeting-cards-grid">
                {selectedMeetings.length > 0 ? (
                  selectedMeetings.map((m) => (
                    <MeetingCard
                      key={m.id}
                      meeting={m}
                      userId={user?.id}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                    />
                  ))
                ) : (
                  <p>📅 Sem reuniões para esta data.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
