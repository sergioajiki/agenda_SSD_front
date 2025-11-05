import api from "./api"
import axios from "axios";
import { ApiErrorResponse } from "@/models/ApiErrorResponse";
import { LoginRequest, LoginResponse } from "@/models/Auth";

/**
 * 🔹 Efetua login do usuário
 * @param credentials email e senha
 * @returns Dados do usuário autenticado
 */
export const loginUser = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/api/user/login", credentials);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const message =
        error.response?.data?.message || "Erro ao autenticar usuário.";
      throw new Error(message);
    }
    throw new Error("Falha de comunicação com o servidor.");
  }
};