import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act } from "react";
import { ProductosPublic } from "./ProductosPublic";
import type { Producto, Categoria } from "../types";

vi.spyOn(console, "error").mockImplementation(() => {});

// ✅ Mock de fetch
const mockFetch = vi.spyOn(globalThis, "fetch");

// ✅ Datos simulados
const mockProductos: Producto[] = [
  {
    id: 1,
    nombre: "Camiseta LevelUp",
    categoria: "Ropa",
    stock: 10,
    precio: 12990,
    imagenes: ["camiseta.jpg"],
    descripcion: "Camiseta oficial de LevelUp",
  },
  {
    id: 2,
    nombre: "Mouse Gamer",
    categoria: "Tecnología",
    stock: 5,
    precio: 19990,
    imagenes: ["mouse.jpg"],
    descripcion: "Mouse ergonómico con luces RGB",
  },
];

const mockCategorias: Categoria[] = [
  { id: 1, nombre: "Ropa" },
  { id: 2, nombre: "Tecnología" },
];

describe("ProductosPublic", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });


  it("carga y muestra productos correctamente", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategorias,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProductos,
      } as Response);

    await act(async () => {
      render(<ProductosPublic />);
    });

    await waitFor(() => {
      expect(screen.getByText("Camiseta LevelUp")).toBeInTheDocument();
      expect(screen.getByText("Mouse Gamer")).toBeInTheDocument();
    });
  });

  it("muestra mensaje de error si falla la carga de categorías", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    } as Response);

    await act(async () => {
      render(<ProductosPublic />);
    });

    await waitFor(() => {
      expect(
        screen.getByText(/No se pudieron cargar las categorías/i)
      ).toBeInTheDocument();
    });
  });

  it("muestra mensaje si no hay productos en una categoría", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategorias,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProductos,
      } as Response);

    await act(async () => {
      render(<ProductosPublic />);
    });

    await waitFor(() => {
      expect(screen.getByText("Camiseta LevelUp")).toBeInTheDocument();
    });

    localStorage.setItem("productos", JSON.stringify([]));
    window.dispatchEvent(new StorageEvent("storage", { key: "productos" }));

    await waitFor(() => {
      expect(
        screen.getByText(/No hay productos en esta categoría/i)
      ).toBeInTheDocument();
    });
  });

  it("usa productos guardados en localStorage si existen", async () => {
    localStorage.setItem("productos", JSON.stringify(mockProductos));

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategorias,
    } as Response);

    await act(async () => {
      render(<ProductosPublic />);
    });

    await waitFor(() => {
      expect(screen.getByText("Camiseta LevelUp")).toBeInTheDocument();
      expect(screen.getByText("Mouse Gamer")).toBeInTheDocument();
    });
  });
});
