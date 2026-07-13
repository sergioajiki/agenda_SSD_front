"use client";

import { useState, FormEvent } from "react";
import { changePassword } from "@/services/userService";
import "./styles/AccountModal.css";

type ForcedPasswordChangeModalProps = {
  onSuccess: () => void;
};

/**
 * Troca de senha obrigatória — aparece quando o login vem com uma senha
 * temporária gerada pelo admin (LoginResponse.mustChangePassword).
 * De propósito, sem botão de fechar: não dá pra usar o resto do sistema
 * com uma senha temporária ainda pendente de troca.
 */
export default function ForcedPasswordChangeModal({ onSuccess }: ForcedPasswordChangeModalProps) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (form.newPassword !== form.confirmNewPassword) {
      setMessage({ text: "❌ A confirmação não bate com a nova senha.", type: "error" });
      return;
    }

    setSaving(true);
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao trocar senha.";
      setMessage({ text: `❌ ${msg}`, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-modal-overlay">
      <div className="account-modal">
        <h2 className="form-title">Defina sua senha</h2>
        <p className="account-forced-notice">
          Você entrou com uma senha temporária. Defina uma senha definitiva para continuar usando o sistema.
        </p>

        <form className="account-form" onSubmit={handleSubmit}>
          <label>Senha temporária (a que você acabou de usar):</label>
          <input
            type="password"
            value={form.currentPassword}
            onChange={(e) => setForm((p) => ({ ...p, currentPassword: e.target.value }))}
            required
          />

          <label>Nova senha:</label>
          <input
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
            required
          />

          <label>Confirmar nova senha:</label>
          <input
            type="password"
            value={form.confirmNewPassword}
            onChange={(e) => setForm((p) => ({ ...p, confirmNewPassword: e.target.value }))}
            required
          />

          <button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Definir senha"}
          </button>

          {message && <p className={`account-message ${message.type}`}>{message.text}</p>}
        </form>
      </div>
    </div>
  );
}
