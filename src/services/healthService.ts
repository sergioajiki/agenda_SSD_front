import { HealthData } from "@/models/Health";
import api from "./api";
import type { AxiosError } from "axios";

export const healthService = async (): Promise<HealthData> => {
    try {
        const response = await api.get<HealthData>("/api/health");
        return response.data;
    } catch (error: unknown) {
        let errorMessage = "Não foi possível carregar os dados do serviço de health";

        // Se for um erro do axios
        if ((error as AxiosError)?.isAxiosError) {
            const axiosError = error as AxiosError<{ message?: string }>;
            errorMessage = axiosError.response
                ? `Erro ${axiosError.response.status}: ${axiosError.response.data?.message || "Erro desconhecido"}`
                : "Erro de conexão com a API";
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error("Erro ao obter informações de health:", error);
        throw new Error(errorMessage);
    }
};
