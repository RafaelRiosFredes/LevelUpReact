import { useState } from "react";
import { Navbar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import "../assets/RegistroUsuario.css";

export const RegistroUsuario = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    contrasena: "",
    confirmarContrasena: "",
    telefono: "",
    fechaNacimiento: "",
    region: "",
    comuna: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [descuento, setDescuento] = useState(false);
  const [comunas, setComunas] = useState<string[]>([]);

  // Regiones con comunas
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

  // Maneja cambios del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;


    if (name === "region") {
      setFormData((prev) => ({ ...prev, region: value, comuna: "" }));
      setComunas(regionesConComunas[value] || []);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Verificar correo DUOC
    if (name === "email") {
      setDescuento(value.toLowerCase().endsWith("@duocuc.cl"));
    }
  };

  // Calcular edad a partir de fecha
  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) edad--;
    return edad;
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { nombre, email, contrasena, confirmarContrasena, fechaNacimiento } = formData;

    // Validaciones
    if (!nombre || !email || !contrasena || !confirmarContrasena || !fechaNacimiento) {
      setMensaje("Completa todos los campos obligatorios.");
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    const edad = calcularEdad(fechaNacimiento);
    if (edad < 18) {
      setMensaje("Solo +18 pueden registrarse.");
      return;
    }

     // Limpia mensaje de error 
  setMensaje("");

    // Obtener usuarios guardados
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios") || "[]");

    // Crear usuario con ID 
    const nuevoUsuario = {
      id: usuariosGuardados.length > 0 ? usuariosGuardados[usuariosGuardados.length - 1].id + 1 : 1,
      nombre: formData.nombre,
      email: formData.email,
      contrasena: formData.contrasena,
      telefono: formData.telefono,
      fechaNacimiento: formData.fechaNacimiento,
      region: formData.region,
      comuna: formData.comuna,
      descuento: descuento ? 20 : 0,
      fechaRegistro: new Date().toISOString().split('T')[0] // Fecha de registro
    };

    // Guardar en localStorage
    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));
    localStorage.setItem("usuario", nombre);

    // Mensaje final
    if (descuento) {
      setMensaje("¡Bienvenido a LEVEL-UP! Tienes un 20% de descuento por ser estudiante DUOC UC.");
    } else {
      setMensaje(`¡Bienvenido a LEVEL-UP, ${nombre}!`);
    }

    // Redirección
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <section className="RegistroUsuario-box">
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend className="Registro1">Registro de Usuario</legend>

            <label>Nombre Completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Ingresa tu nombre completo"
              value={formData.nombre}
              onChange={handleChange}
            />

            <label>Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ingresa tu correo electrónico"
              value={formData.email}
              onChange={handleChange}
            />

            <label>Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              placeholder="Ingresa tu contraseña"
              value={formData.contrasena}
              onChange={handleChange}
            />

            <label>Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmarContrasena"
              name="confirmarContrasena"
              placeholder="Ingresa nuevamente tu contraseña"
              value={formData.confirmarContrasena}
              onChange={handleChange}
            />

            <label>Teléfono (Opcional)</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              placeholder="Ingresa tu número de teléfono"
              value={formData.telefono}
              onChange={handleChange}
            />

            <label>Fecha de Nacimiento</label>
            <input
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
            />

            <div className="selector-region">
                 <label className="titulo-RC"> Selecciona tu región y comuna</label>
              <select id="region" name="region" value={formData.region} onChange={handleChange}>
                <option value="">Selecciona tu Región</option>
                {Object.keys(regionesConComunas).map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <select id="comuna" name="comuna" value={formData.comuna} onChange={handleChange}>
                <option value="">Selecciona tu Comuna</option>
                {comunas.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button className="boton-registro" type="submit">
              Registrarse
            </button>

            {mensaje && (
              <p
                style={{
                  color: mensaje.includes("¡Bienvenido") ? "#39ff14" : "#ff4040",
                  marginTop: "15px",
                }}
              >
                {mensaje}
              </p>
            )}
          </fieldset>
        </form>
      </section>

      <Footer />
    </>
  );
};