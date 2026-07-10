import axios from "axios";
import { clearStoredAuth, getStoredAuth } from "@/utils/authStorage";

const api=axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    //baseURL: "http://10.26.57.174:8080",
    //baseURL: "http://localhost:8080",
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
