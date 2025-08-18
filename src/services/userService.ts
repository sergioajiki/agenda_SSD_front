import { UserRequest, UserResponse } from "@/models/User";
import { ApiErrorResponse } from "@/models/ApiErrorResponse";
import api from "./api";
import axios from "axios";

export const createUser = async (user: UserRequest): Promise<UserResponse> => {
    try {
        const response = await api.post<UserResponse>("/api/user", user);
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


