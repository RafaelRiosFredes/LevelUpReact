import { Container, Row, Col, Form, Table, Pagination } from "react-bootstrap";
import { NavBarAdmin } from "../components/NavBarAdmin";
import "../assets/styles.css";
import { useEffect, useState } from "react";

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  stock: number;
  precio: number;
  imagenes: string[];
  descripcion: string;
}

// Función para asignar clases de CSS según el estado
const getStatusClass = (estado: string) => {
  switch (estado) {
    case "Disponible":
      return "status-disponible";
    case "Stock Bajo":
      return "status-stock-bajo";
    case "Agotado":
      return "status-agotado";
    default:
      return "";
  }
};

interface Categoria {
  id: number;
  nombre: string;
}

export const AdminProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState<string>("");
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 20;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        // Cargar categorías
        const categoriasResponse = await fetch("/categories.json");
        const categoriasData = await categoriasResponse.json();
        setCategorias(categoriasData);

        // Cargar productos desde localStorage o JSON
        let productosData: Producto[] = [];
        const productosGuardados = localStorage.getItem("productos");
        if (productosGuardados) {
          productosData = JSON.parse(productosGuardados);
        } else {
          const productosResponse = await fetch("/products.json");
          productosData = await productosResponse.json();
          localStorage.setItem("productos", JSON.stringify(productosData));
        }
        setProductos(productosData);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();

    // Escuchar cambios en localStorage para actualizar en tiempo real
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'productos_lastUpdate' || event.key === 'productos') {
        cargarDatos();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getEstadoProducto = (stock: number): string => {
    if (stock === 0) return "Agotado";
    if (stock <= 10) return "Stock Bajo";
    return "Disponible";
  };

  const truncarNombre = (nombre: string, maxLength: number = 20): string => {
    if (nombre.length <= maxLength) return nombre;
    return nombre.slice(0, maxLength - 3) + "...";
  };

  const productosFiltrados = productos
    .filter(producto => 
      categoriaFiltro === "todos" || producto.categoria === categoriaFiltro
    )
    .filter(producto =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

  // Calcular el total de páginas
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  // Obtener los productos de la página actual
  const productosEnPagina = productosFiltrados.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );

  // Manejar cambio de página
  const handleCambioPagina = (numeroPagina: number) => {
    setPaginaActual(numeroPagina);
  };

  return (
    <>
      <NavBarAdmin />
      <section className="product-list-section">
        <Container fluid="lg">
          <div className="product-list-box">
            <h2 className="list-title">Gestión de Productos</h2>

            {/* Filtros y Búsqueda */}
            <Row className="filters-header mb-4" align-items="center">
              <Col md={4}>
                <Form.Select
                  aria-label="Filtrar por categoría"
                  value={categoriaFiltro}
                  onChange={(e) => setCategoriaFiltro(e.target.value)}
                >
                  <option value="todos">Todos los productos</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.nombre}>
                      {categoria.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4} className="ms-auto">
                <Form.Control
                  type="search"
                  placeholder="Buscar producto..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="admin-search-input"
                  style={{ textAlign: 'left' }}
                />
              </Col>
            </Row>

            {/* Tabla de Productos */}
            <Table responsive className="table-admin" variant="dark">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {productosEnPagina.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td title={p.nombre}>{truncarNombre(p.nombre)}</td>
                    <td>{p.categoria}</td>
                    <td>{p.stock}</td>
                    <td>${p.precio.toLocaleString()}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          getEstadoProducto(p.stock)
                        )}`}
                      >
                        {getEstadoProducto(p.stock)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Paginación */}
            <Pagination className="pagination-admin justify-content-center">
              <Pagination.First
                onClick={() => handleCambioPagina(1)}
                disabled={paginaActual === 1}
              />
              <Pagination.Prev
                onClick={() => handleCambioPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
              />
              
              {totalPaginas <= 7 ? (
                // Si hay 7 páginas o menos, mostrar todas
                Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                  <Pagination.Item
                    key={pagina}
                    active={pagina === paginaActual}
                    onClick={() => handleCambioPagina(pagina)}
                  >
                    {pagina}
                  </Pagination.Item>
                ))
              ) : (
                // Si hay más de 7 páginas, mostrar un rango inteligente
                <>
                  {/* Primeras páginas */}
                  {paginaActual <= 4 ? (
                    <>
                      {[1, 2, 3, 4, 5].map(pagina => (
                        <Pagination.Item
                          key={pagina}
                          active={pagina === paginaActual}
                          onClick={() => handleCambioPagina(pagina)}
                        >
                          {pagina}
                        </Pagination.Item>
                      ))}
                      <Pagination.Ellipsis />
                      <Pagination.Item
                        onClick={() => handleCambioPagina(totalPaginas)}
                      >
                        {totalPaginas}
                      </Pagination.Item>
                    </>
                  ) : paginaActual >= totalPaginas - 3 ? (
                    <>
                      <Pagination.Item onClick={() => handleCambioPagina(1)}>
                        1
                      </Pagination.Item>
                      <Pagination.Ellipsis />
                      {Array.from(
                        { length: 5 },
                        (_, i) => totalPaginas - 4 + i
                      ).map(pagina => (
                        <Pagination.Item
                          key={pagina}
                          active={pagina === paginaActual}
                          onClick={() => handleCambioPagina(pagina)}
                        >
                          {pagina}
                        </Pagination.Item>
                      ))}
                    </>
                  ) : (
                    <>
                      <Pagination.Item onClick={() => handleCambioPagina(1)}>
                        1
                      </Pagination.Item>
                      <Pagination.Ellipsis />
                      {[paginaActual - 1, paginaActual, paginaActual + 1].map(
                        pagina => (
                          <Pagination.Item
                            key={pagina}
                            active={pagina === paginaActual}
                            onClick={() => handleCambioPagina(pagina)}
                          >
                            {pagina}
                          </Pagination.Item>
                        )
                      )}
                      <Pagination.Ellipsis />
                      <Pagination.Item
                        onClick={() => handleCambioPagina(totalPaginas)}
                      >
                        {totalPaginas}
                      </Pagination.Item>
                    </>
                  )}
                </>
              )}

              <Pagination.Next
                onClick={() => handleCambioPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
              />
              <Pagination.Last
                onClick={() => handleCambioPagina(totalPaginas)}
                disabled={paginaActual === totalPaginas}
              />
            </Pagination>
          </div>
        </Container>
      </section>
    </>
  );
};
