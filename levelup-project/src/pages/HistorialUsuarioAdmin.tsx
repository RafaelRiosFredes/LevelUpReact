import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { NavBarAdmin } from "../components/NavBarAdmin";
import "../assets/styles.css";

interface Orden {
  id: number;
  fecha: string;
  total: number;
  cliente: {
    id?: number;
    nombre: string;
    apellido?: string;
    correo: string;
  };
  items: {
    id?: number;
    nombre: string;
    precio: number;
    quantity: number;
  }[];
}

export const HistorialUsuarioAdmin = () => {
  const { id } = useParams<{ id: string }>();
 
  const navigate = useNavigate();

  // Estado donde se guardan las órdenes del usuario
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  
  // Estado para controlar si carga la información
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lee las órdenes desde localStorage
    const ordenesGuardadas = JSON.parse(localStorage.getItem("ordenes_compra") || "[]");

    //  filtra solo las del usuario por ID
    const filtradas = id
      ? ordenesGuardadas.filter((orden: Orden) => String(orden.cliente?.id) === String(id))
      : ordenesGuardadas;

      // guarda las órdenes filtradas 
    setOrdenes(filtradas);
  
    setLoading(false);
  }, [id]);

  // Función para darle formato al precio 
  const formatPrice = (value: number) =>
    "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Función para mostrar la fecha en formato (dd-mm-aaaa)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // pantalla de historial de compras del usuario
  return (
    <>
      <NavBarAdmin />

      <section className="admin-dashboard">
        <div className="admin-content">
          <div className="admin-header">
            <h1>Historial de compras</h1>
          </div>

          {loading ? (
            <p className="text-center text-light">Cargando historial...</p>
          ) : ordenes.length === 0 ? (
            <p className="text-center text-light">
              No hay compras registradas para este usuario.
            </p>
          ) : (
            <div className="table-container">
              <Table hover responsive variant="dark">
                <thead>
                  <tr>
                    <th>ID Orden</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Productos</th>
                    <th>Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenes.map((orden) => (
                    <tr key={orden.id}>
                      <td>{orden.id}</td>
                      <td>{formatDate(orden.fecha)}</td>
                      <td>{formatPrice(orden.total)}</td>
                      <td>
                        {orden.items.map((item) => (
                          <div key={item.id}>
                            {item.nombre} × {item.quantity}
                          </div>
                        ))}
                      </td>
                      <td>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() =>
                            navigate(`/admin/detalleCompra/${orden.id}`)
                          }
                        >
                          Ver
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          <div className="text-center mt-4">
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/usuarios")}
            >
              Volver
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
