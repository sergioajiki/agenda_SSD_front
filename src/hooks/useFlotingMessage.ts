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

export function useFlotingMessage() {
    /** Estado com texto e tipo da mensagem */
    const [floatingMessage, setFlotingMessage] = useState<
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
        setFlotingMessage({ text, type });
        setTimeout(() => setFlotingMessage(null), duration);
    };
    return { floatingMessage, showMessage };
}