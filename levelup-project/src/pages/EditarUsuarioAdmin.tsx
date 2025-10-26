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
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Como solo estamos en "/", toma el primer usuario disponible
  useEffect(() => {
    const lista = leerUsuarios();
    setUsuario(lista[0] ?? null);
  }, []);

  const crearUsuarioDemo = () => {
    const demo: Usuario = {
      id: 1,
      nombre: "Francisca Arancibia",
      email: "fran@levelup.cl",
      telefono: "+56912345678",
      fechaNacimiento: "2001-07-12",
      region: "Valparaíso",
      comuna: "Los Andes",
      descuento: 10,
    };
    guardarUsuarios([demo]);
    setUsuario(demo);
  };

  const handleChange = (campo: keyof Usuario, valor: string | number) => {
    if (!usuario) return;
    setUsuario({ ...usuario, [campo]: valor as any });
  };

  const handleSave = () => {
    if (!usuario) return;
    const lista = leerUsuarios();
    const i = lista.findIndex(u => u.id === usuario.id);
    if (i >= 0) lista[i] = usuario; else lista.push(usuario);
    guardarUsuarios(lista);
    alert("✅ Usuario actualizado");
  };

  const handleDelete = () => {
    if (!usuario) return;
    if (!confirm(`¿Eliminar a "${usuario.nombre}" (ID ${usuario.id})?`)) return;
    const lista = leerUsuarios().filter(u => u.id !== usuario.id);
    guardarUsuarios(lista);
    setUsuario(lista[0] ?? null);
    alert("🗑️ Usuario eliminado");
  };

  return (
    <>
      <NavBarAdmin />
      <section className="admin-dashboard">
        <div className="admin-content">
          <div className="admin-header">
            <h1>✏️ Editar Usuario</h1>
            <p>Vista de edición funcionando directamente en <code>/</code>.</p>
          </div>

          {!usuario ? (
            <div className="table-container" style={{ padding: 24, textAlign: "center" }}>
              <p className="no-users">No hay usuarios en el sistema.</p>
              <button className="btn btn-success" onClick={crearUsuarioDemo}>
                Crear usuario de prueba
              </button>
            </div>
          ) : (
            <div className="table-container" style={{ padding: 24 }}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-light">Nombre</label>
                  <input
                    className="form-control"
                    value={usuario.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-light">Correo</label>
                  <input
                    className="form-control"
                    value={usuario.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-light">Teléfono</label>
                  <input
                    className="form-control"
                    value={usuario.telefono || ""}
                    onChange={(e) => handleChange("telefono", e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-light">Nacimiento</label>
                  <input
                    type="date"
                    className="form-control"
                    value={usuario.fechaNacimiento || ""}
                    onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-light">Descuento (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={usuario.descuento ?? 0}
                    onChange={(e) => handleChange("descuento", Number(e.target.value))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-light">Región</label>
                  <input
                    className="form-control"
                    value={usuario.region}
                    onChange={(e) => handleChange("region", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-light">Comuna</label>
                  <input
                    className="form-control"
                    value={usuario.comuna}
                    onChange={(e) => handleChange("comuna", e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex gap-2 mt-4">
                <button className="btn btn-success" onClick={handleSave}>
                  <i className="bi bi-check2"></i> Guardar cambios
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  <i className="bi bi-trash3"></i> Eliminar usuario
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
