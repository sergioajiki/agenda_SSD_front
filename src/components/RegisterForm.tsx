"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { createUser } from "@/services/userService";
import { UserRequest, UserResponse } from "@/models/User";
import "./styles/RegisterForm.css";

/**
 * 🔹 Formulário de Cadastro de Usuário
 * - Usado para primeiro acesso (caso o usuário ainda não tenha login)
 * - Envia dados ao backend via userService.ts
 */
export default function RegisterForm() {
  const [formData, setFormData] = useState<UserRequest>({
    name: "",
    email: "",
    password: "",
    matricula: "",
    role: "USER",
  });

  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  /** 🔹 Atualiza campos dinamicamente */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /** 🔹 Envia os dados para o backend */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCreated: UserResponse = await createUser(formData);

      if (userCreated?.id) {
        setMessage(`✅ Usuário ${userCreated.name} cadastrado com sucesso!`);
        setIsError(false);
      } else {
        setMessage("⚠️ Não foi possível confirmar o cadastro.");
        setIsError(true);
      }
    } catch {
      setMessage("❌ Erro ao cadastrar usuário. Tente novamente.");
      setIsError(true);
    }
  };

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

        <label>Senha:</label>
        <input
          type="password"
          name="password"
          placeholder="Crie uma senha"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>Matrícula:</label>
        <input
          type="text"
          name="matricula"
          placeholder="Digite sua matrícula"
          value={formData.matricula}
          onChange={handleChange}
          required
        />

        <button type="submit">Cadastrar</button>
      </form>

      {message && (
        <p className={`register-message ${isError ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
