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

            throw new Error(apiDetail || apiMessage || "Erro desconhecido ao cadastrar reunião");
        }

        // fallback para erros que não são do Axios
        if (error instanceof Error) {
            throw new Error(error.message || "Erro inesperado ao cadastrar reunião");
        }

        throw new Error("Erro desconhecido ao cadastrar reunião");
    }


};

export const getMeetings = async (): Promise<MeetingResponse[]> => {
    try {
        const response = await api.get<MeetingResponse[]>('/api/meeting');
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            const apiDetail = error.response?.data?.detail;
            const apiMessage = error.response?.data?.message;

            throw new Error(apiDetail || apiMessage || "Erro desconhecido ao carregar reuniões");
        }

        if (error instanceof Error) {
            throw new Error(error.message || "Erro inesperado ao carregar reuniões");
        }

        throw new Error("Erro desconhecido ao carregar reuniões");
    }
};

/**
 * Exclui uma reunião existente.
 * O back identifica quem está chamando pelo token (Authorization: Bearer),
 * anexado automaticamente pelo interceptor em services/api.ts — não precisa
 * mais informar o usuário na chamada.
 * @param id ID da reunião
 */
export const deleteMeeting = async (id: number): Promise<void> => {
    try {
        await api.delete(`/api/meeting/${id}`);
    } catch (error: unknown) {
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            const apiDetail = error.response?.data?.detail;
            const apiMessage = error.response?.data?.message;

            throw new Error(apiDetail || apiMessage || "Erro desconhecido ao excluir reunião");
        }

        if (error instanceof Error) {
            throw new Error(error.message || "Erro inesperado ao excluir reunião");
        }

        throw new Error("Erro desconhecido ao excluir reunião");
    }
};

/**
 * Atualiza uma reunião existente.
 * A verificação de permissão (dono ou ADMIN) é feita no back a partir do
 * usuário autenticado pelo token, não mais por um parâmetro enviado aqui.
 * @param id ID da reunião a ser atualizada
 * @param meeting Dados atualizados da reunião
 */
export const updateMeeting = async (
  id: number,
  meeting: MeetingRequest
): Promise<MeetingResponse> => {
  try {
    const response = await api.put<MeetingResponse>(`/api/meeting/${id}`, meeting);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const apiDetail = error.response?.data?.detail;
      const apiMessage = error.response?.data?.message;

      throw new Error(apiDetail || apiMessage || "Erro desconhecido ao atualizar reunião");
    }

    if (error instanceof Error) {
      throw new Error(error.message || "Erro inesperado ao atualizar reunião");
    }

    throw new Error("Erro desconhecido ao atualizar reunião");
  }
};
