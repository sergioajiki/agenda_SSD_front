import { ApiErrorResponse } from "@/models/ApiErrorResponse";
import api from "./api";
import { MeetingRequest, MeetingResponse } from "@/models/Meetings";
import axios from "axios";

export const createMeeting = async (meeting: MeetingRequest): Promise<MeetingResponse> => {
    try {
        const response = await api.post<MeetingResponse>('/api/meeting', meeting);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            const apiDetail = error.response?.data?.detail;
            const apiMessage = error.response?.data?.message;

            console.error("Erro ao cadastrar reunião", error.response?.data || error.message);

            throw new Error(apiDetail || apiMessage || "Erro desconhecido ao cadastrar reunião");
        }

        // fallback para erros que não são do Axios
        if (error instanceof Error) {
            throw new Error(error.message || "Erro inesperado ao cadastrar reunião");
        }

        throw new Error("Erro desconhecido ao cadastrar reunião");
    }
};
