import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, it, expect, vi } from "vitest";
import { DashboardAdmin } from "./DashboardAdmin"; // export nombrado

/**
 * Importante:
 * - No definas aquí mocks de 'recharts'. El mock global vive en vitest.setup.ts.
 * - Este archivo asume que 'Dashboard de Rendimiento' existe como <h1> en el componente.
 */

type Item = { id: number | string; nombre: string; quantity: number };
type Orden = {
  id: number | string;
  fecha: string;
  total: number;
  items: Item[];
};

const STORAGE_KEY = "ordenes_compra";

const mockOrdenes: Orden[] = [
  {
    id: 1,
    fecha: "2025-10-26T10:00:00Z",
    total: 100,
    items: [
      { id: 1, nombre: "Producto A", quantity: 2 },
      { id: 2, nombre: "Producto B", quantity: 1 },
    ],
  },
  {
    id: 2,
    fecha: "2025-10-25T12:30:00Z",
    total: 50,
    items: [{ id: 2, nombre: "Producto B", quantity: 1 }],
  },
];

function renderDashboard() {
  return render(
    <MemoryRouter>
      <DashboardAdmin />
    </MemoryRouter>
  );
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.clearAllMocks(); // no restaura mocks de módulos, solo llamadas
});

describe("DashboardAdmin", () => {
  it("debería mostrar un spinner de carga inicialmente y luego ocultarlo", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockOrdenes));
    renderDashboard();

    // spinner visible en primer render
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

    // desaparece cuando se carga
    await waitFor(() =>
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument()
    );

    // presenta el heading del dashboard
    expect(
      await screen.findByRole("heading", { name: /dashboard de rendimiento/i })
    ).toBeInTheDocument();
  });

  it("debería calcular y mostrar los ingresos totales, órdenes y valor promedio", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockOrdenes));
    renderDashboard();

    await waitFor(() => {
      const ingresosCard = screen
        .getByText("Ingresos Totales")
        .closest(".card")!;
      // tolerante a espacios/locale
      expect(ingresosCard).toHaveTextContent(/\$\s?150\b/);

      const ordenesCard = screen.getByText("Órdenes Totales").closest(".card")!;
      expect(ordenesCard).toHaveTextContent("2");

      const valorPromedioCard = screen
        .getByText("Valor Promedio Orden")
        .closest(".card")!;
      expect(valorPromedioCard).toHaveTextContent(/\$\s?75\b/);
    });
  });

  it("debería mostrar 0 para todas las métricas cuando no hay órdenes", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    renderDashboard();

    await waitFor(() => {
      const ingresosCard = screen
        .getByText("Ingresos Totales")
        .closest(".card")!;
      expect(ingresosCard).toHaveTextContent(/\$\s?0\b/);

      const ordenesCard = screen.getByText("Órdenes Totales").closest(".card")!;
      expect(ordenesCard).toHaveTextContent("0");

      const valorPromedioCard = screen
        .getByText("Valor Promedio Orden")
        .closest(".card")!;
      expect(valorPromedioCard).toHaveTextContent(/\$\s?0\b/);
    });
  });

  it("debería calcular y mostrar el top 5 de productos", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockOrdenes));
    renderDashboard();

    await waitFor(() => {
      const productBRow = screen.getByText("Producto B").closest("tr")!;
      expect(productBRow).toHaveTextContent("2"); // 1 + 1

      const productARow = screen.getByText("Producto A").closest("tr")!;
      expect(productARow).toHaveTextContent("2"); // 2
    });
  });

  it("debería mostrar un mensaje cuando no hay productos top", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    renderDashboard();

    await waitFor(() => {
      expect(
        screen.getByText("No hay datos de productos vendidos.")
      ).toBeInTheDocument();
    });
  });

  it("debería renderizar el gráfico de ventas por día", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockOrdenes));
    renderDashboard();

    await waitFor(() => {
      // El mock global de recharts pone data-testid="bar-chart"
      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    });
  });

  it("debería mostrar un mensaje cuando no hay datos de ventas para el gráfico", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    renderDashboard();

    await waitFor(() => {
      expect(
        screen.getByText("No hay suficientes datos para mostrar el gráfico.")
      ).toBeInTheDocument();
    });
  });
});
