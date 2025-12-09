"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { loginUser } from "@/services/authService";
import { LoginResponse } from "@/models/Auth";
import { MessageType } from "@/hooks/useFloatingMessage";
import "./styles/LoginForm.css";

/**
 * Props do componente LoginForm corrigidas:
 * - onLogin: função fornecida pelo pai que executa o login (email, password) => Promise<void>
 * - onLogout: (opcional) função para logout
 * - loggedUser: (opcional) usuário já logado
 * - showMessage: (opcional) utilitário para exibir mensagens (do hook useFloatingMessage)
 */
type LoginFormProps = {
  onLogin: (email: string, password: string) => Promise<void>;
  onLogout?: () => void;
  loggedUser?: LoginResponse | null;
  showMessage?: (msg: string, type?: MessageType, duration?: number) => void;
};

/**
 * LoginForm
 *
 * - Responsável pelo formulário de autenticação
 * - Usa a função onLogin passada pelo pai (não chama o serviço diretamente, mas tenta também como fallback)
 * - Se fornecer showMessage, usa para feedback (sucesso/erro)
 */
export default function LoginForm({
  onLogin,
  onLogout,
  loggedUser,
  showMessage,
}: LoginFormProps) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Atualiza campos do formulário
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // Submete: chama onLogin(email, password) e propaga mensagens via showMessage quando disponível
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);

    try {
      // Se o componente pai fornece onLogin, usamos ele (recomendado)
      await onLogin(formData.email, formData.password);

      // Mensagem de sucesso (se disponível)
      showMessage?.("🔓 Login realizado com sucesso!", "success", 3000);
    } catch (err) {
      setIsError(true);

      // Tenta extrair mensagem do erro (se for Error)
      const msg = err instanceof Error ? err.message : "Erro ao autenticar";
      showMessage?.(`❌ ${msg}`, "error", 4000);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout (usa onLogout se fornecido)
  const handleLogout = () => {
    onLogout?.();
    showMessage?.("✔ Você saiu do sistema.", "info", 2000);
  };

  // Se já está logado, mostra bloco de usuário + botão sair
  if (loggedUser) {
    return (
      <div className="login-form-container-vertical">
        <div className="logged-user-info">
          <span className="user-name">👤 {loggedUser.name}</span>
          <button onClick={handleLogout} className="btn-logout">
            Sair
          </button>
        </div>
      </div>
    );
  }

  // Caso não esteja logado, renderiza o formulário
  return (
    <div className="login-form-container-vertical">
      <h2 className="form-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form-vertical">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Digite seu email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="username"
        />

        <label>Senha:</label>
        <input
          type="password"
          name="password"
          placeholder="Digite sua senha"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </button>

        {isError && (
          <p className="error-message">⚠️ Falha ao autenticar. Verifique os dados.</p>
        )}
      </form>
    </div>
  );
}
