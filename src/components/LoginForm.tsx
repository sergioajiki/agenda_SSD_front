"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { loginUser } from "@/services/authService";
import { LoginResponse } from "@/models/Auth";
import "./styles/LoginForm.css";

/**
 * 🔹 Propriedades esperadas pelo componente LoginForm
 */
type LoginFormProps = {
  /** Callback executado após login bem-sucedido */
  onLoginSuccess: (user: LoginResponse) => void;

  /** Callback opcional para logout */
  onLogout?: () => void;

  /** Usuário logado (controlado pelo componente pai) */
  loggedUser?: LoginResponse | null;
};

/**
 * 🔹 Componente de Login (vertical)
 * - Exibe o formulário de login quando o usuário não está autenticado
 * - Quando autenticado, mostra o nome e o botão de sair
 * - Comunicação com o backend é feita via authService.ts
 */
export default function LoginForm({
  onLoginSuccess,
  onLogout,
  loggedUser,
}: LoginFormProps) {
  // Estado local para armazenar o e-mail e senha digitados
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Estado que controla se houve erro de autenticação
  const [isError, setIsError] = useState(false);

  /** 🔹 Atualiza os campos do formulário dinamicamente */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** 🔹 Faz a requisição de login via authService */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const user = await loginUser(formData);
      setIsError(false);
      onLoginSuccess(user);
      alert(`✅ Bem-vindo, ${user.name}!`);
    } catch {
      setIsError(true);
      alert("❌ Email ou senha inválidos. Tente novamente.");
    }
  };

  /** 🔹 Logout — limpa o estado do usuário logado */
  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  /** 🔹 Caso já esteja logado */
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

  /** 🔹 Caso não esteja logado */
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
        />

        <label>Senha:</label>
        <input
          type="password"
          name="password"
          placeholder="Digite sua senha"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Entrar</button>

        {isError && (
          <p className="error-message">⚠️ Falha ao autenticar. Verifique os dados.</p>
        )}
      </form>
    </div>
  );
}
