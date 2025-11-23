import { useEffect, useState } from "react";
import { NavBarAdmin } from "../components/NavBarAdmin";
import "../assets/styles.css";
import { Table, Container, Spinner, Alert, Button } from "react-bootstrap";
import { getBoletas } from "../services/BoletaService";
import { useNavigate } from "react-router-dom";

export const BoletasAdmin = () => {
  const [boletas, setBoletas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const formatPrice = (value: number) =>
    value.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
    });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    getBoletas()
      .then((data) => {
        setBoletas(data.content || data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudieron cargar las boletas.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <>
        <NavBarAdmin />
        <Container className="text-center text-white py-5">
          <Spinner animation="border" />
          <p>Cargando boletas...</p>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBarAdmin />
        <Container className="text-center text-white py-5">
          <Alert variant="danger">{error}</Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavBarAdmin />

      <div className="boletas-admin-page" style={{ marginTop: "120px" }}>
        <div className="boletas-header">
          <h2>📄 Historial de Boletas</h2>
          <p className="desc">
            Revisa las compras realizadas por los clientes en la plataforma.
          </p>
        </div>

        <div className="boletas-table-container shadow-lg">
          <Table hover responsive className="boletas-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Descuento</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {boletas.map((b) => (
                <tr key={b.idBoleta}>
                  <td>{b.idBoleta}</td>
                  <td>{b.nombreUsuario}</td>
                  <td>{formatDate(b.fechaEmision)}</td>
                  <td>{formatPrice(b.total)}</td>
                  <td>{b.descuento}%</td>
                  <td>
                    <Button
                      className="btn-detalle"
                      size="sm"
                      onClick={() => navigate(`/boleta/${b.idBoleta}`)}
                    >
                      Ver detalle
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};
