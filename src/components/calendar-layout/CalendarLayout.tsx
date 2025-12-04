"use client";
import React from "react";
import FloatingMessage from "@/components/FloatingMessage";

import "./CalendarLayout.css";

type CalendarLayoutProps = {
    left: React.ReactNode;
    center: React.ReactNode;
    right: React.ReactNode;
    updateNotice?: boolean;
    floatingMessage?: React.ReactNode;
};

export default function CalendarLayout({
    left,
    center,
    right,
    updateNotice,
    floatingMessage
}: CalendarLayoutProps) {
    return (
        <div className="calendar-page">
            <div className="calendar-layout">

                {/* 🔹 Coluna Esquerda */}
                <div className="calendar-left-column">{left}</div>

                {/* 🔹 Coluna Central */}
                <div className="calendar-center-column">{center}</div>

                {/* 🔹 Coluna Direita */}
                <div className="calendar-right-column">{right}</div>
            </div>

            {/* 🔹 Toast de atualização (canto inferior direito) */}
            {updateNotice && (
                <div className="update-toast">
                    🔄 Atualizando...
                </div>
            )}

            {/* 🔹 Mensagem flutuante global (topo central) */}
            {floatingMessage}
        </div>
    );
}
