/** Gera intervalos de 30 minutos (00:00 → 23:30) */
export const generateHours = () =>
  Array.from({ length: 48 }, (_, i) => {
    const h = Math.floor(i / 2).toString().padStart(2, "0");
    const m = i % 2 === 0 ? "00" : "30";
    return `${h}:${m}`;
  });