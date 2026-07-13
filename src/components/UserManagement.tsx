"use client";

import { useEffect, useState } from "react";
import {
  getUsers,
  searchUsers,
  updateUser,
  deactivateUser,
  reactivateUser,
  resetPassword,
} from "@/services/userService";
import { UserResponse, UserCreatedResponse } from "@/models/User";
import { getStoredAuth } from "@/utils/authStorage";
import RegisterForm from "@/components/RegisterForm";
import "./styles/UserManagement.css";

/**
 * 🔹 Gestão de acessos (admin)
 * Lista, busca, cadastra, troca role e desativa/reativa quem tem acesso à
 * agenda. Não existe autocadastro — é tudo decidido aqui pelo admin.
 */
export default function UserManagement() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [resetCredentials, setResetCredentials] = useState<UserCreatedResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Email de quem está logado agora — usado só pra desabilitar as ações
  // sobre a própria conta na tabela (o back também bloqueia, isso é só UX).
  // Lido depois de montar no cliente pra não divergir do HTML do servidor.
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  useEffect(() => {
    setCurrentUserEmail(getStoredAuth()?.email ?? null);
  }, []);

  const fetchUsers = async (term: string = "") => {
    try {
      setLoading(true);
      const data = term.trim() ? await searchUsers(term.trim()) : await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    fetchUsers();
  };

  const handleRoleChange = async (user: UserResponse, newRole: "ADMIN" | "USER") => {
    if (newRole === user.role) return;

    setSavingId(user.id);
    setStatusMessage(null);
    try {
      const updated = await updateUser(Number(user.id), {
        name: user.name,
        email: user.email,
        matricula: user.matricula,
        role: newRole,
      });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
      setStatusMessage({ text: `✅ Role de ${updated.name} alterada para ${updated.role}.`, type: "success" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao atualizar role.";
      setStatusMessage({ text: `❌ ${msg}`, type: "error" });
    } finally {
      setSavingId(null);
    }
  };

  const handleResetPassword = async (user: UserResponse) => {
    if (!window.confirm(`Gerar uma nova senha temporária pra ${user.name}? A senha atual dele(a) deixa de funcionar.`)) {
      return;
    }

    setSavingId(user.id);
    setStatusMessage(null);
    try {
      const result = await resetPassword(Number(user.id));
      setResetCredentials(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao resetar senha.";
      setStatusMessage({ text: `❌ ${msg}`, type: "error" });
    } finally {
      setSavingId(null);
    }
  };

  const handleCopyResetCredentials = async () => {
    if (!resetCredentials) return;
    const text = `Email: ${resetCredentials.email}\nSenha temporária: ${resetCredentials.temporaryPassword}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleStatus = async (user: UserResponse) => {
    setSavingId(user.id);
    setStatusMessage(null);
    try {
      if (user.enabled) {
        await deactivateUser(Number(user.id));
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, enabled: false } : u)));
        setStatusMessage({ text: `✅ ${user.name} foi desativado.`, type: "success" });
      } else {
        const updated = await reactivateUser(Number(user.id));
        setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
        setStatusMessage({ text: `✅ ${updated.name} foi reativado.`, type: "success" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao atualizar status.";
      setStatusMessage({ text: `❌ ${msg}`, type: "error" });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="user-management">
      {resetCredentials && (
        <div className="reset-password-overlay" onClick={() => setResetCredentials(null)}>
          <div className="reset-password-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="reset-password-close"
              onClick={() => setResetCredentials(null)}
              aria-label="Fechar"
            >
              ×
            </button>
            <h2 className="form-title">Senha resetada</h2>
            <p className="reset-password-message">
              ✅ Nova senha temporária gerada para {resetCredentials.name}. Repasse os dados abaixo — não dá
              pra recuperar essa senha depois de fechar esta tela.
            </p>
            <div className="reset-password-credentials">
              <div>
                <label>Email</label>
                <p>{resetCredentials.email}</p>
              </div>
              <div>
                <label>Senha temporária</label>
                <p className="reset-password-credentials-value">{resetCredentials.temporaryPassword}</p>
              </div>
            </div>
            <button type="button" className="reset-password-copy" onClick={handleCopyResetCredentials}>
              {copied ? "✔ Copiado!" : "📋 Copiar email e senha"}
            </button>
          </div>
        </div>
      )}

      <div className="user-management-toolbar">
        <form className="user-management-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Buscar por nome ou email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">🔍 Buscar</button>
          {searchTerm && (
            <button type="button" onClick={handleClearSearch}>
              Limpar
            </button>
          )}
        </form>

        <button
          type="button"
          className="user-management-toggle-form"
          onClick={() => setShowRegisterForm((prev) => !prev)}
        >
          {showRegisterForm ? "✖ Fechar" : "➕ Novo usuário"}
        </button>
      </div>

      {showRegisterForm && (
        <RegisterForm
          onCreated={() => {
            fetchUsers(searchTerm);
          }}
        />
      )}

      {statusMessage && (
        <p className={`user-management-status ${statusMessage.type}`}>{statusMessage.text}</p>
      )}

      {loading ? (
        <p>Carregando usuários...</p>
      ) : error ? (
        <p className="user-management-error">{error}</p>
      ) : users.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <table className="user-management-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Matrícula</th>
              <th>Role</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = currentUserEmail !== null && u.email.toLowerCase() === currentUserEmail.toLowerCase();
              const isSaving = savingId === u.id;
              return (
                <tr key={u.id} className={u.enabled ? "" : "user-row-disabled"}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.matricula || "—"}</td>
                  <td>
                    <select
                      value={u.role}
                      disabled={isSaving || isSelf}
                      title={isSelf ? "Você não pode alterar a própria role" : undefined}
                      onChange={(e) => handleRoleChange(u, e.target.value as "ADMIN" | "USER")}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td>
                    <span className={`user-status-pill ${u.enabled ? "active" : "inactive"}`}>
                      {u.enabled ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td>
                    <div className="user-management-actions">
                      <button
                        type="button"
                        className={u.enabled ? "btn-deactivate" : "btn-reactivate"}
                        disabled={isSaving || (isSelf && u.enabled)}
                        title={isSelf && u.enabled ? "Você não pode desativar a própria conta" : undefined}
                        onClick={() => handleToggleStatus(u)}
                      >
                        {u.enabled ? "Desativar" : "Reativar"}
                      </button>
                      <button
                        type="button"
                        className="btn-reset-password"
                        disabled={isSaving || isSelf}
                        title={isSelf ? "Use \"Minha conta\" para trocar a sua própria senha" : undefined}
                        onClick={() => handleResetPassword(u)}
                      >
                        Resetar senha
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
