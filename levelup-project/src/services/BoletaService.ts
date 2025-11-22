import { apiFetch } from "./api";

export const crearBoleta = (data: any) => {
  return apiFetch("/boletas", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getBoletas = () => {
  return apiFetch("/boletas");
};

export const getBoleta = (id: number) => {
  return apiFetch(`/boletas/${id}`);
};
