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

function leerUsuarios(): Usuario[] {
  try { return JSON.parse(localStorage.getItem("usuarios") || "[]"); }
  catch { return []; }
}
function guardarUsuarios(arr: Usuario[]) {
  localStorage.setItem("usuarios", JSON.stringify(arr));
}

export const EditarUsuarioAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [mensaje, setMensaje] = useState<string>("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const user = data.find((u: Usuario) => String(u.id) === String(id));
    setUsuario(user || null);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (usuario) {
      setUsuario({ ...usuario, [e.target.name]: e.target.value });
    }
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    const data = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const actualizados = data.map((u: Usuario) => (u.id === usuario.id ? usuario : u));
    localStorage.setItem("usuarios", JSON.stringify(actualizados));
    setMensaje(" Usuario actualizado.");
  };

  return (
    <>
      <NavBarAdmin />
      <section className="admin-dashboard">
        <div className="admin-content">
          <div className="admin-header">
            <h1>Edita un  usuario</h1>
            <p>¡Recuerda guardar los cambios!</p>
          </div>

          {usuario && (
            <form onSubmit={handleGuardar} className="edit-form neon-box">
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" name="nombre" value={usuario.nombre} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Correo</label>
                <input type="email" name="email" value={usuario.email} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input type="text" name="telefono" value={usuario.telefono} onChange={handleChange} />
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
                <input type="text" name="region" value={usuario.region} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Comuna</label>
                <input type="text" name="comuna" value={usuario.comuna} onChange={handleChange} />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">Guardar cambios</button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/admin/usuarios")}
                >
                  Volver
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
