import {
    UserRequest,
    UserResponse,
    UserCreatedResponse,
    UserUpdateRequest,
    SelfProfileUpdateRequest,
    ChangePasswordRequest,
} from "@/models/User";
import { ApiErrorResponse } from "@/models/ApiErrorResponse";
import api from "./api";
import axios from "axios";

/**
 * 🔹 Cadastra um novo usuário no sistema — o back gera a senha temporária,
 * devolvida uma única vez em UserCreatedResponse.temporaryPassword.
 * @param user Objeto com os dados do novo usuário
 */
export const createUser = async (user: UserRequest): Promise<UserCreatedResponse> => {
    try {
        const response = await api.post<UserCreatedResponse>("/api/user", user);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            const apiDetail = error.response?.data?.detail;
            const apiMessage = error.response?.data?.message;

            console.error("Erro ao cadastrar usuário", error.response?.data || error.message);

            throw new Error(apiDetail || apiMessage || "Erro desconhecido ao cadastrar usuário");
        }

        if (error instanceof Error) {
            throw new Error(error.message || "Erro inesperado ao cadastrar usuário");
        }

        throw new Error("Erro desconhecido ao cadastrar usuário");
    }
};

/**
 * 🔹 Lista todos os usuários cadastrados (somente ADMIN)
 */
export const getUsers = async (): Promise<UserResponse[]> => {
    try {
        const response = await api.get<UserResponse[]>("/api/user");
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            const apiDetail = error.response?.data?.detail;
            const apiMessage = error.response?.data?.message;

            throw new Error(apiDetail || apiMessage || "Erro desconhecido ao carregar usuários");
        }

        if (error instanceof Error) {
            throw new Error(error.message || "Erro inesperado ao carregar usuários");
        }

        throw new Error("Erro desconhecido ao carregar usuários");
    }
};

/**
 * 🔹 Busca usuários por nome ou email (somente ADMIN)
 * @param term Termo de busca
 */
export const searchUsers = async (term: string): Promise<UserResponse[]> => {
    try {
        const response = await api.get<UserResponse[]>("/api/user/search", {
            params: { q: term },
        });
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            const apiDetail = error.response?.data?.detail;
            const apiMessage = error.response?.data?.message;

            throw new Error(apiDetail || apiMessage || "Erro desconhecido ao buscar usuários");
        }

        if (error instanceof Error) {
            throw new Error(error.message || "Erro inesperado ao buscar usuários");
        }

        throw new Error("Erro desconhecido ao buscar usuários");
    }
};

/**
 * 🔹 Atualiza dados/role de um usuário existente (somente ADMIN)
 * @param id ID do usuário
 * @param user Dados atualizados
 */
export const updateUser = async (id: number, user: UserUpdateRequest): Promise<UserResponse> => {
    try {
        const response = await api.put<UserResponse>(`/api/user/${id}`, user);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            const apiDetail = error.response?.data?.detail;
            const apiMessage = error.response?.data?.message;

            throw new Error(apiDetail || apiMessage || "Erro desconhecido ao atualizar usuário");
        }

        if (error instanceof Error) {
            throw new Error(error.message || "Erro inesperado ao atualizar usuário");
        }

        throw new Error("Erro desconhecido ao atualizar usuário");
    }
};

/**
 * 🔹 Desativa o acesso de um usuário (somente ADMIN) — não apaga histórico,
 * é reversível via reactivateUser.
 * @param id ID do usuário
 */
export const deactivateUser = async (id: number): Promise<void> => {
    try {
        await api.delete(`/api/user/${id}`);
    } catch (error: unknown) {
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            const apiDetail = error.response?.data?.detail;
            const apiMessage = error.response?.data?.message;

            throw new Error(apiDetail || apiMessage || "Erro desconhecido ao desativar usuário");
        }

        if (error instanceof Error) {
            throw new Error(error.message || "Erro inesperado ao desativar usuário");
        }

        throw new Error("Erro desconhecido ao desativar usuário");
    }
};

/**
 * 🔹 Reativa o acesso de um usuário previamente desativado (somente ADMIN)
 * @param id ID do usuário
 */
export const reactivateUser = async (id: number): Promise<UserResponse> => {
    try {
        const response = await api.post<UserResponse>(`/api/user/${id}/reactivate`);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            const apiDetail = error.response?.data?.detail;
            const apiMessage = error.response?.data?.message;

            throw new Error(apiDetail || apiMessage || "Erro desconhecido ao reativar usuário");
        }

        if (error instanceof Error) {
            throw new Error(error.message || "Erro inesperado ao reativar usuário");
        }

        throw new Error("Erro desconhecido ao reativar usuário");
    }
};

/**
 * 🔹 Gera uma nova senha temporária pro usuário (somente ADMIN, não em si
 * mesmo) — mesma ideia do cadastro, útil quando alguém esquece a senha.
 * @param id ID do usuário
 */
export const resetPassword = async (id: number): Promise<UserCreatedResponse> => {
    try {
        const response = await api.post<UserCreatedResponse>(`/api/user/${id}/reset-password`);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            const apiDetail = error.response?.data?.detail;
            const apiMessage = error.response?.data?.message;

            throw new Error(apiDetail || apiMessage || "Erro desconhecido ao resetar senha");
        }

        if (error instanceof Error) {
            throw new Error(error.message || "Erro inesperado ao resetar senha");
        }

        throw new Error("Erro desconhecido ao resetar senha");
    }
};

/**
 * 🔹 Atualiza nome/email da própria conta (exige a senha atual)
 * @param profile Novos dados + senha atual como confirmação
 */
export const updateProfile = async (profile: SelfProfileUpdateRequest): Promise<UserResponse> => {
    try {
        const response = await api.put<UserResponse>("/api/user/me", profile);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            const apiDetail = error.response?.data?.detail;
            const apiMessage = error.response?.data?.message;

            throw new Error(apiDetail || apiMessage || "Erro desconhecido ao atualizar perfil");
        }

        if (error instanceof Error) {
            throw new Error(error.message || "Erro inesperado ao atualizar perfil");
        }

        throw new Error("Erro desconhecido ao atualizar perfil");
    }
};

/**
 * 🔹 Troca a senha da própria conta (exige a senha atual)
 * @param data Senha atual + nova senha
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
    try {
        await api.put("/api/user/me/password", data);
    } catch (error: unknown) {
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            const apiDetail = error.response?.data?.detail;
            const apiMessage = error.response?.data?.message;

            throw new Error(apiDetail || apiMessage || "Erro desconhecido ao trocar senha");
        }

        if (error instanceof Error) {
            throw new Error(error.message || "Erro inesperado ao trocar senha");
        }

        throw new Error("Erro desconhecido ao trocar senha");
    }
};
