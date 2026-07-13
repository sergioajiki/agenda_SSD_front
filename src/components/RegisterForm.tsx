"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { createUser } from "@/services/userService";
import { UserRequest, UserCreatedResponse } from "@/models/User";
import "./styles/RegisterForm.css";

type RegisterFormProps = {
  // 🔹 Chamado após um cadastro bem-sucedido — a tela de gestão de acessos
  // usa isso pra atualizar a lista sem precisar recarregar a página.
  onCreated?: (user: UserCreatedResponse) => void;
};

const EMPTY_FORM: UserRequest = { name: "", email: "", matricula: "", role: "USER" };

/**
 * 🔹 Formulário de Cadastro de Usuário
 * - Só é usado pelo admin, dentro da tela de gestão de acessos (Monitoring)
 * - Quem tem acesso à agenda é decidido aqui — não existe autocadastro
 * - O admin não define senha: o back gera uma temporária, mostrada aqui uma
 *   única vez pra ser repassada ao usuário, que troca no primeiro login.
 */
export default function RegisterForm({ onCreated }: RegisterFormProps) {
  const [formData, setFormData] = useState<UserRequest>(EMPTY_FORM);
  const [error, setError] = useState<string>("");

  // Preenchido só depois de um cadastro bem-sucedido — é a única janela em
  // que a senha temporária existe em texto puro em algum lugar.
  const [createdCredentials, setCreatedCredentials] = useState<UserCreatedResponse | null>(null);
  const [copied, setCopied] = useState(false);

  /** 🔹 Atualiza campos dinamicamente */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /** 🔹 Envia os dados para o backend */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const userCreated = await createUser(formData);
      setCreatedCredentials(userCreated);
      setFormData(EMPTY_FORM);
      onCreated?.(userCreated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar usuário. Tente novamente.");
    }
  };

  const handleCopy = async () => {
    if (!createdCredentials) return;
    const text = `Email: ${createdCredentials.email}\nSenha temporária: ${createdCredentials.temporaryPassword}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ============================================================
  // 🔹 Cadastro concluído — mostra a senha temporária pra copiar
  // ============================================================
  if (createdCredentials) {
    return (
      <div className="register-container">
        <h2 className="form-title">Usuário cadastrado</h2>

        <p className="register-message success">
          ✅ {createdCredentials.name} foi cadastrado(a). Repasse os dados abaixo — a senha só aparece agora,
          não dá pra recuperar depois.
        </p>

        <div className="register-credentials">
          <div>
            <label>Email</label>
            <p>{createdCredentials.email}</p>
          </div>
          <div>
            <label>Senha temporária</label>
            <p className="register-credentials-password">{createdCredentials.temporaryPassword}</p>
          </div>
        </div>

        <button type="button" onClick={handleCopy}>
          {copied ? "✔ Copiado!" : "📋 Copiar email e senha"}
        </button>
        <button type="button" className="register-secondary" onClick={() => setCreatedCredentials(null)}>
          Cadastrar outro usuário
        </button>
      </div>
    );
  }

  // ============================================================
  // 🔹 Formulário de cadastro
  // ============================================================
  return (
    <div className="register-container">
      <h2 className="form-title">Cadastro de Usuário</h2>

      <form className="register-form" onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input
          type="text"
          name="name"
          placeholder="Nome completo"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Email institucional"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Matrícula (opcional):</label>
        <input
          type="text"
          name="matricula"
          placeholder="Digite a matrícula, se houver"
          value={formData.matricula}
          onChange={handleChange}
        />

        <label>Tipo de acesso:</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="USER">Usuário — pode agendar reuniões</option>
          <option value="ADMIN">Administrador — gerencia acessos</option>
        </select>

        <p className="register-hint">
          Uma senha temporária é gerada automaticamente — o usuário vai trocá-la no primeiro login.
        </p>

        <button type="submit">Cadastrar</button>
      </form>

      {error && <p className="register-message error">❌ {error}</p>}
    </div>
  );
}
