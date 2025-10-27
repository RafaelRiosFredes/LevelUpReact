import { Container, Row, Col, Card, Spinner, Table } from "react-bootstrap";
import { NavBarAdmin } from "../components/NavBarAdmin";
import "../assets/styles.css";
import { useEffect, useState, useMemo } from "react";
import type { Orden } from "../types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Tipos de Datos para el Dashboard ---
interface SalesData {
  name: string; // Fecha (e.g., "Oct 26")
  ingresos: number;
}

interface TopProduct {
  id: number;
  nombre: string;
  cantidadVendida: number;
}

// --- Componente Principal ---

export const DashboardAdmin = () => {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrdenes = async () => {
      setLoading(true);
      try {
        // Use a promise to better simulate real-world data fetching
        const ordenesGuardadas = await Promise.resolve(localStorage.getItem("ordenes_compra"));
        const ordenesData = ordenesGuardadas ? JSON.parse(ordenesGuardadas) : [];
        setOrdenes(Array.isArray(ordenesData) ? ordenesData : []);
      } catch (error) {
        console.error("Error al cargar o parsear las órdenes:", error);
        setOrdenes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrdenes();
  }, []);

  // --- Cálculos de Métricas (Versión Robusta) ---

  const totalIngresos = useMemo(() => 
    ordenes.reduce((acc, orden) => acc + (orden?.total || 0), 0), 
    [ordenes]
  );

  const totalOrdenes = ordenes.length;

  const valorPromedioOrden = useMemo(() => 
    totalOrdenes > 0 ? totalIngresos / totalOrdenes : 0, 
    [totalIngresos, totalOrdenes]
  );

  const topProductos: TopProduct[] = useMemo(() => {
    const productCount: { [key: number]: TopProduct } = {};
    ordenes.forEach(orden => {
      if (Array.isArray(orden?.items)) {
        orden.items.forEach(item => {
          if (item && typeof item.id === 'number' && typeof item.quantity === 'number') {
            if (productCount[item.id]) {
              productCount[item.id].cantidadVendida += item.quantity;
            } else {
              productCount[item.id] = { id: item.id, nombre: item.nombre || 'Producto sin nombre', cantidadVendida: item.quantity };
            }
          }
        });
      }
    });
    return Object.values(productCount)
      .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
      .slice(0, 5);
  }, [ordenes]);

  const salesByDay: SalesData[] = useMemo(() => {
    const salesMap: { [key: string]: number } = {};
    ordenes.forEach(orden => {
      if (orden && orden.fecha && typeof orden.total === 'number') {
        const date = new Date(orden.fecha);
        if (!isNaN(date.getTime())) {
          const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          salesMap[dateString] = (salesMap[dateString] || 0) + orden.total;
        }
      }
    });
    return Object.keys(salesMap).map(date => ({ name: date, ingresos: salesMap[date] })).sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }, [ordenes]);

  const formatPrice = (value: number) => "$" + Math.round(value || 0).toLocaleString("es-CL");

  if (loading) {
    return (
      <div className="text-center mt-5" role="status" data-testid="loading-spinner">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  return (
    <>
      <NavBarAdmin />
      <section className="product-list-section">
        <Container fluid="lg">
          <div className="product-list-box">
            <h2 className="list-title">Dashboard de Rendimiento</h2>

            {/* Tarjetas de Métricas Principales */}
            <Row className="mb-4">
              <Col md={4} className="mb-3">
                <Card className="dashboard-card text-center">
                  <Card.Body>
                    <Card.Title className="card-title-metric">Ingresos Totales</Card.Title>
                    <Card.Text className="card-value">{formatPrice(totalIngresos)}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3">
                <Card className="dashboard-card text-center">
                  <Card.Body>
                    <Card.Title className="card-title-metric">Órdenes Totales</Card.Title>
                    <Card.Text className="card-value">{totalOrdenes}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3">
                <Card className="dashboard-card text-center">
                  <Card.Body>
                    <Card.Title className="card-title-metric">Valor Promedio Orden</Card.Title>
                    <Card.Text className="card-value">{formatPrice(valorPromedioOrden)}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Gráfico y Top Productos */}
            <Row>
              <Col lg={8} className="mb-4">
                <Card className="dashboard-card">
                  <Card.Body>
                    <Card.Title className="card-title-section">Ingresos por Día</Card.Title>
                    {salesByDay.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesByDay} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="name" stroke="#888" />
                          <YAxis stroke="#888" tickFormatter={formatPrice} />
                          <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #1E90FF' }} formatter={(value: number) => formatPrice(value)} />
                          <Legend />
                          <Bar dataKey="ingresos" fill="#1E90FF" name="Ingresos" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center p-5">No hay suficientes datos para mostrar el gráfico.</div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4} className="mb-4">
                <Card className="dashboard-card">
                  <Card.Body>
                    <Card.Title className="card-title-section">Top 5 Productos Vendidos</Card.Title>
                    {topProductos.length > 0 ? (
                      <Table responsive className="table-dashboard" variant="dark">
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Cantidad Vendida</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topProductos.map(p => (
                            <tr key={p.id}>
                              <td>{p.nombre}</td>
                              <td className="text-center">{p.cantidadVendida}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="text-center p-5">No hay datos de productos vendidos.</div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

          </div>
        </Container>
      </section>
    </>
  );
};
