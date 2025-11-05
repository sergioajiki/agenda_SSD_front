"use client";

import { createUser } from "@/services/userService";
import { ChangeEvent, FormEvent, useState } from "react";
import { UserRequest, UserResponse } from "@/models/User";
import "./styles/Login.css";

export default function Login() {
  const [formData, setFormData] = useState<UserRequest>({
    name: "",
    email: "",
    password: "",
    matricula: "",
    role: "USER",
  });

  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCreated: UserResponse = await createUser(formData);

      if (userCreated?.id) {
        setMessage(`✅ Usuário ${userCreated.name} cadastrado com sucesso!`);
        setIsError(false);
      } else {
        setMessage("⚠️ Não foi possível confirmar o cadastro");
        setIsError(true);
      }
    } catch (error) {
      setMessage("❌ Erro ao cadastrar usuário");
      setIsError(true);
    }
  };

  return (
    <div className="login-container">
      <h1>Cadastro</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Senha:</label>
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>Matrícula:</label>
        <input
          type="text"
          name="matricula"
          placeholder="Matrícula"
          value={formData.matricula}
          onChange={handleChange}
          required
        />

        <button type="submit">Cadastrar</button>
      </form>

      {message && (
        <p className={`login-message ${isError ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
