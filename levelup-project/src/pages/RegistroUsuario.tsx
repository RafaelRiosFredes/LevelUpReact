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
    "Arica y Parinacota": ["Arica", "Putre", "Camarones", "General Lagos"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Pica"],
    "Antofagasta": ["Antofagasta", "Mejillones", "Taltal", "Calama", "Tocopilla"],
    "Atacama": ["Copiapó", "Caldera", "Vallenar", "Huasco", "Chañaral"],
    "Coquimbo": ["La Serena", "Coquimbo", "Ovalle", "Illapel", "Vicuña"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio"],
    "Metropolitana": ["Santiago", "Maipú", "Puente Alto", "Las Condes", "Ñuñoa", "Providencia"],
    "O'Higgins": ["Rancagua", "Machalí", "San Vicente", "Santa Cruz"],
    "Maule": ["Talca", "Curicó", "Linares", "Cauquenes"],
    "Ñuble": ["Chillán", "Bulnes", "San Carlos", "Quillón"],
    "Biobío": ["Concepción", "Los Ángeles", "Coronel", "Talcahuano", "San Pedro de la Paz"],
    "La Araucanía": ["Temuco", "Padre Las Casas", "Villarrica", "Pucón"],
    "Los Ríos": ["Valdivia", "La Unión", "Panguipulli", "Futrono"],
    "Los Lagos": ["Puerto Montt", "Osorno", "Castro", "Ancud", "Frutillar"],
    "Aysén": ["Coyhaique", "Aysén", "Chile Chico"],
    "Magallanes": ["Punta Arenas", "Puerto Natales", "Porvenir"],
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
    }, 2500);
  };

  return (
    <>
      <Navbar />

      <section className="title text-center">
        <div className="title-wrapper">
          <img
            src="https://www.azernews.az/media/2023/11/27/2023_rog_zephyrus_duo_16_gx650_scenario_photo_01.jpg?v=1701092248"
            alt="Banner gamer"
            className="title-img"
          />
        </div>
      </section>

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