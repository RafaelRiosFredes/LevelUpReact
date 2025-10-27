import { render, screen, fireEvent } from '@testing-library/react';
import { NavBarAdmin } from './NavBarAdmin';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as object,
    useNavigate: () => mockedNavigate,
  };
});

describe('NavBarAdmin', () => {
  it('should render the component without crashing', () => {
    render(
      <MemoryRouter>
        <NavBarAdmin />
      </MemoryRouter>
    );
    expect(screen.getByText('LEVEL-UP')).toBeInTheDocument();
  });

  it('should navigate to /admin when brand is clicked', () => {
    render(
      <MemoryRouter>
        <NavBarAdmin />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('LEVEL-UP'));
    expect(mockedNavigate).toHaveBeenCalledWith('/admin');
  });

  it('should navigate to the correct routes when links are clicked', () => {
    render(
      <MemoryRouter>
        <NavBarAdmin />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Home'));
    expect(mockedNavigate).toHaveBeenCalledWith('/admin/home');

    fireEvent.click(screen.getByText('Boletas'));
    expect(mockedNavigate).toHaveBeenCalledWith('/admin/boletas');

    fireEvent.click(screen.getByText('Producto'));
    expect(mockedNavigate).toHaveBeenCalledWith('/admin/productos');

    fireEvent.click(screen.getByText('Categoría'));
    expect(mockedNavigate).toHaveBeenCalledWith('/admin/categorias');

    fireEvent.click(screen.getByText('Usuario'));
    expect(mockedNavigate).toHaveBeenCalledWith('/admin/usuarios');

    fireEvent.click(screen.getByText('Reportes'));
    expect(mockedNavigate).toHaveBeenCalledWith('/admin/reportes');

    fireEvent.click(screen.getByText('Perfil'));
    expect(mockedNavigate).toHaveBeenCalledWith('/admin/perfil');
  });
});
