import { apiFetch } from "./api";

export const obtenerUsuarioPorId = async (id: number) => {
  return await apiFetch(`/usuarios/${id}`, {
    method: "GET",
  });
};
