import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../services/api";

export const BoletaDetalle = () => {
  const { id } = useParams();
  const [boleta, setBoleta] = useState<any>(null);

  useEffect(() => {
    apiFetch(`/boletas/${id}`).then(setBoleta);
  }, [id]);

  if (!boleta) return <p className="text-white p-5">Cargando boleta...</p>;

  return (
    <div className="container text-white mt-5">
      <h2>Boleta #{boleta.idBoleta}</h2>
      <p>Fecha: {boleta.fechaEmision}</p>
      <p>Cliente: {boleta.nombreUsuario}</p>

      <table className="table table-dark mt-4">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {boleta.detalles.map((d:any, i:number) => (
            <tr key={i}>
              <td>{d.nombreProducto}</td>
              <td>{d.cantidad}</td>
              <td>${d.precioUnitario}</td>
              <td>${d.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Total: ${boleta.total}</h3>
    </div>
  );
};
