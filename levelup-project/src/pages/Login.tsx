import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login, apiFetch } from "../services/api"; 

import "../assets/styles.css";

export const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!correo || !contrasena) {
      setError("Completa todos los campos.");
      return;
    }

    try {
      // llamar a la función login que envía cookies
      const resp = await login({ correo, contrasena });

      // guardar JWT si tu backend lo devuelve
      const TOKEN_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || "levelup_token";
      const USER_KEY = import.meta.env.VITE_USER_STORAGE_KEY || "levelup_user";

      if (resp.token) localStorage.setItem(TOKEN_KEY, resp.token);

      const roles = Array.isArray(resp.roles) 
      ? resp.roles.map((r:any) => r.nombreRol) 
      : [];

      const isAdmin = roles.includes("ROLE_ADMIN") || roles.includes("ADMIN");

      const correoUsuario = resp.username || correo;

      // guardar info básica del usuario
      localStorage.setItem(
        USER_KEY,
        JSON.stringify({
          id: resp.idUsuario,
          correo: correoUsuario,
          roles,
        })
      );

      // guardar "usuario" simple para el NavBar actual
      localStorage.setItem("usuario", correoUsuario);

      // guardar si es admin o no
      if (isAdmin) {
        localStorage.setItem("isAdmin", "true");
        // redirigir a panel admin
      } else {
        localStorage.removeItem("isAdmin");
      }

      // Avisar al NavBar que el usuario cambió
      window.dispatchEvent(new Event("usuarioActualizado"));

      
    // obtener datos completos del usuario
      const datos = await apiFetch(`/usuarios/${resp.idUsuario}`);
      localStorage.setItem("usuario", JSON.stringify(datos));

      setMensaje(resp.message || "Inicio de sesión exitoso.");

      if(isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }

    } catch (err) {
      console.error(err);
      setError(
        "Error al iniciar sesión. Revisa tu correo y contraseña o inténtalo más tarde."
      );
    }
  };

  return (
    <section className="login-section">
      <div className="login-box">
        <form onSubmit={handleLogin}>
          <fieldset>
            <legend className="login-title">Ingresa a tu cuenta</legend>

            <div className="email-login">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                type="email"
                id="correo"
                name="correo"
                placeholder="Ingrese su correo electrónico"
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  setError("");
                  setMensaje("");
                }}
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
                onChange={(e) => {
                  setContrasena(e.target.value);
                  setError("");
                  setMensaje("");
                }}
              />
            </div>

            <button className="boton-login" type="submit">
              Ingresar
            </button>

            {error && <p className="mensaje-login error">{error}</p>}
            {mensaje && !error && (
              <p className="mensaje-login exito">{mensaje}</p>
            )}
          </fieldset>
        </form>
      </div>
    </section>
  );
};
