"use client";

import { useEffect, useState } from "react";
import api from "@/services/api"; // ⬅️ Usa a API configurada no axios
import "./styles/Monitoring.css";

/**
 * 🔹 Estrutura dos dados retornados pelo backend (LogUpdateDto)
 */
type LogUpdateDto = {
  id: number;
  meetingId: number | null;
  action: string;
  changedFields: string;
  logDateTime: string;
  updatedBy: {
    id: number;
    name: string;
  };
};

/**
 * 🔹 Página de Monitoramento de Logs (Monitoring)
 * Exibe todos os logs de alterações (criação, edição, exclusão)
 * com atualização automática a cada 30 segundos.
 */
export default function Monitoring() {
  // Lista de logs retornada pela API
  const [logs, setLogs] = useState<LogUpdateDto[]>([]);

  // Estados de controle da interface
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterUser, setFilterUser] = useState<number | "">("");
  const [refreshInterval] = useState<number>(30000); // intervalo de atualização (30s)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  /** =======================================================
   * 🔹 Função principal: busca logs do backend
   * ======================================================= */
  const fetchLogs = async () => {
    try {
      setLoading(true);

      /**
       * 📌 Monta a URL conforme o filtro:
       * - Se houver ID de usuário, filtra por ele
       * - Caso contrário, busca todos os logs
       * 
       * ✔ Agora usando rotas relativas
       * ✔ Sem localhost
       * ✔ Compatível com o baseURL do api.ts
       */
      const url =
        filterUser !== ""
          ? `/api/logs/user/${filterUser}`
          : `/api/logs`;

      // Faz a requisição usando a instância api configurada
      const response = await api.get<LogUpdateDto[]>(url);

      // 🔹 Ordena pela data/hora da atualização, mais recente primeiro
      const sortedLogs = [...response.data].sort(
        (a, b) => new Date(b.logDateTime).getTime() - new Date(a.logDateTime).getTime()
      );

      setLogs(sortedLogs);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError("❌ Falha ao carregar logs do servidor.");
    } finally {
      setLoading(false);
    }
  };

  /** =======================================================
   * 🔹 Primeira requisição e configuração do refresh automático
   * ======================================================= */
  useEffect(() => {
    fetchLogs(); // Carregamento inicial

    // Atualiza os logs automaticamente a cada 30s
    const interval = setInterval(fetchLogs, refreshInterval);

    // Limpeza do intervalo ao desmontar
    return () => clearInterval(interval);
  }, [filterUser]);

  /** =======================================================
   * 🔹 Interface principal
   * ======================================================= */
  return (
    <div className="monitoring-page">
      <h1>📋 Monitoramento de Atualizações</h1>

      {/* 🔹 Filtros de busca */}
      <div className="monitoring-filters">
        <input
          type="number"
          placeholder="Filtrar por ID de usuário"
          value={filterUser}
          onChange={(e) =>
            setFilterUser(e.target.value ? Number(e.target.value) : "")
          }
        />
        <button onClick={fetchLogs}>🔄 Atualizar</button>
      </div>

      {/* 🔹 Última atualização */}
      {lastUpdate && (
        <p className="monitoring-last-update">
          Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")}
        </p>
      )}

      {/* 🔹 Conteúdo principal */}
      {loading ? (
        <p>Carregando logs...</p>
      ) : error ? (
        <p className="monitoring-error">{error}</p>
      ) : logs.length === 0 ? (
        <p>Sem registros encontrados.</p>
      ) : (
        <table className="monitoring-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data/Hora</th>
              <th>Usuário</th>
              <th>Ação</th>
              <th>Reunião</th>
              <th>Campos Alterados</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className={`action-${log.action.toLowerCase()}`}>
                <td>{log.id}</td>
                <td>
                  {new Date(log.logDateTime).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "medium",
                  })}
                </td>
                <td>{log.updatedBy?.name ?? "Desconhecido"}</td>
                <td>{log.action}</td>
                <td>{log.meetingId ?? "-"}</td>
                <td>{log.changedFields}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
