import { getRoomColor } from "@/utils/roomStyles";
import "./styles/RoomLegend.css";

const ROOMS = ["APOIO", "CIEGES", "SALA WEB"];

const ROOM_LABEL: Record<string, string> = {
  APOIO: "Apoio",
  CIEGES: "CIEGES",
  "SALA WEB": "Sala Web",
};

type MonthNav = {
  label: string;
  onPrev: () => void;
  onNext: () => void;
};

type RoomLegendProps = {
  selectedRoom: string | null;
  onToggle: (room: string) => void;
  monthNav?: MonthNav; // Só passado na visão mensal — navegação de mês mora aqui pra liberar altura nas células
};

export default function RoomLegend({ selectedRoom, onToggle, monthNav }: RoomLegendProps) {
  return (
    <div className="room-legend">
      <div className="room-legend-rooms">
        {ROOMS.map((room) => {
          const isSelected = selectedRoom === room;
          const isDimmed = selectedRoom !== null && !isSelected;

          return (
            <button
              type="button"
              key={room}
              className={`room-legend-item${isSelected ? " selected" : ""}${isDimmed ? " dimmed" : ""}`}
              onClick={() => onToggle(room)}
              aria-pressed={isSelected}
              title={
                isSelected
                  ? `Mostrando só ${ROOM_LABEL[room]} — clique para ver todas as salas`
                  : `Mostrar só reuniões da ${ROOM_LABEL[room]}`
              }
            >
              <span
                className="room-legend-dot"
                style={{ backgroundColor: getRoomColor(room) }}
              />
              {ROOM_LABEL[room]}
            </button>
          );
        })}
      </div>

      {monthNav && (
        <div className="room-legend-month-nav">
          <button
            type="button"
            onClick={monthNav.onPrev}
            aria-label="Mês anterior"
          >
            ◀
          </button>
          <span className="room-legend-month-label">{monthNav.label}</span>
          <button
            type="button"
            onClick={monthNav.onNext}
            aria-label="Próximo mês"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
