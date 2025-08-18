"use client";

import { MeetingRequest, MeetingResponse } from "@/models/Meetings";
import { createMeeting } from "@/services/meetingService";
import { formatDateToDDMMYYYY, formatDateToYYYYMMDD } from "@/utils/Utils";
import { ChangeEvent, FormEvent, useState } from "react";

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
            const payload: MeetingRequest = {
                title: formData.title,
                meetingDate: formatDateToYYYYMMDD(new Date(formData.meetingDate)),
                timeStart: formData.timeStart,
                timeEnd: formData.timeEnd,
                meetingRoom: formData.meetingRoom,
                userId: formData.userId
            };

            const meetingCreated: MeetingResponse = await createMeeting(payload);

            setMessage(`✅ Reunião ${meetingCreated.id} cadastrada com sucesso!`);
            setIsError(false);
            setFormData({
                title: "",
                meetingDate: "",
                timeStart: "",
                timeEnd: "",
                meetingRoom: "",
                userId: "",
            });

        } catch (error: any) {
            setMessage(error.message || "Erro ao enviar o formulário");
            setIsError(true);
        }
    };
    
    return (
        <div>
            <h1>Cadastro de Reunião</h1>
            <br />
            <form onSubmit={handleSubmit}>
                Título da Reunião:
                <input
                    type="text"
                    name="title"
                    placeholder="Título da reunião"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <br />
                Data da Reunião:
                <input
                    type="text"
                    name="meetingDate"
                    placeholder="Data (dd-MM-yyyy)"
                    value={formData.meetingDate}
                    onChange={handleChange}
                    required
                />
                <br />
                Horário Início:
                <input
                    type="time"
                    name="timeStart"
                    value={formData.timeStart}
                    onChange={handleChange}
                    required
                />
                <br />
                Horário Fim:
                <input
                    type="time"
                    name="timeEnd"
                    value={formData.timeEnd}
                    onChange={handleChange}
                    required
                />
                <br />
                Sala da Reunião:
                <input
                    type="text"
                    name="meetingRoom"
                    placeholder="Sala da reunião"
                    value={formData.meetingRoom}
                    onChange={handleChange}
                    required
                />
                <br />
                ID do Responsável:
                <input
                    type="number"
                    name="userId"
                    placeholder="ID do responsável"
                    value={formData.userId}
                    onChange={handleChange}
                    required
                />
                <br />
                <button type="submit">Cadastrar</button>
            </form>

            {message && (
                <p style={{ color: isError ? "red" : "green" }}>{message}</p>
            )}
        </div>
    );


}