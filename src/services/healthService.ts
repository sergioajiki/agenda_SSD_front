import { HealthData } from "@/models/Health";
import api from "./api";

export const healthService = async (): Promise<HealthData> => {
    try {
        const response = await api.get('/api/health');
        return response.data as HealthData;
    } catch (error: any) {
        const errorMessage = error.response
        ? `Erro ${error.response.status}: ${error.response.data?.message || "Erro desconhecido"}`
        : "Erro de conexão com a API";
        console.error("Erro ao obter informações de health", error.message);
        throw new Error("Não foi possível carregar os dados do serviço de health");
    };    
};
