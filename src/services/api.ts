import axios from "axios";
import { clearStoredAuth, getStoredAuth } from "@/utils/authStorage";

// Resolve a URL do backend sem depender de um valor fixo gravado no build.
// Por padrão, usa o mesmo host que o navegador usou pra acessar o front,
// trocando só a porta (3000 -> 8080) — assim o mesmo build funciona em
// qualquer IP (localhost, Wi-Fi, cabo) sem precisar rebuildar quando o IP
// muda. NEXT_PUBLIC_API_URL continua valendo como override explícito, pra
// quando back e front não estão no mesmo host.
function resolveBaseURL(): string {
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    if (typeof window !== "undefined") {
        return `http://${window.location.hostname}:8080`;
    }
    return "http://localhost:8080";
}

const api = axios.create({
    baseURL: resolveBaseURL(),
});

// Anexa o token salvo em toda chamada — o back agora exige
// "Authorization: Bearer <token>" pra criar/editar/excluir reunião, cadastrar
// usuário e ver logs. Consultar a agenda (GET) continua público, então enviar
// o header nessas chamadas também não tem problema.
api.interceptors.request.use((config) => {
    const auth = getStoredAuth();
    if (auth?.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
});

// Se o back responder 401, o token salvo não serve mais (expirou, foi revogado
// etc.) — limpa a sessão local e avisa o resto do app pra deslogar de verdade,
// em vez de deixar o usuário martelando uma ação que nunca vai funcionar.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearStoredAuth();
            window.dispatchEvent(new Event("auth:unauthorized"));
        }
        return Promise.reject(error);
    }
);

export default api;
