import "./styles/RoomLegend.css";

const ROOMS = [
  { label: "Apoio", color: "#dc2626" },
  { label: "CIEGES", color: "#2563eb" },
  { label: "Sala Web", color: "#d97706" },
];

export default function RoomLegend() {
  return (
    <div className="room-legend">
      {ROOMS.map((room) => (
        <span className="room-legend-item" key={room.label}>
          <span
            className="room-legend-dot"
            style={{ backgroundColor: room.color }}
          />
          {room.label}
        </span>
      ))}
    </div>
  );
}
