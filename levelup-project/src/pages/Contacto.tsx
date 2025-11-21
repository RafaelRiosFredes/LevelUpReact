import { useState } from "react";
import { NavBar } from "../components/NavBar";
import "../assets/styles.css";

export const Contacto = () => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("¡Mensaje enviado!");
    setForm({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <>
      <NavBar />

      <section className="noticias-gamer" style={{ minHeight: "100vh" }}>
        <div className="noticias-content">

          {/* ENCABEZADO */}
          <div className="noticias-header">
            <h1 className="titulo-noticias">Contacto</h1>
            <p className="subtitulo-noticias">
              Envíanos tus dudas, sugerencias o comentarios.
            </p>
          </div>

          {/* FORMULARIO */}
          <form 
            onSubmit={handleSubmit} 
            className="contacto-form"
            style={{
              background: "#111",
              border: "1px solid #39ff14",
              padding: "25px",
              borderRadius: "8px",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <div className="mb-3">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="input-gamer"
              />
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="input-gamer"
              />
            </div>

            <div className="mb-3">
              <label>Mensaje</label>
              <textarea
                name="mensaje"
                rows={4}
                value={form.mensaje}
                onChange={handleChange}
                required
                className="input-gamer"
              />
            </div>

            <button type="submit" className="btn-gamer">
              Enviar
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Contacto;
