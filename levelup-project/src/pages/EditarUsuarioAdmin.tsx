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

  // obtiene id del usuario desde la URL
  const { id } = useParams<{ id: string }>();
  
  // para redirigir
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [hayUsuarios, setHayUsuarios] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [comunas, setComunas] = useState<string[]>([]);

  // Regiones con comunas (idéntico al registro)
  const regionesConComunas: Record<string, string[]> = {
    "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
    "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
    "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paihuano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
    "Valparaíso": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"],
    "Metropolitana": ["Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"],
    "O’Higgins": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchigüe", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
    "Maule": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"],
    "Ñuble": ["Chillán", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Bulnes", "Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Quirihue", "Ránquil", "Treguaco", "San Carlos", "Coihueco", "Ñiquén", "San Fabián", "San Nicolás"],
    "Biobío": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"],
    "La Araucanía": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"],
    "Los Ríos": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
    "Los Lagos": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"],
    "Aysén del General Carlos Ibáñez del Campo": ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O’Higgins", "Tortel", "Chile Chico", "Río Ibáñez"],
    "Magallanes y de la Antártica Chilena": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
  };

  // Cargar usuario según id
  useEffect(() => {
    const data: Usuario[] = JSON.parse(localStorage.getItem("usuarios") || "[]");
   
    // verificar si hay usuarios
    setHayUsuarios(data.length > 0);

    // si encuentra el usuario lo actualiza
    const user = data.find((u: Usuario) => String(u.id) === String(id));
    if (user) {
      setUsuario(user);
      setComunas(regionesConComunas[user.region] || []);
    }
  }, [id]); // se ejecuta cada vez que el id cambia

  // se ejecuta cuando se escribe en los inputs o se hace select
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!usuario) return;
    const { name, value } = e.target;

    if (name === "region") {
      setUsuario({ ...usuario, region: value, comuna: "" });
      setComunas(regionesConComunas[value] || []);
    } else {
      setUsuario({ ...usuario, [name]: value });
    }
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    // se obtiene los usuarios guardados
    const data: Usuario[] = JSON.parse(localStorage.getItem("usuarios") || "[]");
    
    const actualizados = data.map((u: Usuario) =>
      u.id === usuario.id ? usuario : u
    );

    // se guardan los cambios en el localStorage
    localStorage.setItem("usuarios", JSON.stringify(actualizados));
    setMensaje("Usuario actualizado.");
  };


  // pantalla de edición
  return (
    <>
      <NavBarAdmin />

      <section className="admin-dashboard">
        <div className="admin-content">
          <div className="admin-header">
            <h1>Edita un usuario</h1>
          </div>

          {!hayUsuarios && (
            <p className="text-center text-light">No hay usuarios registrados.</p>
          )}

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
                  value={usuario.telefono || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Fecha de nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={usuario.fechaNacimiento || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="selector-region">
                <label className="titulo-RC">Selecciona tu región y comuna</label>

                <div className="select-row">
                  <select
                    name="region"
                    value={usuario.region}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona tu Región</option>
                    {Object.keys(regionesConComunas).map((r, i) => (
                      <option key={i} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>

                  <select
                    name="comuna"
                    value={usuario.comuna}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona tu Comuna</option>
                    {comunas.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>


              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  Guardar 
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