import { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate, useSearchParams,Link } from "react-router-dom";
import { apiFetch } from "../services/api"; // ajusta a tu ruta real
import "../assets/styles.css";
import type { Producto } from "../types";
import { useCart } from "./CartContext";

// === Tipos que reflejan el backend ===

interface ImagenProductoBackend {
  idImagen: number;
  url: string;
  contentType: string;
  sizeBytes: number;
  nombreArchivo: string;
}

interface ProductoBackend {
  idProducto: number;
  nombreProducto: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoriaId: number;
  categoriaNombre: string;
  imagenes: ImagenProductoBackend[];
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}



// Mapeo de DTO backend -> tipo de UI
const mapProductoBackendToUi = (p: ProductoBackend): Producto => ({
  id: p.idProducto,
  nombre: p.nombreProducto,
  categoria: p.categoriaNombre || "Sin categoría",
  stock: p.stock,
  precio: p.precio,
  descripcion: p.descripcion,
  imagenes: p.imagenes?.map((img) => img.url) ?? [],
});

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

  // Comentarios locales solo en frontend por ahora
  const [comentario, setComentario] = useState("");
  const [comentarios, setComentarios] = useState<string[]>([]);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const idProducto = searchParams.get("id");
  const { addToCart } = useCart();

 const cargarDatos = useCallback(async () => {
   if (!idProducto) {
     setError("No se ha especificado un ID de producto.");
     setLoading(false);
     return;
   }

   setLoading(true);
   setError(null);

   try {
     // 1) Obtener producto principal desde backend
     const backendProducto = await apiFetch<ProductoBackend>(
       `/productos/${idProducto}`
     );

     const uiProducto = mapProductoBackendToUi(backendProducto);
     setProducto(uiProducto);

     if (uiProducto.imagenes.length > 0) {
       setImagenSeleccionada(uiProducto.imagenes[0]);
     } else {
       setImagenSeleccionada(null);
     }

     // reset de cosas asociadas al producto anterior
     setCalificacion(0);
     setComentarios([]);
     setCantidad(1);

     // 2) Obtener productos relacionados por categoría
     if (backendProducto.categoriaId) {
       const params = new URLSearchParams({
         page: "0",
         size: "10",
         idCategoria: String(backendProducto.categoriaId),
       });

       const relacionadosPage = await apiFetch<PageResponse<ProductoBackend>>(
         `/productos?${params.toString()}`
       );

       const relacionadosUi = relacionadosPage.content
         .filter((p) => p.idProducto !== backendProducto.idProducto)
         .map(mapProductoBackendToUi);

       setRelacionados(relacionadosUi);
     }else {
        setRelacionados([]);
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
  }, [cargarDatos]);

  const formatPrice = (value: number) =>
    "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const manejarCalificacion = (valor: number) => {
    setCalificacion(valor);
  };

  const handleAddToCart = () => {
    if (producto) {
      addToCart(producto, cantidad);
      alert(`${cantidad} ${producto.nombre}(s) añadido(s) al carrito.`);
    }
  };

  const cambiarImagen = (direccion: "prev" | "next") => {
    if (!producto || !producto.imagenes || producto.imagenes.length < 2) return;

    const totalImagenes = producto.imagenes.length;
    const indiceActual = producto.imagenes.findIndex(
      (img) => img === imagenSeleccionada
    );

    const nuevoIndice =
      direccion === "next"
        ? (indiceActual + 1) % totalImagenes
        : (indiceActual - 1 + totalImagenes) % totalImagenes;

    setImagenSeleccionada(producto.imagenes[nuevoIndice]);
    
  };

  // === Render ===

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
          <Alert.Heading>Ha ocurrido un error.</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

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
        <Link to="/" className="text-info text-decoration-none">
          Inicio
        </Link>{" "}
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
              onChange={(e) =>
                setCantidad(Math.max(1, parseInt(e.target.value) || 1))
              }
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

      {/* Comentarios */}
      <div className="comentarios mt-4">
        <h4 className="highlight">Añadir un comentario</h4>

        <textarea
          className="form-control bg-dark text-white mt-2"
          placeholder="Escribe tu comentario..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={3}
        ></textarea>

        <Button
          className="btn-custom mt-2"
          onClick={() => {
            if (comentario.trim().length === 0) return;
            setComentarios([...comentarios, comentario]);
            setComentario("");
          }}
        >
          Publicar comentario
        </Button>

        {comentarios.length > 0 && (
          <div className="lista-comentarios mt-4">
            <h5 className="text-info">Comentarios</h5>
            {comentarios.map((c, i) => (
              <div key={i} className="bg-dark p-2 rounded mt-2">
                <p className="m-0">{c}</p>
              </div>
            ))}
          </div>
        )}
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
