'use client'
import { createUser } from "@/services/userService";
import { ChangeEvent, FormEvent, useState } from "react";
import { User } from "@/models/User";

export default function Login() {
    const [formData, setFormData] = useState<User>({
        name: '',
        email: '',
        password: '',
        matricula: '',
        role: 'USER'
    });

    const [message, setMessage] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const userCreated = await createUser(formData);

            if (userCreated?.id) {
                setMessage(`✅ Usuário ${userCreated.name} cadastrado com sucesso!`);
            } else {
                setMessage("⚠️ Não foi possível confirmar o cadastro");
            }
            console.log("Resposta da API", userCreated);
        } catch (error) {
            setMessage("Erro ao cadastrar usuário");
            console.error("Erro ao cadastrar usuário", error);
        }
    }

    return (
        <main>
            <div>
                <h1>Cadastro</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Senha"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <input
                        type="matricula"
                        name="matricula"
                        placeholder="Matricula"
                        value={formData.matricula}
                        onChange={handleChange}
                    />
                    <button type="submit">Cadastrar</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </main>
    )
}