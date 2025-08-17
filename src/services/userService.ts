import { User, UserRequest, UserResponse } from "@/models/User";
import api from "./api";

export const createUser = async (user: UserRequest): Promise<UserResponse> => {
    try {
        const response = await api.post<UserResponse>('/api/user', user);
        return response.data;
    } catch (error: any) {
        console.error("Erro ao cadastrar usuário", error.response?.data || error.message);
        throw new Error("Erro ao cadastrar usuário");
    }
};

