import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavBarAdmin } from "../components/NavBarAdmin";
import "../assets/styles.css";

export const LoginAdmin = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos vacíos
    if (!usuario || !contrasena) {
      setMensaje("Completa todos los campos.");
      return;
    }

    // Validar credenciales de administrador
    if (usuario === "admin" && contrasena === "duoc123") {
      setMensaje("Bienvenido Administrador.");
      localStorage.setItem("adminActivo", "true");

    setTimeout(() => {
      navigate("/dashboardAdmin"); 
    }, 1500);
    } else {
      setMensaje("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <>
      <NavBarAdmin />

      <section className="login-section">
        <div className="login-box login-admin-box">
          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend className="login-title">Ingresa a tu cuenta</legend>

              <div className="email-login">
                <label htmlFor="usuario">Usuario</label>
                <input
                  type="text"
                  id="usuario"
                  name="usuario"
                  placeholder="Ingresa tu usuario"
                  value={usuario}
                  onChange={(e) => {
                    setUsuario(e.target.value);
                    setMensaje(""); // 🔹 Limpia el mensaje al escribir
                  }}
                />
              </div>

              <div className="password-login">
                <label htmlFor="contrasena">Contraseña</label>
                <input
                  type="password"
                  id="contrasena"
                  name="contrasena"
                  placeholder="Ingresa tu contraseña"
                  value={contrasena}
                  onChange={(e) => {
                    setContrasena(e.target.value);
                    setMensaje(""); // 🔹 Limpia el mensaje al escribir
                  }}
                />
              </div>

              <button className="boton-login" type="submit">
                Ingresar
              </button>

              {mensaje && (
                <p
                  className={`mensaje-login ${
                    mensaje.includes("Bienvenido") ? "exito" : "error"
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
