import type { Producto } from "../types";

interface Props {
  producto: Producto;
}

export const ProductCard = ({ producto }: Props) => {
  const formatPrice = (price: number) =>
    "$" + price.toLocaleString("es-CL", { minimumFractionDigits: 0 });

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
      <div className="producto">
        <div className="imagen-wrapper">
          <img
            src={
              producto.imagenes && producto.imagenes.length > 0
                ? producto.imagenes[0]
                : "https://via.placeholder.com/300x300?text=Sin+Imagen"
            }
            alt={producto.nombre}
            className="imagen-producto"
          />
        </div>
        <div className="nombre-producto">{producto.nombre}</div>
        <div className="precio-producto">{formatPrice(producto.precio)}</div>
        <button className="btn btn-custom anadir-carrito">Añadir al carrito</button>
      </div>
    </div>
  );
};
