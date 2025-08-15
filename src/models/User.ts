export interface User{
    name: string;
    email: string;
    password: string;
    matricula: string;
    role: "ADMIN" | "USER";
}