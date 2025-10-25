import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { agregarAlCarrito } from "../utils/carrito";
import "../assets/styles.css";

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  stock: number;
  precio: number;
  imagen: string;
  descripcion: string;
}

export const ProductCard = ({ producto }: { producto: Producto }) => {
  const navigate = useNavigate();

  const formatPrice = (value: number) =>
    "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const handleAgregar = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita abrir el detalle
    agregarAlCarrito({
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
      imagen: producto.imagen,
    });
    alert(`${producto.nombre} agregado al carrito 🛒`);
  };

  return (
    <Card
      className="producto bg-dark text-white p-2 rounded h-100"
      onClick={() => navigate(`/detalle?id=${producto.id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="imagen-wrapper">
        <Card.Img
          variant="top"
          src={producto.imagen || "https://via.placeholder.com/300"}
          className="imagen-producto"
        />
      </div>
      <Card.Body className="text-center">
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
          className="mt-2"
        >
          Añadir al carrito
        </Button>
      </Card.Body>
    </Card>
  );
};
