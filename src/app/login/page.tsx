"use client";

import { createUser } from "@/services/userService";
import { ChangeEvent, FormEvent, useState } from "react";
import { UserRequest, UserResponse } from "@/models/User";

export default function Login() {
  const [formData, setFormData] = useState<UserRequest>({
    name: "",
    email: "",
    password: "",
    matricula: "",
    role: "USER",
  });

  const [message, setMessage] = useState<string>(""); // inicia com string vazia
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
      console.log("Resposta da API", userCreated);
    } catch (error) {
      setMessage("❌ Erro ao cadastrar usuário");
      setIsError(true);
      console.error("Erro ao cadastrar usuário", error);
    }
  };

  return (
    <div>
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        Nome:  
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br/>
        Email:  
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br/>
        Senha:  
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br/>
        Matrícula:  
        <input
          type="text"
          name="matricula"
          placeholder="Matrícula"
          value={formData.matricula}
          onChange={handleChange}
          required
        />
        <br/>
        <br/>
        <button type="submit">Cadastrar</button>
        <br/>
        <br/>
      </form>

      {/* Renderiza apenas se houver mensagem */}
      {message && (
        <p suppressHydrationWarning className={isError ? "text-red-600" : "text-green-600"}>
          {message}
        </p>
      )}
    </div>
  );
}
