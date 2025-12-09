export interface User{
    id?: string;
    name: string;
    email: string;
    password: string;
    matricula: string;
    role: "ADMIN" | "USER";
}

export interface UserRequest {
    name: string;
    email: string;
    password: string;
    matricula: string;
    role: "ADMIN" | "USER";
}

export interface UserResponse {
    id: string;
    name: string;
    email: string;
    matricula: string;
    role: "ADMIN" | "USER";
}
