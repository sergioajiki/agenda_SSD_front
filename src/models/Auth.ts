export type LoginResponse = {
  id: number;       // Identificador único do usuário
  name: string;     // Nome completo do usuário
  email: string;    // Endereço de e-mail cadastrado
  role: "ADMIN" | "USER";     // Função (ex: ADMIN, USER, etc.)
  token: string;    // Token JWT — reenviado em "Authorization: Bearer <token>" nas chamadas seguintes
  mustChangePassword: boolean; // Se true, o front deve forçar a troca de senha antes de liberar o resto do app
};

export type LoginRequest = {
  email: string;    // E-mail do usuário
  password: string; // Senha em texto (transmitida via HTTPS)
};
