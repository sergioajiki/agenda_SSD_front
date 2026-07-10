import { LoginResponse } from "@/models/Auth";

const AUTH_STORAGE_KEY = "agenda_ssd_auth";

/** Lê a sessão salva no navegador (sobrevive a um F5), ou null se não houver/estiver corrompida. */
export function getStoredAuth(): LoginResponse | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as LoginResponse;
  } catch {
    return null;
  }
}

export function setStoredAuth(auth: LoginResponse): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
