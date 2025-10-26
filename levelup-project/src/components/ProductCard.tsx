import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { agregarAlCarrito } from "../utils/carrito";
import type { Producto } from "../types";
import "../assets/styles.css";

export const ProductCard = ({ producto }: { producto: Producto }) => {
  const navigate = useNavigate();

  const formatPrice = (value: number) =>
    "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const handleAgregar = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita abrir el detalle
    agregarAlCarrito(producto.id, 1);
    alert(`${producto.nombre} agregado al carrito 🛒`);
  };

  return (
    <div
      className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center"
      onClick={() => navigate(`/detalle?id=${producto.id}`)}
      style={{ cursor: "pointer" }}
    >
      <Card className="producto bg-dark text-white p-2 rounded h-100">
        <div className="imagen-wrapper">
        <Card.Img
          variant="top"
          src={
            producto.imagenes && producto.imagenes.length > 0
              ? producto.imagenes[0]
              : "https://via.placeholder.com/300?text=Sin+Imagen"
          }
          className="imagen-producto"
        />
        </div>
        <Card.Body className="text-center d-flex flex-column">
        <Card.Title className="nombre-producto">
          {producto.nombre}
        </Card.Title>
        <Card.Text className="precio-producto text-success">
          {formatPrice(producto.precio)}
        </Card.Text>
        <Button
          variant="success"
          size="sm"
          onClick={handleAgregar}
          className="mt-auto"
        >
          Añadir al carrito
        </Button>
        </Card.Body>
      </Card>
    </div>
  );
};
