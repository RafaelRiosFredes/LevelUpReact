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

  /*useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/products.json"),
          fetch("/categories.json"),
        ]);
        setProductos(await prodRes.json());
        setCategorias(await catRes.json());
      } catch (e) {
        console.error("Error cargando productos:", e);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);*/

  useEffect(() => {
  const cargarDatos = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/products.json"),
        fetch("/categories.json"),
      ]);

      if (!prodRes.ok || !catRes.ok) {
        throw new Error("Archivos JSON no encontrados");
      }

      const productosData = await prodRes.json();
      const categoriasData = await catRes.json();

      console.log("✅ Productos cargados:", productosData);
      console.log("✅ Categorías cargadas:", categoriasData);

      setProductos(productosData);
      setCategorias(categoriasData);
    } catch (e) {
      console.error("❌ Error cargando datos:", e);
    } finally {
      setLoading(false);
    }
  };
  cargarDatos();
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
