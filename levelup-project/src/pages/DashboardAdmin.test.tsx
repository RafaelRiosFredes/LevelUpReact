import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { DashboardAdmin } from './DashboardAdmin';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock 'recharts' to prevent errors in JSDOM environment
vi.mock('recharts', async () => {
  const originalModule = await vi.importActual('recharts');
  return {
    ...originalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div className="recharts-responsive-container">{children}</div>
    ),
    BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
    Bar: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    CartesianGrid: () => <div />,
    Tooltip: () => <div />,
    Legend: () => <div />,
  };
});

const mockOrdenes = [
  {
    id: '1',
    fecha: '2025-10-26T10:00:00Z',
    total: 100,
    items: [
      { id: 1, nombre: 'Producto A', quantity: 2 },
      { id: 2, nombre: 'Producto B', quantity: 1 },
    ],
  },
  {
    id: '2',
    fecha: '2025-10-25T12:30:00Z',
    total: 50,
    items: [{ id: 2, nombre: 'Producto B', quantity: 1 }],
  },
];

describe('DashboardAdmin', () => {
  beforeEach(() => {
    // Clear mocks and localStorage before each test
    vi.restoreAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('debería mostrar un spinner de carga inicialmente y luego ocultarlo', async () => {
    localStorage.setItem('ordenes_compra', JSON.stringify(mockOrdenes));
    render(<MemoryRouter><DashboardAdmin /></MemoryRouter>);

    // Check for the spinner on the initial render
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // Wait for the data to load and the spinner to disappear
    await waitFor(() => expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument());
  });

  it('debería calcular y mostrar los ingresos totales, órdenes y valor promedio', async () => {
    localStorage.setItem('ordenes_compra', JSON.stringify(mockOrdenes));
    render(<MemoryRouter><DashboardAdmin /></MemoryRouter>);

    await waitFor(() => {
      const ingresosCard = screen.getByText('Ingresos Totales').closest('.card');
      expect(ingresosCard).toHaveTextContent('$150');

      const ordenesCard = screen.getByText('Órdenes Totales').closest('.card');
      expect(ordenesCard).toHaveTextContent('2');

      const valorPromedioCard = screen.getByText('Valor Promedio Orden').closest('.card');
      expect(valorPromedioCard).toHaveTextContent('$75');
    });
  });

  it('debería mostrar 0 para todas las métricas cuando no hay órdenes', async () => {
    localStorage.setItem('ordenes_compra', JSON.stringify([]));
    render(<MemoryRouter><DashboardAdmin /></MemoryRouter>);

    await waitFor(() => {
      const ingresosCard = screen.getByText('Ingresos Totales').closest('.card');
      expect(ingresosCard).toHaveTextContent('$0');

      const ordenesCard = screen.getByText('Órdenes Totales').closest('.card');
      expect(ordenesCard).toHaveTextContent('0');

      const valorPromedioCard = screen.getByText('Valor Promedio Orden').closest('.card');
      expect(valorPromedioCard).toHaveTextContent('$0');
    });
  });

  it('debería calcular y mostrar el top 5 de productos', async () => {
    localStorage.setItem('ordenes_compra', JSON.stringify(mockOrdenes));
    render(<MemoryRouter><DashboardAdmin /></MemoryRouter>);

    await waitFor(() => {
      const productBRow = screen.getByText('Producto B').closest('tr');
      expect(productBRow).toHaveTextContent('2'); // Producto B has 1 + 1 = 2
      const productARow = screen.getByText('Producto A').closest('tr');
      expect(productARow).toHaveTextContent('2'); // Producto A has 2
    });
  });

  it('debería mostrar un mensaje cuando no hay productos top', async () => {
    localStorage.setItem('ordenes_compra', JSON.stringify([]));
    render(<MemoryRouter><DashboardAdmin /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText('No hay datos de productos vendidos.')).toBeInTheDocument();
    });
  });

  it('debería renderizar el gráfico de ventas por día', async () => {
    localStorage.setItem('ordenes_compra', JSON.stringify(mockOrdenes));
    render(<MemoryRouter><DashboardAdmin /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  it('debería mostrar un mensaje cuando no hay datos de ventas para el gráfico', async () => {
    localStorage.setItem('ordenes_compra', JSON.stringify([]));
    render(<MemoryRouter><DashboardAdmin /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText('No hay suficientes datos para mostrar el gráfico.')).toBeInTheDocument();
    });
  });
});