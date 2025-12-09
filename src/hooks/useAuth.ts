import { useState } from "react";
import { LoginResponse } from "@/models/Auth";

/**
 * ========================================================================
 * useAuth — Hook de Autenticação Simples (sem persistência local)
 * ========================================================================
 * Este hook controla:
 *   • o usuário atualmente logado
 *   • a alternância entre tela de login e tela de cadastro
 *   • mensagens de feedback para o usuário (via showMessage)
 *
 * Útil quando a autenticação é simples e não requer salvar dados no
 * localStorage. A lógica é isolada para manter o Page.tsx limpo.
 * ========================================================================
 */
export function useAuth(showMessage: (msg: string, type?: any) => void) {
  
  /** 
   * 👤 Estado do usuário autenticado
   * - null → usuário não logado
   * - LoginResponse → usuário logado
   */
  const [user, setUser] = useState<LoginResponse | null>(null);

  /**
   * 📝 Controla se a tela ativa é:
   * - login (false)
   * - cadastro (true)
   */
  const [showRegister, setShowRegister] = useState(false);

  /**
   * 🔓 Realiza login do usuário
   * - guarda os dados recebidos
   * - exibe mensagem de boas-vindas
   */
  const login = (userData: LoginResponse) => {
    setUser(userData);
    showMessage(`✅ Bem-vindo, ${userData.name}!`, "success");
  };

  /**
   * 🔒 Efetua logout do usuário
   * - limpa estado
   * - exibe mensagem informativa
   */
  const logout = () => {
    setUser(null);
    showMessage("👋 Você saiu do sistema.", "info");
  };

  /**
   * 🔄 Alterna entre a tela de login e a de cadastro
   */
  const toggleRegister = () => setShowRegister((prev) => !prev);

  return { user, login, logout, showRegister, toggleRegister };
}