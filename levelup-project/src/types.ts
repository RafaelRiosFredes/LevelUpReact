export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  stock: number;
  precio: number;
  imagen: string;
  descripcion: string;
}

export interface Categoria {
  id: number;
  nombre: string;
}
