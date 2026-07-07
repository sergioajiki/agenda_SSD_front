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

/** Cor sólida de cada sala — usada em elementos que não podem depender de classe CSS (ex.: bolinha da legenda). */
const ROOM_COLOR: Record<string, string> = {
  APOIO: "#dc2626",
  CIEGES: "#2563eb",
  "SALA WEB": "#0d9488",
};

/** Classe de borda para um card de reunião (uma única sala). */
export function getRoomBorderClass(room: string): string {
  return ROOM_BORDER_CLASS[room] ?? "mixed-border";
}

/** Cor sólida para a sala (bolinha de legenda, cartões). */
export function getRoomColor(room: string): string {
  return ROOM_COLOR[room] ?? "#6f42c1";
}

/**
 * Combinações conhecidas de salas -> classe de mistura específica.
 * A chave é a lista de salas (reconhecidas) ordenada e unida por "+".
 */
const MIXED_CELL_CLASS: Record<string, string> = {
  "APOIO+CIEGES": "mixed-apoio-cieges",
  "APOIO+SALA WEB": "mixed-apoio-web",
  "CIEGES+SALA WEB": "mixed-cieges-web",
  "APOIO+CIEGES+SALA WEB": "mixed-all",
};

/**
 * Classe de fundo/borda para uma célula do calendário (mensal/semanal) que pode
 * conter reuniões de mais de uma sala no mesmo dia/horário.
 */
export function getCellRoomClass(rooms: string[]): string {
  const distinctRooms = Array.from(new Set(rooms));
  if (distinctRooms.length === 0) return "";
  if (distinctRooms.length > 1) {
    const knownRooms = distinctRooms.filter((room) => room in ROOM_CELL_CLASS);
    const key = knownRooms.sort().join("+");
    return MIXED_CELL_CLASS[key] ?? "mixed-room";
  }
  return ROOM_CELL_CLASS[distinctRooms[0]] ?? "mixed-room";
}
