export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9090/api/v1";

const TOKEN_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || "levelup_token";

/**
 * Función general para llamadas autenticadas con JWT
 */
export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Error HTTP ${response.status}`);
  }

  // 204 No Content
  if (response.status === 204) return null as T;

  return (await response.json()) as T;
}

/**
 * Función específica para login con sesión (JSESSIONID)
 */
export async function login(data: { correo: string; contrasena: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include", // <- envía la cookie de sesión
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Error HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Función para logout si tu backend soporta cerrar sesión
 */
export async function logout() {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Error HTTP ${response.status}`);
  }

  return response.json();
}
