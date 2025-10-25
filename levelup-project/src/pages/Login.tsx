import { useState } from "react";
import { Navbar } from "../components/NavBar";
import "../assets/styles.css"; 

export const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos vacíos
    if (!correo || !contrasena) {
      setMensaje("Completa todos los campos.");
      return;
    }

    // Obtener usuarios guardados
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios") || "[]");

    // Buscar coincidencia
    const usuario = usuariosGuardados.find(
      (u: any) => u.email === correo && u.contrasena === contrasena
    );

    if (!usuario) {
      setMensaje(" Correo o contraseña incorrectos.");
      return;
    }

    // Guardar sesión y mostrar mensaje
    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    setMensaje(`Inicio de sesión exitoso, ¡Hola ${usuario.nombre}!`);

    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

    // 🔹 Redirección a login de administrador
  const handleAdminLogin = () => {
    window.location.href = "/login-admin"; // Cambia la ruta si usas React Router
  };

  return (
    <>
      <Navbar />

      {/* CONTENEDOR LOGIN */}
      <section className="login-section">
        <div className="login-box">
          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend className="login-title">Accede a tu cuenta</legend>

              <div className="email-login">
                <label htmlFor="correo">Correo Electrónico</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  placeholder="Ingrese su correo electrónico"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>

              <div className="password-login">
                <label htmlFor="contrasena">Contraseña</label>
                <input
                  type="password"
                  id="contrasena"
                  name="contrasena"
                  placeholder="Ingrese su contraseña"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                />
              </div>

              <button className="boton-login" type="submit">
                Ingresar
              </button>

                {/*botón de administrador */}
              <button
                type="button"
                className="boton-admin"
                onClick={handleAdminLogin}
              >
                Ingreso Admin
              </button>

              {mensaje && (
                <p
                  className={`mensaje-login ${
                    mensaje.startsWith("✅") ? "exito" : ""
                  }`}
                >
                  {mensaje}
                </p>
              )}
            </fieldset>
          </form>
        </div>
      </section>
    </>
  );
};
