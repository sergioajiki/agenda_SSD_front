export interface User{
    id?: string;
    name: string;
    email: string;
    password: string;
    matricula?: string;
    role: "ADMIN" | "USER";
}

// Cadastro pelo admin não manda mais senha — o back gera uma temporária
// (ver UserCreatedResponse) e o usuário troca no primeiro login.
export interface UserRequest {
    name: string;
    email: string;
    matricula?: string;
    role: "ADMIN" | "USER";
}

export interface UserResponse {
    id: string;
    name: string;
    email: string;
    matricula?: string;
    role: "ADMIN" | "USER";
    enabled: boolean;
}

// Resposta do cadastro — única vez que a senha temporária aparece em texto
// puro, pro admin copiar e repassar ao usuário.
export interface UserCreatedResponse {
    id: string;
    name: string;
    email: string;
    temporaryPassword: string;
}

// Dados editáveis pela tela de gestão de acessos (admin) — sem senha, essa
// tela não troca senha de ninguém.
export interface UserUpdateRequest {
    name: string;
    email: string;
    matricula?: string;
    role: "ADMIN" | "USER";
}

// Autoatendimento: o próprio usuário troca nome/email da sua conta —
// diferente do UserUpdateRequest (admin em terceiros), exige a senha atual.
export interface SelfProfileUpdateRequest {
    name: string;
    email: string;
    currentPassword: string;
}

// Autoatendimento: troca de senha, também exige a senha atual.
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
