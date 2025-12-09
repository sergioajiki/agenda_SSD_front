"use client";

import { useState } from "react";
import { LoginResponse } from "@/models/Auth";
import { MessageType } from "@/hooks/useFloatingMessage";

export function useAuth(
  showMessage: (msg: string, type?: MessageType, duration?: number) => void
) {
  const [user, setUser] = useState<LoginResponse | null>(null);

  /** Login simples */
  const login = (userData: LoginResponse) => {
    setUser(userData);
    showMessage("🔓 Login realizado!", "success");
  };

  /** Logout padrão */
  const logout = () => {
    setUser(null);
    showMessage("✔ Logout realizado", "info");
  };

  /** Controle opcional para modal/tela de cadastro */
  const [showRegister, setShowRegister] = useState(false);

  const toggleRegister = () => setShowRegister(prev => !prev);

  return {
    user,
    login,
    logout,
    showRegister,
    toggleRegister,
    setUser
  };
}
