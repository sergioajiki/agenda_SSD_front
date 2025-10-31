"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import "./styles/LoginForm.css";

/** 
 * 🔹 Tipo de resposta esperada do backend no login 
 */
type LoginResponse = {
  id: number;
  name: string;
  email: string;
  role: string;
};

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
 * - Comunica o login e logout com o componente pai
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
   * 🔹 Faz a requisição de login para o backend
   * Caso o login seja bem-sucedido, envia os dados do usuário ao componente pai
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post<LoginResponse>(
        "http://localhost:8080/api/user/login",
        formData
      );

      setIsError(false);
      onLoginSuccess(response.data); // informa ao pai que o login foi feito
      alert(`✅ Bem-vindo, ${response.data.name}!`);
    } catch {
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

      {/* 🔸 Mensagem de erro, exibida somente em caso de falha */}
      {isError && (
        <p className="error-message">Email ou senha incorretos. Verifique e tente novamente.</p>
      )}
    </div>
  );
}
