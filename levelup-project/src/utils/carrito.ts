// src/utils/carrito.ts
export function agregarAlCarrito(producto: {
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}) {
  let carrito = JSON.parse(localStorage.getItem("carrito") || "[]");

  const index = carrito.findIndex(
    (item: any) => item.nombre === producto.nombre
  );

  if (index !== -1) {
    carrito[index].cantidad += producto.cantidad;
  } else {
    carrito.push(producto);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  // 🔁 Dispara evento para actualizar el NavBar
  window.dispatchEvent(new Event("carritoActualizado"));
}
