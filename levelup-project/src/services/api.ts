// src/services/api.ts
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9090/api/v1";

const TOKEN_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || "levelup_token";

/**
 * Envuelve fetch y:
 * - Prepara la URL completa (base + path)
 * - Agrega el header Authorization si hay JWT
 * - Lanza error si la respuesta no es ok
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
