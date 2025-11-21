import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api"; // <- importamos la función login
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
      const TOKEN_KEY =
        import.meta.env.VITE_JWT_STORAGE_KEY || "levelup_token";
      const USER_KEY =
        import.meta.env.VITE_USER_STORAGE_KEY || "levelup_user";

      if (resp.token) localStorage.setItem(TOKEN_KEY, resp.token);

      // guardar info básica del usuario
      localStorage.setItem(
        USER_KEY,
        JSON.stringify({
          correo: resp.username,
          roles: resp.roles,
        })
      );

      setMensaje(resp.message || "Inicio de sesión exitoso.");

      // redirigir a home
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
            {mensaje && !error && <p className="mensaje-login exito">{mensaje}</p>}
          </fieldset>
        </form>
      </div>
    </section>
  );
};
