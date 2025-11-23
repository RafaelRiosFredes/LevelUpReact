import {  useCallback,  useEffect,  useState,  type ChangeEvent,  type FormEvent,} from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Badge,
  Button,
  Form,
  FormControl,
  InputGroup,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import { apiFetch } from "../services/api";

// === Tipos que reflejan el backend ===
interface CategoriaBackend {
  idCategoria: number;
  nombreCategoria: string;
}

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
  categoriaId: number | null;
  categoriaNombre: string;
  imagenes: ImagenProductoBackend[];
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // page index
  size: number;
}

// === Tipo usado en el UI de admin ===
interface ProductoAdmin {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoriaId: number | null;
  categoriaNombre: string;
  imagenPrincipal: string | null;
}

// Mapea del backend al tipo del UI
const mapProductoBackendToAdmin = (p: ProductoBackend): ProductoAdmin => ({
  id: p.idProducto,
  nombre: p.nombreProducto,
  descripcion: p.descripcion,
  precio: p.precio,
  stock: p.stock,
  categoriaId: p.categoriaId,
  categoriaNombre: p.categoriaNombre,
  imagenPrincipal: p.imagenes?.[0]?.url ?? null,
});

export const AdminProductos = () => {
  const [productos, setProductos] = useState<ProductoAdmin[]>([]);
  const [categorias, setCategorias] = useState<CategoriaBackend[]>([]);

  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos");

  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const productosPorPagina = 10;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [idEliminando, setIdEliminando] = useState<number | null>(null);

  // Modal de edición
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<ProductoAdmin | null>(null);
  const [guardando, setGuardando] = useState(false);

  // ============= CARGA DE CATEGORÍAS =============
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const data = await apiFetch<CategoriaBackend[]>("/categorias");
        setCategorias(data);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };
    cargarCategorias();
  }, []);

  // ============= CARGA DE PRODUCTOS (con filtros/paginación) =============
  const cargarProductos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("page", String(paginaActual - 1));
      params.set("size", String(productosPorPagina));

      if (busqueda.trim()) {
        params.set("nombre", busqueda.trim());
      }

      if (filtroCategoria !== "todos") {
        params.set("idCategoria", filtroCategoria);
      }

      const page = await apiFetch<PageResponse<ProductoBackend>>(
        `/productos?${params.toString()}`
      );

      setProductos(page.content.map(mapProductoBackendToAdmin));
      setTotalPaginas(page.totalPages || 1);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error al cargar productos desde el servidor.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [paginaActual, productosPorPagina, busqueda, filtroCategoria]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  // ============= HANDLERS DE FILTROS =============
  const handleBusquedaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  const handleCategoriaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFiltroCategoria(e.target.value);
    setPaginaActual(1);
  };

  const handleBuscarSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPaginaActual(1);
    // el useEffect ya dispara cargarProductos
  };

  // ============= ELIMINAR PRODUCTO =============
  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar este producto? Esta acción no se puede deshacer."
    );
    if (!confirmar) return;

    try {
      setIdEliminando(id);
      setError(null);

      await apiFetch(`/productos/${id}`, {
        method: "DELETE",
      });

      // recargar página actual
      await cargarProductos();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error al eliminar el producto.";
      setError(msg);
    } finally {
      setIdEliminando(null);
    }
  };

  // ============= EDICIÓN =============
  const abrirModalEdicion = (producto: ProductoAdmin) => {
    setEditando({ ...producto });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(null);
  };

  const handleChangeEditar = (
    campo: keyof ProductoAdmin,
    valor: string | number | null
  ) => {
    if (!editando) return;
    setEditando({ ...editando, [campo]: valor } as ProductoAdmin);
  };

  const guardarCambios = async () => {
    if (!editando) return;

    try {
      setGuardando(true);
      setError(null);

      const payload = {
        nombreProducto: editando.nombre,
        descripcion: editando.descripcion,
        precio: editando.precio,
        stock: editando.stock,
        categoriaId: editando.categoriaId,
      };

      await apiFetch(`/productos/${editando.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      cerrarModal();
      await cargarProductos();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error al guardar los cambios del producto.";
      setError(msg);
    } finally {
      setGuardando(false);
    }
  };

  const formatPrice = (value: number) =>
    "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // ============= RENDER =============
  return (
    <Container fluid className="admin-layout text-light py-4">
      <Row>
        {/* Si tienes un sidebar real, reemplaza este Col por tu componente */}
        <Col md={2} className="admin-sidebar">
          <h5>Panel Admin</h5>
          <ul className="admin-menu">
            <li className="active">Productos</li>
            <li>Usuarios</li>
            <li>Órdenes</li>
          </ul>
        </Col>

        <Col md={10} className="admin-content">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Gestión de Productos</h3>
            <small className="text-muted">
              Página {paginaActual} de {totalPaginas}
            </small>
          </div>

          {/* Filtros */}
          <Form onSubmit={handleBuscarSubmit} className="mb-3">
            <Row className="g-2">
              <Col md={5}>
                <InputGroup>
                  <FormControl
                    placeholder="Buscar por nombre..."
                    value={busqueda}
                    onChange={handleBusquedaChange}
                  />
                  <Button type="submit" variant="success">
                    Buscar
                  </Button>
                </InputGroup>
              </Col>
              <Col md={4}>
                <Form.Select
                  value={filtroCategoria}
                  onChange={handleCategoriaChange}
                >
                  <option value="todos">Todas las categorías</option>
                  {categorias.map((c) => (
                    <option key={c.idCategoria} value={String(c.idCategoria)}>
                      {c.nombreCategoria}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Form>

          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
              <p className="mt-2">Cargando productos.</p>
            </div>
          ) : productos.length === 0 ? (
            <p>No se encontraron productos con los filtros actuales.</p>
          ) : (
            <Table striped bordered hover responsive className="table-admin">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.id}</td>
                    <td>
                      {producto.imagenPrincipal ? (
                        <img
                          src={producto.imagenPrincipal}
                          alt={producto.nombre}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span className="text-muted">Sin imagen</span>
                      )}
                    </td>
                    <td>{producto.nombre}</td>
                    <td>{producto.categoriaNombre}</td>
                    <td>
                      <Badge
                        bg={producto.stock > 0 ? "success" : "danger"}
                        className="status-badge-admin"
                      >
                        {producto.stock > 0
                          ? `Disponible (${producto.stock})`
                          : "Sin stock"}
                      </Badge>
                    </td>
                    <td>{formatPrice(producto.precio)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => abrirModalEdicion(producto)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          disabled={idEliminando === producto.id}
                          onClick={() => handleEliminar(producto.id)}
                        >
                          {idEliminando === producto.id
                            ? "Eliminando..."
                            : "Eliminar"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Paginación simple */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Button
              variant="secondary"
              disabled={paginaActual <= 1}
              onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
            >
              Anterior
            </Button>
            <span>
              Página {paginaActual} de {totalPaginas}
            </span>
            <Button
              variant="secondary"
              disabled={paginaActual >= totalPaginas}
              onClick={() =>
                setPaginaActual((p) => Math.min(totalPaginas, p + 1))
              }
            >
              Siguiente
            </Button>
          </div>
        </Col>
      </Row>

      {/* Modal de edición */}
      <Modal show={showModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editando && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  value={editando.nombre}
                  onChange={(e) => handleChangeEditar("nombre", e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editando.descripcion}
                  onChange={(e) =>
                    handleChangeEditar("descripcion", e.target.value)
                  }
                />
              </Form.Group>

              <Row className="mb-3">
                <Col>
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    value={editando.precio}
                    onChange={(e) =>
                      handleChangeEditar("precio", Number(e.target.value))
                    }
                  />
                </Col>
                <Col>
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    value={editando.stock}
                    onChange={(e) =>
                      handleChangeEditar("stock", Number(e.target.value))
                    }
                  />
                </Col>
              </Row>

              <Form.Group>
                <Form.Label>Categoría</Form.Label>
                <Form.Select
                  value={
                    editando.categoriaId != null
                      ? String(editando.categoriaId)
                      : ""
                  }
                  onChange={(e) =>
                    handleChangeEditar(
                      "categoriaId",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                >
                  <option value="">Sin categoría</option>
                  {categorias.map((c) => (
                    <option key={c.idCategoria} value={String(c.idCategoria)}>
                      {c.nombreCategoria}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={cerrarModal}
            disabled={guardando}
          >
            Cancelar
          </Button>
          <Button
            variant="success"
            onClick={guardarCambios}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
