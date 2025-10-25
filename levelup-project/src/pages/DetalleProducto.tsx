import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../assets/styles.css";

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  descripcion: string;
  imagen: string;
}

export const DetalleProducto = () => {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const location = useLocation();

  // Obtener id del producto desde la URL
  const query = new URLSearchParams(location.search);
  const id = Number(query.get("id"));

  useEffect(() => {
    const cargarProducto = async () => {
      const res = await fetch("/products.json");
      const data = await res.json();
      const encontrado = data.find((p: Producto) => p.id === id);
      setProducto(encontrado);
    };
    cargarProducto();
  }, [id]);

  const formatearPrecio = (precio: number) =>
    "$" + precio.toLocaleString("es-CL");

  const agregarAlCarrito = () => {
    if (!producto) return;

    const nuevoProducto = {
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad,
      imagen: producto.imagen,
    };

    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    const existente = carrito.findIndex(
      (item: any) => item.nombre === producto.nombre
    );

    if (existente >= 0) {
      carrito[existente].cantidad += cantidad;
    } else {
      carrito.push(nuevoProducto);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    window.dispatchEvent(new Event("storage")); // actualiza NavBar
    alert(`${producto.nombre} agregado al carrito 🛒`);
  };

  if (!producto)
    return (
      <Container className="text-white py-5">
        <h3>Cargando producto...</h3>
      </Container>
    );

  return (
    <Container className="py-5 text-white">
      <Row className="align-items-center">
        <Col md={5} className="text-center">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded"
          />
        </Col>

        <Col md={7}>
          <h1 className="highlight mb-3">{producto.nombre}</h1>
          <p className="text-muted mb-2">{producto.categoria}</p>
          <h3 className="text-success mb-4">
            {formatearPrecio(producto.precio)}
          </h3>
          <p>{producto.descripcion}</p>

          <div className="d-flex align-items-center mt-4">
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
            >
              <i className="bi bi-dash"></i>
            </Button>
            <input
              type="number"
              value={cantidad}
              readOnly
              className="form-control text-center mx-2"
              style={{ width: "60px" }}
            />
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => setCantidad(cantidad + 1)}
            >
              <i className="bi bi-plus"></i>
            </Button>
          </div>

          <Button
            variant="success"
            className="mt-4 fw-bold"
            onClick={agregarAlCarrito}
          >
            Añadir al carrito 🛒
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
