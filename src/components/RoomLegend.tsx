import { getRoomColor } from "@/utils/roomStyles";
import "./styles/RoomLegend.css";

const ROOMS = ["APOIO", "CIEGES", "SALA WEB"];

const ROOM_LABEL: Record<string, string> = {
  APOIO: "Apoio",
  CIEGES: "CIEGES",
  "SALA WEB": "Sala Web",
};

export default function RoomLegend() {
  return (
    <div className="room-legend">
      {ROOMS.map((room) => (
        <span className="room-legend-item" key={room}>
          <span
            className="room-legend-dot"
            style={{ backgroundColor: getRoomColor(room) }}
          />
          {ROOM_LABEL[room]}
        </span>
      ))}
    </div>
  );
}
