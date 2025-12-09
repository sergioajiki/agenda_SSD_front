"use client";

import { useEffect, useState } from "react";

import "./styles/FloatingMessage.css";

type FloatingMessageProps = {
  /** Texto da mensagem exibida */
  text: string;

  /** Tipo da mensagem — define a cor */
  type?: "success" | "error" | "warning" | "info";

  /** Duração em milissegundos (padrão: 3000) */
  duration?: number;
};

/**
 * Componente de Mensagem Flutuante
 * - Exibe notificações temporárias no topo central da tela
 * - Desaparece automaticamente com animação suave
 */
export default function FloatingMessage({
  text,
  type = "info",
  duration = 3000,
}: FloatingMessageProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className={`floating-message ${type}`}>
      {text}
    </div>
  );
}
