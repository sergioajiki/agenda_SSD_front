"use client";

import { useEffect, useState } from "react";
import { LoginResponse } from "@/models/Auth";
import { MessageType } from "@/hooks/useFloatingMessage";
import { clearStoredAuth, getStoredAuth, setStoredAuth } from "@/utils/authStorage";

export function useAuth(
  showMessage: (msg: string, type?: MessageType, duration?: number) => void
) {
  const [user, setUserState] = useState<LoginResponse | null>(null);

  // Restaura a sessão salva no navegador só depois de montar no cliente — se
  // fizesse isso já no useState inicial, o HTML renderizado no servidor
  // (onde não existe localStorage) e o primeiro render no navegador podiam
  // divergir e gerar erro de hidratação do Next.
  useEffect(() => {
    const stored = getStoredAuth();
    if (stored) {
      setUserState(stored);
    }
  }, []);

  /** Atualiza o estado e mantém a sessão salva (ou limpa, se null) em sincronia. */
  const setUser = (userData: LoginResponse | null) => {
    if (userData) {
      setStoredAuth(userData);
    } else {
      clearStoredAuth();
    }
    setUserState(userData);
  };

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

  // O interceptor de resposta em services/api.ts dispara esse evento sempre
  // que o back retorna 401 — token ausente, expirado ou inválido. Reagindo
  // aqui, a sessão cai de verdade sem o usuário precisar clicar em "Sair".
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      showMessage("⚠️ Sessão expirada. Faça login novamente.", "warning");
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [showMessage]);

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
