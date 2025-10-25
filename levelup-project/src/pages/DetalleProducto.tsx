import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
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

export const DetalleProducto = () => {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [relacionados, setRelacionados] = useState<Producto[]>([]);
  const [calificacion, setCalificacion] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idProducto = params.get("id");
    if (!idProducto) return;

    const cargarDatos = async () => {
      try {
        const res = await fetch("/products.json");
        const productos: Producto[] = await res.json();

        const encontrado = productos.find(
          (p) => String(p.id) === String(idProducto)
        );
        setProducto(encontrado || null);

        if (encontrado) {
          const rel = productos.filter(
            (p) =>
              p.categoria === encontrado.categoria && p.id !== encontrado.id
          );
          setRelacionados(rel.slice(0, 10));
        }
      } catch (err) {
        console.error("Error al cargar producto:", err);
      }
    };

    cargarDatos();
  }, []);

  const formatPrice = (value: number) =>
    "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const manejarCalificacion = (valor: number) => {
    setCalificacion(valor);
  };

  if (!producto)
    return (
      <Container className="text-center py-5 text-white">
        <p>Cargando producto...</p>
      </Container>
    );

  return (
    <Container className="py-5 text-white">
      {/* Migas de pan */}
      <p className="text-secondary">
        <a href="/" className="text-info text-decoration-none">
          Inicio
        </a>{" "}
        &gt;{" "}
        <span className="text-info">{producto.categoria}</span> &gt;{" "}
        <span>{producto.nombre}</span>
      </p>

      {/* Detalle principal */}
      <Row className="g-4 align-items-center">
        <Col md={6}>
          <div className="border p-2 bg-dark rounded text-center">
            <img
              src={producto.imagen || "https://via.placeholder.com/500x400"}
              alt={producto.nombre}
              className="img-fluid rounded"
            />
          </div>
        </Col>

        <Col md={6}>
          <h1 className="highlight">{producto.nombre}</h1>
          <p className="price">{formatPrice(producto.precio)}</p>
          <p className="desc">{producto.descripcion}</p>

          <div className="mt-4">
            <label htmlFor="cantidad" className="form-label">
              Cantidad
            </label>
            <input
              type="number"
              id="cantidad"
              className="form-control w-25"
              defaultValue={1}
              min={1}
            />
            <Button className="btn-custom mt-3">Añadir al carrito</Button>
          </div>
        </Col>
      </Row>

      {/* Calificación */}
      <div className="rating mt-5">
        <label className="form-label">Calificación:</label>
        <div className="estrellas">
          {[1, 2, 3, 4, 5].map((n) => (
            <i
              key={n}
              className={`bi bi-star-fill ${
                n <= calificacion ? "selected" : ""
              }`}
              onClick={() => manejarCalificacion(n)}
              onMouseOver={(e) => (e.currentTarget.style.color = "gold")}
              onMouseOut={(e) => (e.currentTarget.style.color = "")}
              style={{ cursor: "pointer", fontSize: "1.8rem" }}
            ></i>
          ))}
        </div>
      </div>

      {/* Productos relacionados */}
      <div className="related mt-5">
        <h3 className="highlight">Productos Relacionados</h3>
        <Row className="g-3 mt-2">
          {relacionados.map((r) => (
            <Col key={r.id} xs={6} md={3} lg={2}>
              <div
                className="producto bg-dark p-2 rounded text-center h-100"
                onClick={() => (window.location.href = `/detalle?id=${r.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="imagen-wrapper">
                  <img
                    src={r.imagen || "https://via.placeholder.com/200"}
                    alt={r.nombre}
                    className="imagen-producto img-fluid"
                  />
                </div>
                <div className="nombre-producto text-white mt-2">
                  {r.nombre}
                </div>
                <div className="precio-producto text-info">
                  {formatPrice(r.precio)}
                </div>
                <Button className="btn-custom anadir-carrito mt-2">
                  Añadir
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};
