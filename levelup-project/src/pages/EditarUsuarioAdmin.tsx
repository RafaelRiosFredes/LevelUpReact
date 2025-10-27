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
  const [mensaje, setMensaje] = useState<string>("");

  // Regiones y sus comunas
const regionesYComunas: Record<string, string[]> = {
  "Arica y Parinacota": [
    "Arica",
    "Camarones",
    "Putre",
    "General Lagos",
  ],
  "Tarapacá": [
    "Iquique",
    "Alto Hospicio",
    "Pozo Almonte",
    "Pica",
    "Huara",
  ],
  "Antofagasta": [
    "Antofagasta",
    "Mejillones",
    "Sierra Gorda",
    "Taltal",
    "Calama",
    "San Pedro de Atacama",
  ],
  "Atacama": [
    "Copiapó",
    "Caldera",
    "Tierra Amarilla",
    "Chañaral",
    "Diego de Almagro",
    "Vallenar",
    "Huasco",
  ],
  "Coquimbo": [
    "La Serena",
    "Coquimbo",
    "Ovalle",
    "Illapel",
    "Los Vilos",
    "Andacollo",
    "Monte Patria",
  ],
  "Valparaíso": [
    "Valparaíso",
    "Viña del Mar",
    "Quilpué",
    "Villa Alemana",
    "Quillota",
    "San Antonio",
    "Los Andes",
    "San Felipe",
    "La Ligua",
    "Petorca",
  ],
  "Metropolitana de Santiago": [
    "Santiago",
    "Puente Alto",
    "Maipú",
    "Las Condes",
    "La Florida",
    "Ñuñoa",
    "Pudahuel",
    "Recoleta",
    "La Pintana",
    "San Bernardo",
  ],
  "Libertador General Bernardo O’Higgins": [
    "Rancagua",
    "Machalí",
    "San Fernando",
    "Santa Cruz",
    "Rengo",
    "Graneros",
    "San Vicente",
  ],
  "Maule": [
    "Talca",
    "Curicó",
    "Linares",
    "Cauquenes",
    "Constitución",
    "San Javier",
    "Parral",
  ],
  "Ñuble": [
    "Chillán",
    "Bulnes",
    "Quirihue",
    "San Carlos",
    "Coihueco",
  ],
  "Biobío": [
    "Concepción",
    "Talcahuano",
    "Hualpén",
    "Los Ángeles",
    "Coronel",
    "Lota",
    "Tomé",
    "Cabrero",
  ],
  "La Araucanía": [
    "Temuco",
    "Padre Las Casas",
    "Villarrica",
    "Pucón",
    "Angol",
    "Nueva Imperial",
    "Gorbea",
  ],
  "Los Ríos": [
    "Valdivia",
    "La Unión",
    "Río Bueno",
    "Panguipulli",
    "Lanco",
  ],
  "Los Lagos": [
    "Puerto Montt",
    "Puerto Varas",
    "Osorno",
    "Castro",
    "Ancud",
    "Quellón",
    "Frutillar",
  ],
  "Aysén del General Carlos Ibáñez del Campo": [
    "Coyhaique",
    "Aysén",
    "Chile Chico",
    "Cisnes",
    "Cochrane",
  ],
  "Magallanes y de la Antártica Chilena": [
    "Punta Arenas",
    "Puerto Natales",
    "Porvenir",
    "Cabo de Hornos (Puerto Williams)",
  ],
};


  // 🔹 Usuario de prueba solo para diseño
  useEffect(() => {
    const usuarioPrueba = {
      id: 1,
      nombre: "Francisca Arancibia",
      email: "fran@levelup.cl",
      telefono: "+56 9 1234 5678",
      fechaNacimiento: "2001-07-12",
      region: "Valparaíso",
      comuna: "Los Andes",
      descuento: 15,
    };
    /**/ 
    
    localStorage.setItem("usuarios", JSON.stringify([usuarioPrueba]));
    const data = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const user = data.find((u: Usuario) => String(u.id) === "1");
    setUsuario(user || null);
  }, []);

  // Actualiza valores 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (usuario) {
      setUsuario({ ...usuario, [e.target.name]: e.target.value });
    }
  };

  // guarda los cambios
  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    const data = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const actualizados = data.map((u: Usuario) => (u.id === usuario.id ? usuario : u));
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
            <p>Modifica los datos y recuerda guardar los cambios.</p>
          </div>

          {usuario && (
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

              {/* se selecciona region*/}
              <div className="form-group">
                <label>Región</label>
                <select
                  name="region"
                  value={usuario.region}
                  onChange={(e) => {
                    handleChange(e)
                    setUsuario({ ...usuario, region: e.target.value, comuna: "" });
                  }}
                  required
                >
                  <option value="">Seleccione una región</option>
                  {Object.keys(regionesYComunas).map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Se selcciona comuna*/}
              <div className="form-group">
                <label>Comuna</label>
                <select
                  name="comuna"
                  value={usuario.comuna}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una comuna</option>
                  {regionesYComunas[usuario.region]?.map((comuna) => (
                    <option key={comuna} value={comuna}>
                      {comuna}
                    </option>
                  ))}
                </select>
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
