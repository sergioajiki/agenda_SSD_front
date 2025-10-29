"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import "./styles/LoginForm.css";

type LoginResponse = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type LoginFormProps = {
  onLoginSuccess: (user: LoginResponse) => void;
};

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<LoginResponse>(
        "http://localhost:8080/api/user/login",
        formData
      );

      console.log(`✅ Login bem-sucedido: ${response.data.name}`);
      onLoginSuccess(response.data);
    } catch (error) {
      console.error("❌ Erro ao fazer login:", error);
      alert("Email ou senha inválidos!");
    }
  };

  return (
    <div className="login-form-container-horizontal">
      <form onSubmit={handleSubmit} className="login-form-horizontal">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Senha"
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
