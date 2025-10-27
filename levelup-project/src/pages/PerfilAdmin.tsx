import { useEffect, useState } from "react";
import { NavBarAdmin } from "../components/NavBarAdmin";
import "../assets/styles.css";

interface Admin {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  telefono: string;
  fechaIngreso: string;
  region: string;
}

export const PerfilAdmin = () => {
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    // Carga un administrador de ejemplo (puedes reemplazar por datos reales)
    const adminData: Admin = {
      id: 1,
      nombre: "Francisca Arancibia",
      correo: "fran@levelup.cl",
      rol: "Administradora General",
      telefono: "+56 9 8765 4321",
      fechaIngreso: "2023-05-15",
      region: "Región de Ñuble",
    };
    setAdmin(adminData);
  }, []);

  if (!admin) return <p className="text-center text-light">Cargando perfil...</p>;

  return (
    <>
      <NavBarAdmin />
      <section className="admin-dashboard perfil-admin">
        <div className="admin-content">
          <div className="perfil-header">
            <h1>Perfil del Administrador</h1>
            <p>Información personal y detalles del rol dentro del sistema.</p>
          </div>

          <div className="perfil-card neon-box">
            <div className="perfil-info">
              <p><strong>Nombre:</strong> {admin.nombre}</p>
              <p><strong>Correo:</strong> {admin.correo}</p>
              <p><strong>Teléfono:</strong> {admin.telefono}</p>
              <p><strong>Región:</strong> {admin.region}</p>
              <p><strong>Rol:</strong> {admin.rol}</p>
              <p><strong>Fecha de ingreso:</strong> {admin.fechaIngreso}</p>
            </div>
          </div>

          <div className="perfil-footer">
            <button
              className="btn btn-success"
              onClick={() => alert("Función de edición en desarrollo.")}
            >
              Editar perfil
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
