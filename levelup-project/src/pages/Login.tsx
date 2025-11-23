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
      // 1) Login al backend
      const resp = await login({ correo, contrasena });

      // 2) Claves de storage
      const TOKEN_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || "levelup_token";
      const USER_KEY = import.meta.env.VITE_USER_STORAGE_KEY || "levelup_user";

      // 3) Guardar token (si existe)
      if (resp.token) {
        localStorage.setItem(TOKEN_KEY, resp.token);
      }

      // 4) Normalizar roles
      const rawRoles = resp.roles;
      let roles: string[] = [];

      if (Array.isArray(rawRoles)) {
        roles = rawRoles
          .map((r: any) => {
            if (typeof r === "string") return r;
            if (r.nombreRol) return r.nombreRol;
            if (r.authority) return r.authority;
            return "";
          })
          .filter(Boolean);
      }

      const rolesNormalizados = roles.map((r) =>
        r.startsWith("ROLE_") ? r : `ROLE_${r}`
      );

      const isAdmin = rolesNormalizados.includes("ROLE_ADMIN");

      const correoUsuario = resp.username || correo;

      // 5) Guardar info básica de sesión
      localStorage.setItem(
        USER_KEY,
        JSON.stringify({
          id: resp.idUsuario,
          correo: correoUsuario,
          roles: rolesNormalizados,
        })
      );

      // bandera admin para el navbar
      if (isAdmin) {
        localStorage.setItem("isAdmin", "true");
      } else {
        localStorage.removeItem("isAdmin");
      }

      // 6) Obtener datos completos del usuario para mostrar nombre bonito
      let displayName = correoUsuario;

      try {
        const datos: any = await apiFetch(`/usuarios/${resp.idUsuario}`);
        // guardas el detalle en otra clave, NO en "usuario"
        localStorage.setItem("usuario", JSON.stringify(datos));

        const nombres = (datos?.nombres ?? datos?.nombre ?? "")
          .toString()
          .trim();
        const apellidos = (datos?.apellidos ?? datos?.apellido ?? "")
          .toString()
          .trim();
        const candidato = `${nombres} ${apellidos}`.trim();

        if (candidato) {
          displayName = candidato;
        }
      } catch (detalleError) {
        console.error(
          "Error obteniendo datos completos del usuario",
          detalleError
        );
        // si falla, se queda con el correo como displayName
      }

      // 7) Esto es lo que usa el NavBar para el "Hola, ..."
      localStorage.setItem("usuario", displayName);

      // Avisar al NavBar que hay nuevo usuario
      window.dispatchEvent(new Event("usuarioActualizado"));

      setMensaje(resp.message || "Inicio de sesión exitoso.");

      // 8) Redirigir SIEMPRE al home (aunque sea admin)
      navigate("/home");
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
