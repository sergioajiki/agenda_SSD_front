"use client";

import { useEffect, useState, FormEvent } from "react";
import { updateProfile, changePassword } from "@/services/userService";
import { LoginResponse } from "@/models/Auth";
import "./styles/AccountModal.css";

type AccountModalProps = {
  loggedUser: LoginResponse;
  onClose: () => void;
  // Chamado quando nome/email é salvo com sucesso — o e-mail é o "subject"
  // do token, então trocá-lo invalida a sessão atual: o pai deve deslogar
  // e pedir um novo login com o e-mail novo.
  onEmailChanged: () => void;
};

export default function AccountModal({ loggedUser, onClose, onEmailChanged }: AccountModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // 🔹 Uma coisa de cada vez: antes os dois formulários ficavam empilhados,
  // cada um com seu próprio campo "senha atual" — confuso e redundante.
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  // ---------- Alterar dados (nome/email) ----------
  const [profileForm, setProfileForm] = useState({
    name: loggedUser.name,
    email: loggedUser.email,
    currentPassword: "",
  });
  const [profileMessage, setProfileMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);
    try {
      const emailChanged = profileForm.email.trim().toLowerCase() !== loggedUser.email.toLowerCase();
      await updateProfile(profileForm);

      if (emailChanged) {
        // O token atual não serve mais pro e-mail novo — desloga e pede
        // login de novo, em vez de deixar a sessão quebrada silenciosamente.
        onEmailChanged();
        return;
      }

      setProfileMessage({ text: "✅ Dados atualizados com sucesso!", type: "success" });
      setProfileForm((p) => ({ ...p, currentPassword: "" }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao atualizar dados.";
      setProfileMessage({ text: `❌ ${msg}`, type: "error" });
    } finally {
      setSavingProfile(false);
    }
  };

  // ---------- Trocar senha ----------
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordMessage({ text: "❌ A confirmação não bate com a nova senha.", type: "error" });
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMessage({ text: "✅ Senha alterada com sucesso!", type: "success" });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao trocar senha.";
      setPasswordMessage({ text: `❌ ${msg}`, type: "error" });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="account-modal-overlay" onClick={onClose}>
      <div className="account-modal" onClick={(e) => e.stopPropagation()}>
        <button className="account-modal-close" onClick={onClose} aria-label="Fechar">
          ×
        </button>

        <h2 className="form-title">Minha conta</h2>

        <div className="account-modal-tabs">
          <button
            type="button"
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Meus dados
          </button>
          <button
            type="button"
            className={activeTab === "password" ? "active" : ""}
            onClick={() => setActiveTab("password")}
          >
            Trocar senha
          </button>
        </div>

        {activeTab === "profile" && (
        <form className="account-form" onSubmit={handleProfileSubmit}>
          <label>Nome:</label>
          <input
            type="text"
            value={profileForm.name}
            onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            value={profileForm.email}
            onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
            required
          />

          <label>Senha atual (confirme pra salvar):</label>
          <input
            type="password"
            value={profileForm.currentPassword}
            onChange={(e) => setProfileForm((p) => ({ ...p, currentPassword: e.target.value }))}
            required
          />

          <button type="submit" disabled={savingProfile}>
            {savingProfile ? "Salvando..." : "Salvar dados"}
          </button>

          {profileMessage && (
            <p className={`account-message ${profileMessage.type}`}>{profileMessage.text}</p>
          )}
        </form>
        )}

        {activeTab === "password" && (
        <form className="account-form" onSubmit={handlePasswordSubmit}>
          <label>Senha atual:</label>
          <input
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
            required
          />

          <label>Nova senha:</label>
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
            required
          />

          <label>Confirmar nova senha:</label>
          <input
            type="password"
            value={passwordForm.confirmNewPassword}
            onChange={(e) => setPasswordForm((p) => ({ ...p, confirmNewPassword: e.target.value }))}
            required
          />

          <button type="submit" disabled={savingPassword}>
            {savingPassword ? "Salvando..." : "Trocar senha"}
          </button>

          {passwordMessage && (
            <p className={`account-message ${passwordMessage.type}`}>{passwordMessage.text}</p>
          )}
        </form>
        )}
      </div>
    </div>
  );
}
