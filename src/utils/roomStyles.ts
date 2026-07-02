/**
 * Mapeamento central de sala -> classes CSS.
 * Adicionar uma nova sala exige apenas uma entrada aqui (e a cor correspondente no CSS).
 */
const ROOM_BORDER_CLASS: Record<string, string> = {
  APOIO: "apoio-border",
  CIEGES: "cieges-border",
  "SALA WEB": "web-border",
};

const ROOM_CELL_CLASS: Record<string, string> = {
  APOIO: "apoio-room",
  CIEGES: "cieges-room",
  "SALA WEB": "web-room",
};

/** Classe de borda para um card de reunião (uma única sala). */
export function getRoomBorderClass(room: string): string {
  return ROOM_BORDER_CLASS[room] ?? "mixed-border";
}

/**
 * Classe de fundo/borda para uma célula do calendário (mensal/semanal) que pode
 * conter reuniões de mais de uma sala no mesmo dia/horário.
 */
export function getCellRoomClass(rooms: string[]): string {
  const distinctRooms = Array.from(new Set(rooms));
  if (distinctRooms.length === 0) return "";
  if (distinctRooms.length > 1) return "mixed-room";
  return ROOM_CELL_CLASS[distinctRooms[0]] ?? "mixed-room";
}
