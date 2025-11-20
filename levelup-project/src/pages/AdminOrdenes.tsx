import { Container, Row, Col, Form, Table, Pagination, Accordion, Spinner } from "react-bootstrap";
import { NavBarAdmin } from "../components/NavBarAdmin";
import "../assets/styles.css";
import { useEffect, useState } from "react";
import type { Orden } from "../types";

// --- Componente Principal ---

export const AdminOrdenes = () => {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [busqueda, setBusqueda] = useState<string>("");
  const [paginaActual, setPaginaActual] = useState(1);
  const ordenesPorPagina = 10;
  const [loading, setLoading] = useState(true);

  // Cargar datos de las órdenes desde localStorage
  const cargarOrdenes = () => {
    setLoading(true);
    try {
      const ordenesGuardadas = localStorage.getItem("ordenes_compra");
      const ordenesData = ordenesGuardadas ? JSON.parse(ordenesGuardadas) : [];
      // Ordenar por fecha más reciente
      ordenesData.sort((a: Orden, b: Orden) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      setOrdenes(ordenesData);
    } catch (error) {
      console.error("Error al cargar las órdenes:", error);
      setOrdenes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOrdenes();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'ordenes_compra') {
        cargarOrdenes();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Lógica de búsqueda robusta
  const ordenesFiltradas = ordenes.filter(orden => {
    if (!orden || !orden.cliente) {
      return false;
    }
    const busquedaLower = busqueda.toLowerCase();
    const nombreCliente = `${orden.cliente.nombre || ''} ${orden.cliente.apellido || ''}`.toLowerCase();
    const correoCliente = (orden.cliente.correo || '').toLowerCase();
    const idOrden = String(orden.id || '');
    return (
      nombreCliente.includes(busquedaLower) ||
      correoCliente.includes(busquedaLower) ||
      idOrden.includes(busquedaLower)
    );
  });

  // Lógica de paginación
  const totalPaginas = Math.ceil(ordenesFiltradas.length / ordenesPorPagina);
  const ordenesEnPagina = ordenesFiltradas.slice(
    (paginaActual - 1) * ordenesPorPagina,
    paginaActual * ordenesPorPagina
  );

  const handleCambioPagina = (numeroPagina: number) => {
    if (numeroPagina > 0 && numeroPagina <= totalPaginas) {
      setPaginaActual(numeroPagina);
    }
  };

  const formatPrice = (value: number) =>
    "$" + (value || 0).toLocaleString("es-CL");

  const formatDate = (dateString: string) => {
    if (!dateString) return "Fecha inválida";
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString("es-CL", options);
  }

  return (
    <>
      <NavBarAdmin />
      <section className="product-list-section">
        <Container fluid="lg">
          <div className="product-list-box">
            <h2 className="list-title">Historial de Órdenes</h2>

            <Row className="filters-header mb-4" align-items="center">
              <Col md={4} className="ms-auto">
                <Form.Control
                  type="search"
                  placeholder="Buscar por cliente, correo o ID de orden..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  style={{ textAlign: 'left' }}
                />
              </Col>
            </Row>

            {loading ? (
              <div className="text-center"><Spinner animation="border" variant="success" /></div>
            ) : ordenesEnPagina.length === 0 ? (
              <p className="text-center">No se encontraron órdenes que coincidan con la búsqueda.</p>
            ) : (
              <Accordion className="accordion-admin">
                {ordenesEnPagina.map((orden, index) => (
                  <Accordion.Item eventKey={String(index)} key={orden?.id ?? index}>
                    <Accordion.Header>
                      <Row className="w-100">
                        <Col md={3}><strong>ID Orden:</strong> <span className="order-id">{orden.id}</span></Col>
                        <Col md={3}><strong>Cliente:</strong> {orden.cliente?.nombre ?? 'N/A'} {orden.cliente?.apellido ?? ''}</Col>
                        <Col md={3}><strong>Fecha:</strong> {formatDate(orden.fecha)}</Col>
                        <Col md={3}><strong>Total:</strong> {formatPrice(orden.total)}</Col>
                      </Row>
                    </Accordion.Header>
                    <Accordion.Body>
                      <h5>Detalles del Cliente</h5>
                      <p><strong>Correo:</strong> {orden.cliente?.correo ?? 'N/A'}</p>
                      <p><strong>Dirección:</strong> {`${orden.cliente?.calle ?? 'N/A'}, ${orden.cliente?.comuna ?? 'N/A'}, ${orden.cliente?.region ?? 'N/A'}`}</p>
                      <hr />
                      <h5>Productos Comprados ({orden.items?.length ?? 0})</h5>
                      <Table striped bordered hover responsive variant="dark" size="sm">
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unit.</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orden.items?.map(item => (
                            <tr key={item?.id ?? Math.random()}>
                              <td>{item?.nombre ?? 'Producto no disponible'}</td>
                              <td>{item?.quantity ?? 0}</td>
                              <td>{formatPrice(item?.precio ?? 0)}</td>
                              <td>{formatPrice((item?.precio ?? 0) * (item?.quantity ?? 0))}</td>
                            </tr>
                          )) ?? (
                            <tr>
                              <td colSpan={4} className="text-center">No hay productos en esta orden.</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            )}

            {totalPaginas > 1 && (
              <Pagination className="pagination-admin justify-content-center mt-4">
                <Pagination.First onClick={() => handleCambioPagina(1)} disabled={paginaActual === 1} />
                <Pagination.Prev onClick={() => handleCambioPagina(paginaActual - 1)} disabled={paginaActual === 1} />
                <Pagination.Item active>{paginaActual}</Pagination.Item>
                <Pagination.Next onClick={() => handleCambioPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} />
                <Pagination.Last onClick={() => handleCambioPagina(totalPaginas)} disabled={paginaActual === totalPaginas} />
              </Pagination>
            )}
          </div>
        </Container>
      </section>
    </>
  );
};
