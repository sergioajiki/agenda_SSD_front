"use client";

import MeetingCard from "@/components/MeetingCard";

import "./RightPanel.css"

type Props = {
  selectedDate: string;
  selectedMeetings: any[];
  userId: number | undefined;
  userRole?: string | undefined;    // <-- ADICIONADO
  onDelete: (id: number) => void;
  onEdit: (m: any) => void;
};

export default function RightPanel({
  selectedDate,
  selectedMeetings,
  userId,
  userRole,
  onDelete,
  onEdit
}: Props) {
  /* Ordena por horário de início, do mais cedo pro mais tarde */
  const sortedMeetings = [...selectedMeetings].sort((a, b) =>
    a.timeStart.localeCompare(b.timeStart)
  );

  return (
    <>
      <h3>Reuniões de {selectedDate.split("-").reverse().join("/")}</h3>

      <div className="meeting-cards-grid">
        {sortedMeetings.length > 0 ? (
          sortedMeetings.map((m) => (
            <MeetingCard 
              key={m.id} 
              meeting={m} 
              userId={userId} 
              userRole={userRole}   // <-- PASSANDO ADMIN
              onDelete={onDelete} 
              onEdit={onEdit} 
            />
          ))
        ) : (
          <p>📅 Sem reuniões para esta data.</p>
        )}
      </div>
    </>
  );
}
