import { useEffect, useState } from "react";
import type { Producto, Categoria } from "../types";
import { CategoryList } from "../components/CategoryList";
import { ProductCard } from "../components/ProductCard";
import { Container, Row, Col, Spinner } from "react-bootstrap";

export const ProductosPublic = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtro, setFiltro] = useState("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar categorías
      const catRes = await fetch("/categories.json");
      if (!catRes.ok) throw new Error("No se pudieron cargar las categorías");
      const categoriasData = await catRes.json();
      setCategorias(categoriasData);

      // Cargar productos desde localStorage o JSON como fallback
      let productosData: Producto[] = [];
      const productosGuardados = localStorage.getItem("productos");

      if (productosGuardados) {
        productosData = JSON.parse(productosGuardados);
      } else {
        const prodRes = await fetch("/products.json");
        if (!prodRes.ok) throw new Error("No se pudieron cargar los productos");
        productosData = await prodRes.json();
        localStorage.setItem("productos", JSON.stringify(productosData));
      }
      setProductos(productosData);
    } catch (e) {
      console.error("❌ Error cargando datos:", e);
    } finally {
      setLoading(false);
    }
  };
  cargarDatos();

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'productos_lastUpdate' || event.key === 'productos') {
      cargarDatos();
    }
  };
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);


  const productosFiltrados =
    filtro === "todos"
      ? productos
      : productos.filter((p) => p.categoria === filtro);

  return (
    
    <section className="mt-4">
      <Container>
        <h5 className="mb-4 titulo-categoria text-success">
          INICIO &gt; CATEGORÍAS
        </h5>
        <Row>
          <Col md={3}>
            <CategoryList
              categorias={categorias}
              filtro={filtro}
              onFiltrar={setFiltro}
            />
          </Col>
          <Col md={9}>
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" variant="success" />
              </div>
            ) : (
              <Row className="g-4">
                {productosFiltrados.length > 0 ? (
                  productosFiltrados.map((p) => (
                    <ProductCard key={p.id} producto={p} />
                  ))
                ) : (
                  <div className="alert alert-info">
                    No hay productos en esta categoría.
                  </div>
                )}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  )
};
