import { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../assets/styles.css";
import type { Producto } from "../types";
import { useCart } from "../context/CartContext";

export const DetalleProducto = () => {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relacionados, setRelacionados] = useState<Producto[]>([]);
  const [calificacion, setCalificacion] = useState(0);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(
    null
  );
  const [cantidad, setCantidad] = useState(1);
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const idProducto = searchParams.get("id");

  const cargarDatos = useCallback(async () => {
    if (!idProducto) {
      setError("No se ha especificado un ID de producto.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let productos: Producto[] = [];
      const productosGuardados = localStorage.getItem("productos");

      if (productosGuardados) {
        try {
          productos = JSON.parse(productosGuardados);
        } catch (e) {
          console.error("Error al parsear productos de localStorage", e);
          productos = [];
        }
      }

      if (productos.length === 0) {
        const res = await fetch("/products.json");
        productos = await res.json();
        localStorage.setItem("productos", JSON.stringify(productos));
      }

      const encontrado = productos.find(
        (p) => String(p.id) === String(idProducto)
      );

      if (!encontrado) {
        throw new Error("Producto no encontrado.");
      }

      setProducto(encontrado);

      if (encontrado?.imagenes?.length) {
        setImagenSeleccionada(encontrado.imagenes[0]);
      }

      if (encontrado) {
        const rel = productos.filter(
          (p) =>
            p.categoria === encontrado.categoria && p.id !== encontrado.id
        );
        setRelacionados(rel.slice(0, 10));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Ocurrió un error desconocido";
      console.error("❌ Error al cargar producto:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [idProducto]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]); // se ejecuta cada vez que el id del producto cambia

  const formatPrice = (value: number) =>
    "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const manejarCalificacion = (valor: number) => {
    setCalificacion(valor);
  };

  const handleAddToCart = () => {
    if (producto) {
      addToCart(producto, cantidad);
      // Opcional: Mostrar una notificación de que el producto fue añadido
      alert(`${cantidad} ${producto.nombre}(s) añadido(s) al carrito.`);
    }
  };

  const cambiarImagen = (direccion: "prev" | "next") => {
    if (!producto || !producto.imagenes || producto.imagenes.length < 2) return;

    const totalImagenes = producto.imagenes.length;
    const indiceActual = producto.imagenes.findIndex(
      (img) => img === imagenSeleccionada
    );

    let nuevoIndice =
      direccion === "next"
        ? (indiceActual + 1) % totalImagenes
        : (indiceActual - 1 + totalImagenes) % totalImagenes;

    setImagenSeleccionada(producto.imagenes[nuevoIndice]);
  };

  if (loading) {
    return (
      <Container className="text-center py-5 text-white">
        <Spinner animation="border" variant="success" />
        <p className="mt-2">Cargando producto...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>¡Oh, no! Ha ocurrido un error.</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  // Si la carga terminó, no hay error, pero el producto es null, mostramos un mensaje.
  // Esto satisface a TypeScript y maneja un caso borde.
  if (!producto) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <p>No se pudo cargar la información del producto.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5 text-white">
      {/* Migas de pan */}
      <p className="text-secondary">
        <a href="/" className="text-info text-decoration-none">
          Inicio
        </a>{" "}
        &gt; <span className="text-info">{producto.categoria}</span> &gt;{" "}
        <span>{producto.nombre}</span>
      </p>

      {/* Detalle principal */}
      <Row className="g-4 align-items-center">
        <Col md={6}>
          <div className="main-image-container bg-dark rounded text-center mb-3 position-relative">
            {producto.imagenes && producto.imagenes.length > 1 && (
              <>
                <Button
                  variant="dark"
                  className="gallery-arrow prev"
                  onClick={() => cambiarImagen("prev")}
                >
                  &#10094;
                </Button>
                <Button
                  variant="dark"
                  className="gallery-arrow next"
                  onClick={() => cambiarImagen("next")}
                >
                  &#10095;
                </Button>
              </>
            )}
            <img
              src={
                imagenSeleccionada ||
                "https://via.placeholder.com/500x400?text=Sin+Imagen"
              }
              alt={producto.nombre}
              className="rounded main-image-detalle"
            />
          </div>
          {producto.imagenes && producto.imagenes.length > 1 && (
            <div className="thumbnail-gallery-wrapper">
              {producto.imagenes.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail-container ${
                    img === imagenSeleccionada ? "active" : ""
                  }`}
                  onClick={() => setImagenSeleccionada(img)}
                >
                  <img
                    src={img}
                    alt={`Miniatura ${producto.nombre} ${index + 1}`}
                    className="thumbnail-image"
                  />
                </div>
              ))}
            </div>
          )}
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
              value={cantidad}
              onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
            />
            <Button className="btn-custom mt-3" onClick={handleAddToCart}>
              Añadir al carrito
            </Button>
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
                onClick={() => navigate(`/detalle?id=${r.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="imagen-wrapper">
                  <img
                    src={
                      r.imagenes && r.imagenes.length > 0
                        ? r.imagenes[0]
                        : "https://via.placeholder.com/200?text=Sin+Imagen"
                    }
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
