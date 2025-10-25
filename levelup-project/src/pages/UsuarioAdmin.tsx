import { useEffect, useState } from "react";
import { NavBarAdmin } from "../components/NavBarAdmin";
import "../assets/styles.css";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  region: string;
  comuna: string;
  descuento: number;
}

export const UsuarioAdmin = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("usuarios") || "[]");
    setUsuarios(data);
  }, []);

  return (
    <>
      <NavBarAdmin />

      <section className="admin-dashboard">
        <div className="admin-header">
          <h1>👥 Gestión de Usuarios</h1>
          <p>Visualiza y administra todos los usuarios registrados en el sistema.</p>
        </div>

        {usuarios.length === 0 ? (
          <p className="no-users">No hay usuarios registrados actualmente.</p>
        ) : (
          <div className="table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Región</th>
                  <th>Comuna</th>
                  <th>Descuento</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.nombre}</td>
                    <td>{user.email}</td>
                    <td>{user.telefono || "-"}</td>
                    <td>{user.region}</td>
                    <td>{user.comuna}</td>
                    <td>{user.descuento ? `${user.descuento}%` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
};
