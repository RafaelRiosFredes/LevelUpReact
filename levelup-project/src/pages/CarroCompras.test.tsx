import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CarroCompras } from "./CarroCompras";
import { useCart } from "./CartContext";

// ✅ Mock del contexto del carrito
vi.mock("./CartContext", () => ({
  useCart: vi.fn(),
}));

describe("CarroCompras", () => {
  const mockUpdateQuantity = vi.fn();
  const mockRemoveFromCart = vi.fn();
  const mockClearCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // 🔹 Mock global para evitar errores "window.alert not implemented"
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("muestra mensaje cuando el carrito está vacío", () => {
    (useCart as unknown as Mock).mockReturnValue({
      cartItems: [],
      updateQuantity: mockUpdateQuantity,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
    });

    render(
      <MemoryRouter>
        <CarroCompras />
      </MemoryRouter>
    );

    expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
    expect(screen.getByText(/ir a la tienda/i)).toBeInTheDocument();
  });

  it("muestra los productos en el carrito correctamente", () => {
    (useCart as unknown as Mock).mockReturnValue({
      cartItems: [
        {
          id: 1,
          nombre: "Camiseta LevelUp",
          precio: 12990,
          quantity: 2,
          imagenes: ["camiseta.jpg"],
        },
      ],
      updateQuantity: mockUpdateQuantity,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
    });

    render(
      <MemoryRouter>
        <CarroCompras />
      </MemoryRouter>
    );

    expect(screen.getByText(/Camiseta LevelUp/i)).toBeInTheDocument();
    const precios = screen.getAllByText(/\$25\.980/);
    expect(precios.length).toBeGreaterThan(0);
  });

  it("incrementa y decrementa cantidad al hacer clic", () => {
    (useCart as unknown as Mock).mockReturnValue({
      cartItems: [
        {
          id: 1,
          nombre: "Mouse Gamer",
          precio: 19990,
          quantity: 1,
          imagenes: ["mouse.jpg"],
        },
      ],
      updateQuantity: mockUpdateQuantity,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
    });

    render(
      <MemoryRouter>
        <CarroCompras />
      </MemoryRouter>
    );

    const botones = screen.getAllByRole("button");
    const btnMas = botones.find((b) => b.innerHTML.includes("plus"));
    const btnMenos = botones.find((b) => b.innerHTML.includes("dash"));

    if (btnMas) fireEvent.click(btnMas);
    if (btnMenos) fireEvent.click(btnMenos);

    expect(mockUpdateQuantity).toHaveBeenCalledTimes(2);
  });

  it("muestra alerta cuando se aplica cupón válido o inválido", () => {
    (useCart as unknown as Mock).mockReturnValue({
      cartItems: [
        {
          id: 1,
          nombre: "Camiseta LevelUp",
          precio: 10000,
          quantity: 1,
          imagenes: [],
        },
      ],
      updateQuantity: mockUpdateQuantity,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
    });

    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <CarroCompras />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Código");
    const btnAplicar = screen.getByText("Aplicar");

    // Cupón válido
    fireEvent.change(input, { target: { value: "levelup10" } });
    fireEvent.click(btnAplicar);
    expect(alertMock).toHaveBeenCalledWith("🎉 Cupón aplicado: 10% de descuento");

    // Cupón inválido
    fireEvent.change(input, { target: { value: "fake123" } });
    fireEvent.click(btnAplicar);
    expect(alertMock).toHaveBeenCalledWith("⚠️ Cupón inválido");

    alertMock.mockRestore();
  });

  it("permite eliminar un producto del carrito", () => {
    (useCart as unknown as Mock).mockReturnValue({
      cartItems: [
        {
          id: 1,
          nombre: "Teclado RGB",
          precio: 29990,
          quantity: 1,
          imagenes: [],
        },
      ],
      updateQuantity: mockUpdateQuantity,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
    });

    render(
      <MemoryRouter>
        <CarroCompras />
      </MemoryRouter>
    );

    // ✅ Busca específicamente el botón con clase 'btn-danger'
    const botonEliminar = document.querySelector(".btn-danger") as HTMLButtonElement;
    expect(botonEliminar).not.toBeNull();

    if (botonEliminar) {
      fireEvent.click(botonEliminar);
    }

    expect(mockRemoveFromCart).toHaveBeenCalledWith(1);
  });
});
