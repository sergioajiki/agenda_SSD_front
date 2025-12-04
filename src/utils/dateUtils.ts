/**
 * Utilitários de data usados pela aplicação.
 * - Normalização/parse
 * - Formatação (dd-MM-yyyy / yyyy-MM-dd)
 * - Operações de calendário (startOfWeek, addDays, ymd, combine)
 * - Geração de intervalos de horário (generateHours)
 *
 * Este arquivo substitui versões fragmentadas que causavam inconsistência.
 */

/** Normaliza data trocando delimitadores e removendo duplicidade de hífens */
export function normalizeDateString(dateStr: string): string {
  return dateStr.replace(/[\/\.]+/g, "-").replace(/-+/g, "-").trim();
}

/** Formatação genérica (retorna string) */
export function formatDate(
  date: Date,
  format: "dd-MM-yyyy" | "yyyy-MM-dd"
): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear().toString();

  return format.replace("dd", day).replace("MM", month).replace("yyyy", year);
}

/** dd-MM-yyyy */
export const formatDateToDDMMYYYY = (d: Date): string =>
  formatDate(d, "dd-MM-yyyy");

/** yyyy-MM-dd */
export const formatDateToYYYYMMDD = (d: Date): string =>
  formatDate(d, "yyyy-MM-dd");

/**
 * Parse robusto:
 * Aceita:
 *  - dd-MM-yyyy
 *  - dd/MM/yyyy
 *  - yyyy-MM-dd
 *  - yyyy/MM/dd
 *
 * Valida dia/mês/ano e checa se o Date resultante é válido.
 */
export function parseDateString(value: string): Date {
  if (!value || typeof value !== "string") {
    throw new Error("Data inválida: valor vazio.");
  }

  const normalized = normalizeDateString(value);

  // Detecta formato yyyy-MM-dd (começa com 4 dígitos)
  const parts = normalized.split("-").map((p) => p.trim());
  if (parts.length !== 3) throw new Error("Data inválida: formato esperado.");

  // Se vier como yyyy-MM-dd
  if (/^\d{4}$/.test(parts[0])) {
    const [yearStr, monthStr, dayStr] = parts;
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);

    validateDateParts(day, month, year);

    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) throw new Error("Data inválida.");
    return date;
  }

  // Caso contrário assume dd-MM-yyyy
  const [dayStr, monthStr, yearStr] = parts;
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  validateDateParts(day, month, year);

  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) throw new Error("Data inválida.");
  return date;
}

/** Função auxiliar de validação de partes da data */
function validateDateParts(day: number, month: number, year: number) {
  if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) {
    throw new Error("Data inválida: contém valores não numéricos.");
  }
  if (year < 1000 || year > 9999) throw new Error("Ano inválido.");
  if (month < 1 || month > 12) throw new Error("Mês inválido (1-12).");
  if (day < 1 || day > 31) throw new Error("Dia inválido (1-31).");
  // validação adicional simples (feita pelo Date mais abaixo)
}

/** Retorna início da semana (domingo) com horário zerado */
export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Soma dias e retorna nova Date */
export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** yyyy-MM-dd (zero pad) */
export function ymd(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

/** Junta data (yyyy-MM-dd) + hora (HH:mm) em objeto Date */
export function combineYmdAndHHmm(dateStr: string, hhmm: string): Date {
  const dateParts = dateStr.split("-").map(Number);
  if (dateParts.length !== 3) throw new Error("Data inválida para combinar.");
  const [Y, M, D] = dateParts;
  const [h = 0, m = 0] = (hhmm || "0:0").split(":").map(Number);
  const dt = new Date(Y, M - 1, D, h, m, 0, 0);
  if (isNaN(dt.getTime())) throw new Error("Combinação de data/hora inválida.");
  return dt;
}

/** Formato brasileiro dd/mm/yyyy */
export const formatBR = (d: Date): string =>
  d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

/** Gera intervalos de 30 minutos (00:00 → 23:30) */
export function generateHours(): string[] {
  return Array.from({ length: 48 }, (_, i) => {
    const h = Math.floor(i / 2).toString().padStart(2, "0");
    const m = i % 2 === 0 ? "00" : "30";
    return `${h}:${m}`;
  });
}
