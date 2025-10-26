import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("usuarios") || "[]");
    setUsuarios(data);
  }, []);

  return (
    <>
      <NavBarAdmin />

      <section className="admin-dashboard">
        <div className="admin-content">
          <div className="admin-header">
            <h1>Gestión de Usuarios</h1>
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
                    <th>Fecha de nacimiento</th>
                    <th>Región</th>
                    <th>Comuna</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.nombre}</td>
                      <td>{user.email}</td>
                      <td>{user.telefono || "-"}</td>
                      <td>{user.fechaNacimiento || "-"}</td>
                      <td>{user.region}</td>
                      <td>{user.comuna}</td>
                      <td>
                        {/* boton para editar*/}
                        <button
                          className="btn btn-sm btn-outline-success me-2"
                          onClick={() => navigate(`/admin/editarUsuario/${user.id}`)}
                        >
                          <i className="bi bi-pencil-square"></i> Editar
                        </button>

                        {/* boton para historial*/}
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => navigate(`/admin/historialUsuario/${user.id}`)}
                        >
                          <i className="bi bi-clock-history"></i> Historial
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
