import api from "./api";
import { MeetingRequest, MeetingResponse } from "@/models/Meetings";

export const createMeeting = async (meeting: MeetingRequest): Promise<MeetingResponse> => {
    try {
        const response = await api.post<MeetingResponse>('/api/meeting', meeting);
        return response.data;
    } catch (error: any) {
       // console.error("Erro ao cadastrar reunião", error.response?.data || error.message);

        // captura a mensagem detalhada do backend
        const apiDetail = error.response?.data?.detail;
        const apiMessage = error.response?.data?.message;
       
          // lança erro personalizado para ser exibido no componente
        throw new Error(apiDetail || apiMessage || "Erro desconhecido ao cadastrar reunião");
    }
};
