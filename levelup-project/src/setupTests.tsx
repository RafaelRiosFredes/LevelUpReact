import "@testing-library/jest-dom";
import { vi } from "vitest";

// 🧩 Mock de react-bootstrap para evitar errores de hooks durante los tests
vi.mock("react-bootstrap", async () => {
  const actual = await vi.importActual<any>("react-bootstrap");
  return {
    ...actual,
    Container: ({ children }: any) => (
      <div data-testid="mock-container">{children}</div>
    ),
    Row: ({ children }: any) => (
      <div data-testid="mock-row">{children}</div>
    ),
    Col: ({ children }: any) => (
      <div data-testid="mock-col">{children}</div>
    ),
    Spinner: () => <div data-testid="mock-spinner">Spinner</div>,
  };
});

// ✅ Mock global de fetch para pruebas — evita errores de rutas inexistentes
(globalThis as any).fetch = vi.fn(async (url: string) => {
  if (url.includes("categories")) {
    return {
      ok: true,
      json: async () => [
        { id: 1, nombre: "Ropa" },
        { id: 2, nombre: "Tecnología" },
      ],
    } as Response;
  }

  if (url.includes("productos")) {
    return {
      ok: true,
      json: async () => [
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
      ],
    } as Response;
  }

  return {
    ok: false,
    json: async () => ({}),
  } as Response;
});

// ✅ Mock de react-router-dom para evitar errores con useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});
