/**
 * Normaliza uma string de data, convertendo delimitadores
 * como "/", "." ou múltiplos hífens para um formato padrão "dd-MM-yyyy".
 */
function normalizeDateString(dateStr: string): string {
    return dateStr
        .replace(/[\/\.]+/g, "-") // troca "/" e "." por "-"
        .replace(/-+/g, "-")       // evita múltiplos hífens seguidos
        .trim();
}

/**
 * Função genérica para formatar datas.
 * Aceita formatos "dd-MM-yyyy" ou "yyyy-MM-dd".
 */
function formatDate(date: Date, format: "dd-MM-yyyy" | "yyyy-MM-dd"): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return format
        .replace("dd", day)
        .replace("MM", month)
        .replace("yyyy", String(year));
}

/** 
 * Formata a data no padrão dd-MM-yyyy 
 * (usado para exibir no formulário e no MeetingCard)
 */
export const formatDateToDDMMYYYY = (date: Date): string =>
    formatDate(date, "dd-MM-yyyy");

/**
 * Formata a data no padrão yyyy-MM-dd
 * (usado para enviar ao backend)
 */
export const formatDateToYYYYMMDD = (date: Date): string =>
    formatDate(date, "yyyy-MM-dd");


/**
 * Converte uma string dd-MM-yyyy ou dd/MM/yyyy em objeto Date.
 * Exemplo: "02-09-2025" -> new Date(2025, 8, 2)
 */
export function parseDDMMYYYYtoDate(dateStr: string): Date {
    // Normaliza delimitadores
    const normalized = normalizeDateString(dateStr);

    // Divide em partes
    const [day, month, year] = normalized.split("-").map(Number);

    // Validações essenciais
    if (!day || !month || !year) {
        throw new Error("Data inválida: formato esperado dd-MM-yyyy.");
    }
    if (day < 1 || day > 31) {
        throw new Error("Dia inválido (1-31).");
    }
    if (month < 1 || month > 12) {
        throw new Error("Mês inválido (1-12).");
    }
    if (year < 1000) {
        throw new Error("Ano inválido.");
    }

    const date = new Date(year, month - 1, day);

    // Validação final do objeto Date
    if (isNaN(date.getTime())) {
        throw new Error("Data inválida.");
    }

    return date;
}
