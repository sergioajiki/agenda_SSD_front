import { useState } from "react";

/**
 * ===================================================================
 * useFloatingMessage — Mensagem Global Flutuante
 * ===================================================================
 * Este hook cria um sistema simples de notificações visuais:
 *   - success (verde)
 *   - error (vermelho)
 *   - info (azul)
 *
 * É exibida por 3 segundos no topo da tela.
 * ===================================================================
 */
export type MessageType = "success" | "error" | "warning" | "info";

export function useFloatingMessage() {
    /** Estado com texto e tipo da mensagem */
    const [floatingMessage, setFloatingMessage] = useState<
        {
            text: string;
            type: "success" | "error" | "warning" | "info";
        } | null>(null);

    /**
     * 🔹 Exibe mensagem temporária na tela
     */    
    const showMessage = (
        text: string,
        type: "success" | "error" | "warning" | "info" = "info",
        duration = 3000
    ) => {
        setFloatingMessage({ text, type });
        setTimeout(() => setFloatingMessage(null), duration);
    };
    return { floatingMessage, showMessage };
}