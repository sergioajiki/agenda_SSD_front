export type LoginResponse = {
  id: number;       // Identificador único do usuário
  name: string;     // Nome completo do usuário
  email: string;    // Endereço de e-mail cadastrado
  role: "ADMIN" | "USER";     // Função (ex: ADMIN, USER, etc.)
};

export type LoginRequest = {
  email: string;    // E-mail do usuário
  password: string; // Senha em texto (transmitida via HTTPS)
};
