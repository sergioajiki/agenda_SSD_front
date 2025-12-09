"use client";

import React from "react";
import FloatingMessage from "@/components/FloatingMessage"; // Componente para exibir mensagens flutuantes
import "./CalendarLayout.css"; // Estilos específicos do layout do calendário

/**
 * Tipagem das propriedades recebidas pelo componente CalendarLayout.
 * Este layout é responsável por distribuir a tela em três colunas:
 * - Esquerda: informações do usuário, botões, navegação.
 * - Centro: calendário mensal/semanal.
 * - Direita: detalhes e ações sobre reuniões do dia selecionado.
 * 
 * Também recebe:
 * - updateNotice: booleano que controla o aviso de atualização.
 * - floatingMessage: componente para exibir mensagens flutuantes globais.
 */
type CalendarLayoutProps = {
    left: React.ReactNode;          // Conteúdo da coluna esquerda
    center: React.ReactNode;        // Conteúdo da coluna central (calendário)
    right: React.ReactNode;         // Conteúdo da coluna direita (lista de reuniões)
    updateNotice?: boolean;         // Indica se o aviso "Atualizando..." deve aparecer
    floatingMessage?: React.ReactNode; // Mensagem flutuante global (toast)
};

/**
 * 🔹 Componente principal de layout do calendário.
 * Estrutura a página em 3 áreas verticais + mensagens globais.
 * 
 * Cada painel é recebido como prop e distribuído na página.
 */
export default function CalendarLayout({
    left,
    center,
    right,
    updateNotice,
    floatingMessage
}: CalendarLayoutProps) {
    return (
        <div className="calendar-page">
            
            {/* 🔹 Container principal que divide a página em 3 colunas */}
            <div className="calendar-layout">

                {/* 🔹 Coluna Esquerda
                    - Geralmente exibe dados de usuário
                    - Botões de login/logout, registrar
                    - Filtro entre visão Mensal / Semanal
                    - Formulário de criação/edição de reuniões
                */}
                <div className="calendar-left-column">
                    {left}
                </div>

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
        </div>
    );
}
