import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
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

export const ProductosPublic = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("Todos");
  const [busqueda, setBusqueda] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [productosRes, categoriasRes] = await Promise.all([
          fetch("/products.json"),
          fetch("/categories.json"),
        ]);

        const productosData = await productosRes.json();
        const categoriasData = await categoriasRes.json();

        setProductos(productosData);
        setCategorias(["Todos", ...categoriasData.map((c: any) => c.nombre)]);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };

    cargarDatos();
  }, []);

  const formatPrice = (value: number) =>
    "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const productosFiltrados = productos.filter((p) => {
    const coincideCategoria =
      categoriaSeleccionada === "Todos" ||
      p.categoria === categoriaSeleccionada;
    const coincideBusqueda = p.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <Container fluid className="py-5 text-white">
      {/* MIGAS DE PAN */}
      <div className="mb-3">
        <span className="highlight">INICIO</span> &gt;{" "}
        <span className="highlight">CATEGORÍAS</span>
      </div>

      <Row>
        {/* LISTA DE CATEGORÍAS */}
        <Col md={2}>
          <div className="categorias p-3 rounded">
            {categorias.map((cat) => (
              <div
                key={cat}
                className={`list-group-item ${
                  cat === categoriaSeleccionada ? "active" : ""
                }`}
                onClick={() => setCategoriaSeleccionada(cat)}
                style={{ cursor: "pointer" }}
              >
                {cat}
              </div>
            ))}
          </div>
        </Col>

        {/* PRODUCTOS */}
        <Col md={10}>
          <Row className="g-3">
            {productosFiltrados.length === 0 ? (
              <p>No hay productos disponibles.</p>
            ) : (
              productosFiltrados.map((p) => (
                <Col key={p.id} xs={6} md={3} lg={2}>
                  <div
                    className="producto bg-dark p-2 rounded text-center h-100"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/detalle?id=${p.id}`)}
                  >
                    <div className="imagen-wrapper">
                      <img
                        src={p.imagen || "https://via.placeholder.com/200"}
                        alt={p.nombre}
                        className="imagen-producto img-fluid"
                      />
                    </div>
                    <div className="nombre-producto text-white mt-2">
                      {p.nombre}
                    </div>
                    <div className="precio-producto text-info">
                      {formatPrice(p.precio)}
                    </div>
                    <Button className="btn-custom anadir-carrito mt-2">
                      Añadir al carrito
                    </Button>
                  </div>
                </Col>
              ))
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
