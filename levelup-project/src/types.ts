export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  stock: number;
  precio: number;
  imagenes: string[];
  descripcion: string;
}

export interface Categoria {
  id: number;
  nombre: string;
}

export interface CartItem extends Producto {
  quantity: number;
}

export interface Cliente {
  nombre: string;
  apellido: string;
  correo: string;
  calle: string;
  departamento: string;
  region: string;
  comuna: string;
  indicaciones: string;
}

export interface Orden {
  id: number; // timestamp
  fecha: string;
  cliente: Cliente;
  items: CartItem[];
  total: number;
}
