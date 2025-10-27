import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.tsx';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it("debería renderizar el dashboard de administrador en la ruta correcta", async () => {
    // Preparar
    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <App />
      </MemoryRouter>
    );

    // Actuar y Afirmar
    // Esperar a que el contenido del dashboard aparezca después del estado de carga
    expect(
      await screen.findByText("Dashboard de Rendimiento")
    ).toBeInTheDocument();
  });

  it("debería renderizar la página de No Encontrado para una ruta inexistente", () => {
    // Preparar
    render(
      <MemoryRouter initialEntries={["/some-non-existent-route"]}>
        <App />
      </MemoryRouter>
    );

    // Actuar y Afirmar
    expect(screen.getByText("404 - No Encontrado")).toBeInTheDocument();
    expect(
      screen.queryByText("Dashboard de Rendimiento")
    ).not.toBeInTheDocument();
  });
});
