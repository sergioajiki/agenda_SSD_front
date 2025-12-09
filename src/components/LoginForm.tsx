"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { loginUser } from "@/services/authService";
import { LoginResponse } from "@/models/Auth";
import { MessageType } from "@/hooks/useFloatingMessage";
import "./styles/LoginForm.css";

type LoginFormProps = {
  onLogin: (email: string, password: string) => Promise<void>;
  onLogout?: () => void;
  loggedUser?: LoginResponse | null;
  showMessage?: (msg: string, type?: MessageType, duration?: number) => void;
};

export default function LoginForm({
  onLogin,
  onLogout,
  loggedUser,
  showMessage,
}: LoginFormProps) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);

    try {
      await onLogin(formData.email, formData.password);
      showMessage?.("🔓 Login realizado com sucesso!", "success", 3000);
    } catch (err) {
      setIsError(true);
      const msg = err instanceof Error ? err.message : "Erro ao autenticar";
      showMessage?.(`❌ ${msg}`, "error", 4000);
    } finally {
      setIsLoading(false);
    }
  };
  console.log("logged in LoginForm", loggedUser?.role)
  const handleLogout = () => {
    onLogout?.();
    showMessage?.("✔ Você saiu do sistema.", "info", 2000);
  };

  // ============================================================
  // 🔹 SE O USUÁRIO JÁ ESTÁ LOGADO
  // ============================================================
  if (loggedUser) {
    return (
      <div className="login-form-container-vertical">
        <div className="logged-user-info">
  <span className="user-name">👤 {loggedUser.name}</span>

  <div className="logged-user-buttons">
    {loggedUser.role === "ADMIN" && (
      <button className="btn-monitoring" onClick={() => window.open("/monitoring", "_blank")}>
        Monitoring
      </button>
    )}

    <button className="btn-logout" onClick={handleLogout}>
      Sair
    </button>
  </div>
</div>

      </div>
    );
  }

  // ============================================================
  // 🔹 FORMULÁRIO DE LOGIN
  // ============================================================
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
          <p className="error-message">
            ⚠️ Falha ao autenticar. Verifique os dados.
          </p>
        )}
      </form>
    </div>
  );
}
