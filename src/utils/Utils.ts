// Função para formatar a data no formato dd-MM-yyyy
export const formatDateToDDMMYYYY = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês é 0-indexado
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

// Função para formatar a data no formato yyyy-MM-dd (para enviar ao backend)
export const formatDateToYYYYMMDD = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês é 0-indexado
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

/**
 * Converte uma string no formato dd-MM-yyyy para um objeto Date.
 * Exemplo: "02-09-2025" -> Date(2025-09-02)
 */
export function parseDDMMYYYYtoDate(dateStr: string): Date {
    // Normaliza delimitadores (substitui / por -)
    const normalized = dateStr.replace(/\//g, "-");
    const [day, month, year] = normalized.split("-").map(Number);

    if (!day || !month || !year || year < 1000) {
        throw new Error("Data inválida: formato esperado dd-MM-yyyy ou dd/MM/yyyy");
    }

    return new Date(year, month - 1, day); // mês começa em 0 no JS
}
