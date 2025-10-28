import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RegistroUsuario } from "./RegistroUsuario";

// ✅ Mock de Navbar y Footer para no depender del layout
vi.mock("../components/NavBar", () => ({
  Navbar: () => <div data-testid="navbar">Mock Navbar</div>,
}));
vi.mock("../components/Footer", () => ({
  Footer: () => <div data-testid="footer">Mock Footer</div>,
}));

// ✅ Mock seguro de window.location sin romper tipos
const originalLocation = window.location;

beforeAll(() => {
  const mockLocation = {
    ...window.location,
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
    href: "",
  } as unknown as Location;

  Object.defineProperty(window, "location", {
    writable: true,
    value: mockLocation,
  });
});

afterAll(() => {
  Object.defineProperty(window, "location", {
    writable: true,
    value: originalLocation,
  });
});

describe("RegistroUsuario", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("muestra los campos del formulario correctamente", () => {
    render(
      <MemoryRouter>
        <RegistroUsuario />
      </MemoryRouter>
    );

    expect(screen.getByText("Registro de Usuario")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ingresa tu nombre completo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ingresa tu correo electrónico")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ingresa tu contraseña")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ingresa nuevamente tu contraseña")).toBeInTheDocument();
  });

  it("muestra mensaje de error si faltan campos obligatorios", () => {
    render(
      <MemoryRouter>
        <RegistroUsuario />
      </MemoryRouter>
    );

    const boton = screen.getByRole("button", { name: /Registrarse/i });
    fireEvent.click(boton);

    expect(screen.getByText(/Completa todos los campos obligatorios/i)).toBeInTheDocument();
  });

  it("muestra error si las contraseñas no coinciden", () => {
    render(
      <MemoryRouter>
        <RegistroUsuario />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Ingresa tu nombre completo"), {
      target: { value: "Savka Tester" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresa tu correo electrónico"), {
      target: { value: "savka@correo.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresa tu contraseña"), {
      target: { value: "1234" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresa nuevamente tu contraseña"), {
      target: { value: "4321" },
    });
    fireEvent.change(screen.getByLabelText("Fecha de Nacimiento"), {
      target: { value: "2000-01-01" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Registrarse/i }));

    expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeInTheDocument();
  });

  it("muestra error si el usuario es menor de edad", () => {
    render(
      <MemoryRouter>
        <RegistroUsuario />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Ingresa tu nombre completo"), {
      target: { value: "Savka Menor" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresa tu correo electrónico"), {
      target: { value: "menor@correo.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresa tu contraseña"), {
      target: { value: "1234" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresa nuevamente tu contraseña"), {
      target: { value: "1234" },
    });
    fireEvent.change(screen.getByLabelText("Fecha de Nacimiento"), {
      target: { value: "2010-01-01" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Registrarse/i }));

    expect(screen.getByText(/Solo \+18 pueden registrarse/i)).toBeInTheDocument();
  });

  it("registra correctamente un usuario DUOC con descuento", async () => {
    render(
      <MemoryRouter>
        <RegistroUsuario />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Ingresa tu nombre completo"), {
      target: { value: "Savka DUOC" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresa tu correo electrónico"), {
      target: { value: "savka@duocuc.cl" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresa tu contraseña"), {
      target: { value: "1234" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresa nuevamente tu contraseña"), {
      target: { value: "1234" },
    });
    fireEvent.change(screen.getByLabelText("Fecha de Nacimiento"), {
      target: { value: "2000-01-01" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Registrarse/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/20% de descuento por ser estudiante DUOC UC/i)
      ).toBeInTheDocument();
    });

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    expect(usuarios[0].email).toBe("savka@duocuc.cl");
    expect(usuarios[0].descuento).toBe(20);
  });
});
