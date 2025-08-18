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