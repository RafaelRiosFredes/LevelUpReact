import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { NavBarAdmin } from "../components/NavBarAdmin";
import "../assets/styles.css";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  fechaNacimiento?: string;
  region: string;
  comuna: string;
  descuento?: number;
}

export const EditarUsuarioAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [hayUsuarios, setHayUsuarios] = useState(true);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("usuarios") || "[]");

    // Si no hay usuarios
    if (!data || data.length === 0) {
      setHayUsuarios(false);
      return;
    }

    // Buscar usuario
    const user = data.find((u: Usuario) => String(u.id) === String(id));
    setUsuario(user || null);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (usuario) {
      setUsuario({ ...usuario, [e.target.name]: e.target.value });
    }
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    const data = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const actualizados = data.map((u: Usuario) =>
      u.id === usuario.id ? usuario : u
    );
    localStorage.setItem("usuarios", JSON.stringify(actualizados));
    setMensaje("Usuario actualizado correctamente.");
  };

  return (
    <>
      <NavBarAdmin />
      <section className="admin-dashboard">
        <div className="admin-content">
          <div className="admin-header">
            <h1>Editar usuario</h1>
          </div>

          {/* Mensaje si no hay usuarios */}
          {!hayUsuarios && (
            <p className="text-center text-light">
              No hay usuarios registrados.
            </p>
          )}

          {/*  Formulario si hay usuarios */}
          {hayUsuarios && usuario && (
            <form onSubmit={handleGuardar} className="edit-form neon-box">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={usuario.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Correo</label>
                <input
                  type="email"
                  name="email"
                  value={usuario.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={usuario.telefono}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={usuario.fechaNacimiento}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Región</label>
                <select
                  name="region"
                  value={usuario.region}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una región</option>
                  <option value="Ñuble">Ñuble</option>
                  <option value="Metropolitana de Santiago">Metropolitana</option>
                </select>
              </div>

              <div className="form-group">
                <label>Comuna</label>
                <input
                  type="text"
                  name="comuna"
                  value={usuario.comuna}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  Guardar cambios
                </button>
              </div>
            </form>
          )}

          {mensaje && <p className="mensaje-exito">{mensaje}</p>}
        </div>
      </section>
    </>
  );
};
