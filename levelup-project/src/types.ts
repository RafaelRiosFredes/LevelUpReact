export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  stock: number;
  precio: number;
  imagenes: string[]; // This was already correct, but I'm confirming.
  descripcion: string;
}

export interface Categoria {
  id: number;
  nombre: string;
}
