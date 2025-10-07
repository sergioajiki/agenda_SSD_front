"use client";

import { ApiErrorResponse } from "@/models/ApiErrorResponse";
import { MeetingRequest, MeetingResponse } from "@/models/Meetings";
import { createMeeting, getMeetings } from "@/services/meetingService";
import { formatDateToYYYYMMDD, parseDDMMYYYYtoDate } from "@/utils/Utils";
import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import "./styles/MeetingForm.css";

export default function MeetingForm() {
    const [formData, setFormData] = useState({
        title: "",
        meetingDate: "", // exibido dd-MM-yyyy
        timeStart: "",
        timeEnd: "",
        meetingRoom: "",
        userId: ""
    });

    const [message, setMessage] = useState<string>("");
    const [isError, setIsError] = useState<boolean>(false);
    const [meetings, setMeetings] = useState<MeetingResponse[]>([]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const parsedDate = parseDDMMYYYYtoDate(formData.meetingDate);
            const payload: MeetingRequest = {
                title: formData.title,
                meetingDate: formatDateToYYYYMMDD(parsedDate),
                timeStart: formData.timeStart,
                timeEnd: formData.timeEnd,
                meetingRoom: formData.meetingRoom,
                userId: formData.userId
            };

            const meetingCreated: MeetingResponse = await createMeeting(payload);

            setMessage(`✅ Reunião ${meetingCreated.id} cadastrada com sucesso!`);
            setIsError(false);

            // limpa formulário
            setFormData({
                title: "",
                meetingDate: "",
                timeStart: "",
                timeEnd: "",
                meetingRoom: "",
                userId: "",
            });

            // Atualiza lista automaticamente
            const updatedMeetings = await getMeetings();
            setMeetings(updatedMeetings);

        } catch (error: unknown) {
            let errorMessage = "Erro ao enviar o formulário";

            if (axios.isAxiosError<ApiErrorResponse>(error)) {
                errorMessage =
                    error.response?.data?.detail ||
                    error.response?.data?.message ||
                    error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setMessage(errorMessage);
            setIsError(true);
        }
    };

    return (
        <div className="meeting-form-container">
            <h3>Cadastro de Reunião</h3>
            <form className="meeting-form" onSubmit={handleSubmit}>
                <label htmlFor="title">Título da Reunião:</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Título da reunião"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="meetingDate">Data da Reunião:</label>
                <input
                    type="text"
                    name="meetingDate"
                    id="meetingDate"
                    placeholder="Data (dd-MM-yyyy)"
                    value={formData.meetingDate}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="timeStart">Horário Início:</label>
                <input
                    type="time"
                    name="timeStart"
                    id="timeStart"
                    value={formData.timeStart}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="timeEnd">Horário Fim:</label>
                <input
                    type="time"
                    name="timeEnd"
                    id="timeEnd"
                    value={formData.timeEnd}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="meetingRoom">Sala da Reunião:</label>
                <input
                    type="text"
                    name="meetingRoom"
                    id="meetingRoom"
                    placeholder="Sala da reunião"
                    value={formData.meetingRoom}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="userId">ID do Responsável:</label>
                <input
                    type="number"
                    name="userId"
                    id="userId"
                    placeholder="ID do responsável"
                    value={formData.userId}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Cadastrar</button>
            </form>

            {message && (
                <p className={`meeting-form-message ${isError ? "error" : "success"}`}>
                    {message}
                </p>
            )}
        </div>
    );
}
