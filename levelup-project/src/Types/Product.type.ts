export interface Categoria {
  id: number;
  nombre: string;
}

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  stock: number;
  precio: number;
  imagenes: string[];  // Array de strings (URLs o base64)
  descripcion: string;
}

export interface NuevoProducto extends Omit<Producto, 'id'> {
  id?: number;
}