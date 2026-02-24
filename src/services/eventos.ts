import { apiFetch } from "./api";

export function getEventos() {
  return apiFetch("/eventos");
}

export function createEvento(data: any) {
  return apiFetch("/eventos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateEvento(id: number, data: any) {
  return apiFetch(`/eventos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteEvento(id: number) {
  return apiFetch(`/eventos/${id}`, {
    method: "DELETE",
  });
}
