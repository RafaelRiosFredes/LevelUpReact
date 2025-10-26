interface ProductoCarrito {
  id: number;
  cantidad: number;
}

export const agregarAlCarrito = (idProducto: number, cantidad: number) => {
  // 1. Leer el carrito actual desde localStorage
  const carritoActual: ProductoCarrito[] = JSON.parse(
    localStorage.getItem("carrito") || "[]"
  );

  // 2. Buscar si el producto ya existe en el carrito
  const productoExistenteIndex = carritoActual.findIndex(
    (item) => item.id === idProducto
  );

  if (productoExistenteIndex !== -1) {
    // Si existe, actualiza la cantidad
    carritoActual[productoExistenteIndex].cantidad += cantidad;
  } else {
    // Si no existe, lo añade como un nuevo ítem
    carritoActual.push({ id: idProducto, cantidad: cantidad });
  }

  // 3. Guardar el carrito actualizado en localStorage
  localStorage.setItem("carrito", JSON.stringify(carritoActual));
  window.dispatchEvent(new Event("carritoActualizado"));
};