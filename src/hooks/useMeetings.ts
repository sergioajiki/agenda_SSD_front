import { useCallback, useEffect, useState } from "react";
import { getMeetings, deleteMeeting } from "@/services/meetingService";
import { MeetingResponse } from "@/models/Meetings";
import { MessageType } from "@/hooks/useFloatingMessage";

/**
 * ================================================================================
 * useMeetings — Hook responsável por gerenciar TODO o ciclo de vida das reuniões
 * ================================================================================
 * Este hook controla:
 *   • carregamento das reuniões do backend
 *   • filtragem por data selecionada
 *   • atualização automática (polling)
 *   • exclusão de reuniões
 *   • controle de edição de reunião
 *   • feedback visual de atualização e mensagens globais
 *
 * É o núcleo da lógica da agenda. Mantém o Page.tsx limpo e organizado.
 * ================================================================================
 */

export function useMeetings(
  userId: number | undefined,
  showMessage: (msg: string, type?: MessageType) => void
) {
  /**
   * 📌 Lista completa das reuniões trazidas do backend
   */
  const [meetings, setMeetings] = useState<MeetingResponse[]>([]);

  /**
   * 📌 Data atualmente selecionada no calendário
   * - inicia com o dia atual no formato YYYY-MM-DD
   */
  const [selectedDate, setSelectedDate] = useState<string>(
    () => new Date().toISOString().split("T")[0]
  );

  /**
   * 📌 Lista de reuniões filtradas pela data selecionada
   */
  const [selectedMeetings, setSelectedMeetings] = useState<MeetingResponse[]>([]);

  /**
   * 📌 Controla qual reunião está em modo de edição
   * - null → nenhuma sendo editada
   */
  const [editingMeeting, setEditingMeeting] = useState<MeetingResponse | null>(null);

  /**
   * 📌 Exibe alerta visual "Atualizando..." no canto da tela
   */
  const [showUpdateNotice, setShowUpdateNotice] = useState(false);

  // ============================================================================
  // 🔹 Carregar reuniões do backend
  // ============================================================================
  /**
   * Faz a busca no servidor e atualiza:
   *   • todas as reuniões
   *   • reuniões filtradas pela data selecionada
   *
   * O parâmetro keepDate define se a data atual deve ser mantida ou resetada.
   */
  const fetchMeetings = useCallback(
    async (keepDate: boolean = true) => {
      try {
        const data = await getMeetings();
        setMeetings(data);

        // Define qual data usar na filtragem
        const dateToUse = keepDate
          ? selectedDate
          : new Date().toISOString().split("T")[0];

        setSelectedDate(dateToUse);
        setSelectedMeetings(data.filter((m) => m.meetingDate === dateToUse));
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro ao carregar reuniões.";
        showMessage(`❌ ${msg}`, "error");
      }
    },
    [selectedDate]
  );

  /**
   * Executa a busca inicial assim que o hook é carregado.
   */
  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  // ============================================================================
  // 🔹 Atualização automática (polling)
  // ============================================================================
  /**
   * A cada 30 segundos:
   *   • recarrega reuniões
   *   • mantém o filtro pela data atual
   *   • exibe aviso "Atualizando..."
   */
  useEffect(() => {
    const interval = setInterval(async () => {
      await fetchMeetings(true);
      setShowUpdateNotice(true);

      // Esconde o aviso após 3 segundos
      setTimeout(() => setShowUpdateNotice(false), 3000);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchMeetings]);

  // ============================================================================
  // 🔹 Selecionar data no calendário
  // ============================================================================
  /**
   * Atualiza o dia selecionado e filtra reuniões da data clicada.
   */
  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedMeetings(meetings.filter((m) => m.meetingDate === dateStr));
  };

  // ============================================================================
  // 🔹 Excluir reunião
  // ============================================================================
  /**
   * Exclui uma reunião do backend.
   * Regras:
   *   • usuário precisa estar logado
   *   • após excluir, recarrega a lista
   */
  const handleDelete = async (id: number) => {
    if (!userId) {
      showMessage("⚠️ É necessário estar logado para excluir.", "warning");
      return;
    }

    try {
      await deleteMeeting(id, userId);
      await fetchMeetings(true);
      showMessage("🗑️ Reunião excluída com sucesso!", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir reunião.";
      showMessage(`❌ ${msg}`, "error");
    }
  };

  // ============================================================================
  // 🔹 Colocar reunião em modo de edição
  // ============================================================================
  /**
   * Permite edição apenas se:
   *   • a reunião ainda não começou
   */
  const handleEdit = (meeting: MeetingResponse) => {
    const now = new Date();
    const start = new Date(`${meeting.meetingDate}T${meeting.timeStart}`);

    if (start <= now) {
      showMessage("⛔ Não é possível editar uma reunião que já iniciou.", "error");
      return;
    }

    setEditingMeeting(meeting);
  };

  // ============================================================================
  // 🔹 Retorno da API do hook
  // ============================================================================
  return {
    meetings,
    selectedDate,
    selectedMeetings,
    showUpdateNotice,
    editingMeeting,
    setEditingMeeting,
    fetchMeetings,
    handleDayClick,
    handleDelete,
    handleEdit,
  };
}