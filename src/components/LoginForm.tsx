"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { loginUser } from "@/services/authService";
import { LoginResponse } from "@/models/Auth";
import "./styles/LoginForm.css";

/** 
 * 🔹 Propriedades esperadas pelo componente 
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
 * 🔹 Componente de Login
 * - Exibe um formulário de login quando o usuário não está autenticado
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

  /**
   * 🔹 Atualiza os campos do formulário de forma dinâmica
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * 🔹 Faz a requisição de login via authService
   * Caso o login seja bem-sucedido, envia os dados do usuário ao componente pai
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const user = await loginUser(formData);
      setIsError(false);
      onLoginSuccess(user); // informa ao pai que o login foi feito
      alert(`✅ Bem-vindo, ${user.name}!`);
    } catch (error) {
      // Exibe apenas na tela, sem console.error
      setIsError(true);
      alert("❌ Email ou senha inválidos. Tente novamente.");
    }
  };

  /**
   * 🔹 Executa logout — informa ao componente pai para limpar o estado do usuário
   */
  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  // ✅ Se já houver usuário logado, exibe nome + botão de sair na mesma linha
  if (loggedUser) {
    return (
      <div className="login-form-container-horizontal">
        <span className="user-name">👤 {loggedUser.name}</span>
        <button onClick={handleLogout} className="btn-logout">
          Sair
        </button>
      </div>
    );
  }

  // 🔹 Caso contrário, exibe o formulário de login
  return (
    <div className="login-form-container-horizontal">
      <form onSubmit={handleSubmit} className="login-form-horizontal">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Senha"
          required
        />
        <button type="submit">Entrar</button>
      </form>
      {
      /**isError && (
        <p className="login-error">⚠️ Falha ao autenticar. Verifique seus dados.</p>
      )*/
      }
    </div>
  );
}
