import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import "../assets/styles.css";

export const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!correo || !contrasena) {
      setError("Completa todos los campos.");
      return;
    }

    try {
      // El backend espera { correo, contrasena }
      const body = {
        correo,
        contrasena,
      };

      const resp = await apiFetch<{
        token: string;
        username: string;
        message?: string;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      });

      // Claves donde se guarda el token / usuario
      const TOKEN_KEY =
        import.meta.env.VITE_JWT_STORAGE_KEY || "levelup_token";
      const USER_KEY =
        import.meta.env.VITE_USER_STORAGE_KEY || "levelup_user";

      // Guardar JWT
      localStorage.setItem(TOKEN_KEY, resp.token);

      // Guardar info básica del usuario
      localStorage.setItem(
        USER_KEY,
        JSON.stringify({
          correo: resp.username,
        })
      );

      setMensaje(resp.message || "Inicio de sesión exitoso.");

      // Redirigir a home (ajusta la ruta si quieres otra)
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
              <label htmlFor="correo">Correo Electrónico</label>
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
