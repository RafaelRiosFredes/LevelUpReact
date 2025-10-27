import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";
import type { Producto } from "../types";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe("CartContext", () => {
  const mockProduct: Producto = {
    id: 1,
    nombre: "Producto A",
    categoria: "General",
    stock: 10,
    precio: 1000,
    imagenes: ["imagen1.jpg"],
    descripcion: "Producto de prueba"
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it("debe iniciar con carrito vacío", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.itemCount).toBe(0);
  });

  it("debe agregar un producto al carrito", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].quantity).toBe(2);
    expect(result.current.itemCount).toBe(2);
  });

  it("debe incrementar la cantidad si el producto ya existe", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
      result.current.addToCart(mockProduct, 2);
    });

    expect(result.current.cartItems[0].quantity).toBe(3);
    expect(result.current.itemCount).toBe(3);
  });

  it("debe actualizar la cantidad de un producto", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
      result.current.updateQuantity(1, 5);
    });

    expect(result.current.cartItems[0].quantity).toBe(5);
    expect(result.current.itemCount).toBe(5);
  });

  it("no debe permitir cantidad menor a 1", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 3);
      result.current.updateQuantity(1, 0);
    });

    expect(result.current.cartItems[0].quantity).toBe(1);
  });

  it("debe eliminar un producto del carrito", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
      result.current.removeFromCart(1);
    });

    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.itemCount).toBe(0);
  });

  it("debe limpiar el carrito", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
      result.current.clearCart();
    });

    expect(result.current.cartItems).toHaveLength(0);
  });
});
