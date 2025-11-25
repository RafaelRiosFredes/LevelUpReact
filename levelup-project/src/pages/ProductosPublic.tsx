import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import "../assets/styles.css";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import {CategoryList} from "../components/CategoryList";
import {ProductCard} from "../components/ProductCard";
import type { Producto, Categoria } from "../types";
import { apiFetch } from "../services/api";
import { useSearchParams } from "react-router-dom";

// Tipos que reflejan lo que entrega el backend
interface ProductoImagenBackend {
  idImagenProducto: number;
  url: string;
  contentType: string;
}

interface ProductoBackend {
  idProducto: number;
  nombreProducto: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoriaId: number;
  categoriaNombre: string;
  imagenes: ProductoImagenBackend[];
}

interface CategoriaBackend {
  idCategoria: number;
  nombreCategoria: string;
}

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // página actual (0-based)
  size: number;
}

// Mapea el DTO del backend al tipo usado en el front
const mapProductoBackendToUi = (p: ProductoBackend): Producto => ({
  id: p.idProducto,
  nombre: p.nombreProducto,
  categoria: p.categoriaNombre,
  stock: p.stock,
  precio: p.precio,
  descripcion: p.descripcion,
  // Por ahora no conectamos imágenes reales del backend para no romper nada.
  // ProductCard tiene fallback a placeholder cuando el array está vacío.
  imagenes: [],
});

const PAGE_SIZE = 20;

export const ProductosPublic = () => {
  const [searchParams] = useSearchParams();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const categoriaUrl = searchParams.get("categoria");
  const [filtro, setFiltro] = useState<string>(categoriaUrl || "todos");
  const [paginaActual, setPaginaActual] = useState<number>(1); // 1-based para el usuario
  const [totalPaginas, setTotalPaginas] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1) Cargar categorías desde el backend una vez
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const data = await apiFetch<CategoriaBackend[]>("/categorias");
        const mapped: Categoria[] = data.map((c) => ({
          id: c.idCategoria,
          nombre: c.nombreCategoria,
        }));
        setCategorias(mapped);
      } catch (err) {
        console.error("Error cargando categorías:", err);
        // No rompemos la página si fallan las categorías, solo no habrá filtro usable.
      }
    };

    cargarCategorias();
  }, []);

  // 2) Efecto para escuchar cambios en la URL
useEffect(() => {
  const catParam = searchParams.get("categoria");
  if (catParam) {
    setFiltro(catParam);
    setPaginaActual(1); // Reiniciar a página 1 al cambiar filtro
  }
}, [searchParams]);

  // 3) Cargar productos cada vez que cambie página o filtro
  useEffect(() => {
    const cargarProductos = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        // Backend usa 0-based, UI usa 1-based
        params.set("page", String(paginaActual - 1));
        params.set("size", String(PAGE_SIZE));

        if (filtro !== "todos") {
          const categoriaSeleccionada = categorias.find(
            (c) => c.nombre === filtro
          );
          if (categoriaSeleccionada) {
            params.set("idCategoria", String(categoriaSeleccionada.id));
          }
        }

        const page = await apiFetch<PageResponse<ProductoBackend>>(
          `/productos?${params.toString()}`
        );

        const mappedProductos = page.content.map(mapProductoBackendToUi);
        setProductos(mappedProductos);

        const total =
          page.totalPages && page.totalPages > 0 ? page.totalPages : 1;
        setTotalPaginas(total);

        // Si por algún motivo nos quedamos en una página mayor al total (p.ej. cambió el filtro),
        // volvemos a la página 1.
        if (paginaActual > total) {
          setPaginaActual(1);
        }
      } catch (err) {
        console.error("Error cargando productos:", err);
        const msg =
          err instanceof Error
            ? err.message
            : "Ocurrió un error al cargar los productos.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, [paginaActual, filtro, categorias]);

  const handleFiltrar = (nuevoFiltro: string) => {
    setFiltro(nuevoFiltro);
    setPaginaActual(1);
  };

  const handlePaginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual((prev) => prev - 1);
    }
  };

  const handlePaginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual((prev) => prev + 1);
    }
  };

  return (
    <>
      <NavBar />

      <section style={{ marginTop: "120px" }}>
        <Container>
          <h5 className="mb-4 titulo-categoria text-success">
            INICIO &gt; CATEGORÍAS
          </h5>
          <Row>
            <Col md={3}>
              <CategoryList
                categorias={categorias}
                filtro={filtro}
                onFiltrar={handleFiltrar}
              />
            </Col>
            <Col md={9}>
              {loading ? (
                <div
                  className="text-center"
                  role="status"
                  data-testid="loading-spinner"
                >
                  <Spinner animation="border" variant="success" />
                </div>
              ) : error ? (
                <div className="alert alert-danger">
                  <strong>Error:</strong> {error}
                </div>
              ) : (
                <>
                  <Row className="g-4">
                    {productos.length > 0 ? (
                      productos.map((p) => (
                        <ProductCard key={p.id} producto={p} />
                      ))
                    ) : (
                      <div className="alert alert-info">
                        No hay productos en esta categoría.
                      </div>
                    )}
                  </Row>

                  {/* Paginación simple: 20 productos por página */}
                  {productos.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <Button
                        variant="outline-success"
                        disabled={paginaActual === 1}
                        onClick={handlePaginaAnterior}
                      >
                        Anterior
                      </Button>
                      <span>
                        Página {paginaActual} de {totalPaginas}
                      </span>
                      <Button
                        variant="outline-success"
                        disabled={paginaActual === totalPaginas}
                        onClick={handlePaginaSiguiente}
                      >
                        Siguiente
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
};
