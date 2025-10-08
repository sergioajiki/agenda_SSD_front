"use client";

import { MeetingResponse } from "@/models/Meetings";
import { getMeetings } from "@/services/meetingService";
import { useCallback, useEffect, useState } from "react";
import "./styles/MonthlyCalendar.css";


export default function MonthlyCalendar() {
    const [meetings, setMeetings] = useState<MeetingResponse[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();


    const fetchMeetings = useCallback(async () => {
        try {
            const data = await getMeetings();
            setMeetings(data);
        } catch (error) {
            console.error("Erro ao carregar reuiniões", error)
        }
    }, []);

    useEffect(() => {
        fetchMeetings();
    }, [fetchMeetings, currentDate]); // recarrega sempre que mudar o mês

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); // domingo = 0

    const getMeetingsForDay = (day: number) => {
        const dateStr = new Date(year, month, day).toISOString().split("T")[0]; // yyyy-MM-dd
        return meetings.filter(m => m.meetingDate === dateStr);
    }

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={handlePrevMonth}>◀</button>
                <h2>
                    {currentDate.toLocaleString("pt-BR", { month: "long", year: "numeric" })}
                </h2>
                <button onClick={handleNextMonth}>▶</button>
            </div>

            <div className="calendar-grid">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                    <div key={d} className="calendar-day-header">{d}</div>
                ))}

                {/* espaços antes do 1º dia */}
                {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="calendar-cell empty"></div>
                ))}

                {/* dias */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dailyMeetings = getMeetingsForDay(day);
                    return (
                        <div key={day} className="calendar-cell">
                            <div className="calendar-day-number">{day}</div>
                            <ul className="meeting-list">
                                {dailyMeetings.map((m) => (
                                    <li key={m.id} className="meeting-item">
                                        {m.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}