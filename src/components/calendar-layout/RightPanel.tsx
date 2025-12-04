"use client";

import MeetingCard from "@/components/MeetingCard";

import "./RightPanel.css"

type Props = {
  selectedDate: string;
  selectedMeetings: any[];
  userId: number | undefined;
  onDelete: (id: number) => void;
  onEdit: (m: any) => void;
};

export default function RightPanel({
  selectedDate,
  selectedMeetings,
  userId,
  onDelete,
  onEdit
}: Props) {
  return (
    <>
      <h3>Reuniões de {selectedDate.split("-").reverse().join("/")}</h3>

      <div className="meeting-cards-grid">
        {selectedMeetings.length > 0 ? (
          selectedMeetings.map((m) => (
            <MeetingCard key={m.id} meeting={m} userId={userId} onDelete={onDelete} onEdit={onEdit} />
          ))
        ) : (
          <p>📅 Sem reuniões para esta data.</p>
        )}
      </div>
    </>
  );
}
