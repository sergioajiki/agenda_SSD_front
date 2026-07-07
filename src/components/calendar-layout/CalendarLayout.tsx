"use client";

import React from "react";
import FloatingMessage from "@/components/FloatingMessage"; // Componente para exibir mensagens flutuantes
import "./CalendarLayout.css"; // Estilos específicos do layout do calendário

/**
 * Tipagem das propriedades recebidas pelo componente CalendarLayout.
 * Este layout é responsável por distribuir a tela em:
 * - Topo: logo, navegação, login e atalho para nova reunião.
 * - Centro: calendário mensal/semanal.
 * - Direita: detalhes e ações sobre reuniões do dia selecionado.
 *
 * Também recebe:
 * - modal: conteúdo sobreposto (ex.: formulário de nova reunião).
 * - updateNotice: booleano que controla o aviso de atualização.
 * - floatingMessage: componente para exibir mensagens flutuantes globais.
 */
type CalendarLayoutProps = {
    top?: React.ReactNode;          // Conteúdo da barra superior (logo, navegação, login)
    center: React.ReactNode;        // Conteúdo da coluna central (calendário)
    right: React.ReactNode;         // Conteúdo da coluna direita (lista de reuniões)
    modal?: React.ReactNode;        // Conteúdo sobreposto (ex.: modal de nova reunião)
    updateNotice?: boolean;         // Indica se o aviso "Atualizando..." deve aparecer
    floatingMessage?: React.ReactNode; // Mensagem flutuante global (toast)
};

/**
 * 🔹 Componente principal de layout do calendário.
 * Estrutura a página em barra superior + 2 colunas + mensagens globais.
 *
 * Cada painel é recebido como prop e distribuído na página.
 */
export default function CalendarLayout({
    top,
    center,
    right,
    modal,
    updateNotice,
    floatingMessage
}: CalendarLayoutProps) {
    return (
        <div className="calendar-page">

            {/* 🔹 Barra superior
                - Logo, alternância Mensal / Semanal e login
            */}
            {top}

            {/* 🔹 Container principal que divide a página em colunas */}
            <div className="calendar-layout">

                {/* 🔹 Coluna Central
                    - Exibe o calendário propriamente dito
                    - Muda entre visão mensal ou semanal
                    - Ação de clique no dia é tratada externamente
                */}
                <div className="calendar-center-column">
                    {center}
                </div>

                {/* 🔹 Coluna Direita
                    - Lista todas as reuniões do dia selecionado
                    - Mostra botões de excluir/editar
                    - Exibe detalhes completos da reunião
                */}
                <div className="calendar-right-column">
                    {right}
                </div>
            </div>

            {/* 🔹 Toast de atualização (fica no canto inferior direito)
                Este aviso aparece quando o sistema está sincronizando
                reuniões com o backend ou atualizando dados.
            */}
            {updateNotice && (
                <div className="update-toast">
                    🔄 Atualizando...
                </div>
            )}

            {/* 🔹 Mensagem flutuante global
                Mostra alertas tipo sucesso/erro no topo da tela
                Ex.: "Reunião criada!", "Erro ao salvar", etc.
            */}
            {floatingMessage}

            {/* 🔹 Modal sobreposto (ex.: formulário de nova reunião) */}
            {modal}
        </div>
    );
}
