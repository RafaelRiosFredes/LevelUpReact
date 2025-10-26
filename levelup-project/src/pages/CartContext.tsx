import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Producto } from '../types';

// Define el tipo para un item en el carrito
export interface CartItem extends Producto {
  quantity: number;
}

// Define el tipo para el valor del contexto
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Producto, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

// Crea el contexto con un valor por defecto undefined
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook personalizado para usar el contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

// Componente Proveedor del Contexto
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Cargar el carrito desde localStorage al iniciar
    try {
      const localData = localStorage.getItem('cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error al cargar el carrito desde localStorage", error);
      return [];
    }
  });

  // Guardar el carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Producto, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // Si el item ya existe, actualiza la cantidad
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      // Si es un item nuevo, lo añade al carrito
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCartItems(prevItems => prevItems.map(item =>
      item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const value = { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, itemCount };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};