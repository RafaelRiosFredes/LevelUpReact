import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // necesario para dropdown y collapse

export const Navbar = () => {
  const [usuario, setUsuario] = useState<string | null>(null);

  useEffect(() => {
    const u = localStorage.getItem("usuario");
    setUsuario(u);
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black fixed-top">
      <div className="container">
        <a className="navbar-brand" href="/">LEVEL-UP GAMER</a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <form className="d-flex mx-auto search-bar">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Buscar en LEVEL-UP GAMER"
            />
            <button className="btn btn-outline-success" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>

          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item"><a className="nav-link" href="/">Inicio</a></li>
            <li className="nav-item"><a className="nav-link" href="/productos">Productos</a></li>
            <li className="nav-item"><a className="nav-link" href="/noticias">Noticias</a></li>
            <li className="nav-item"><a className="nav-link" href="/contacto">Contacto</a></li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={(e) => e.preventDefault()} // evita que haga scroll al top
              >
                {usuario ? `Hola, ${usuario}` : "Inicia sesión"}
              </a>
              <ul className="dropdown-menu dropdown-menu-end bg-dark text-white">
                {!usuario && (
                  <>
                    <li><a className="dropdown-item text-white" href="/login">Inicia sesión</a></li>
                    <li><a className="dropdown-item text-white" href="/registro">Regístrate</a></li>
                  </>
                )}
                {usuario && (
                  <li>
                    <a className="dropdown-item text-white" href="#" onClick={cerrarSesion}>
                      Cerrar sesión
                    </a>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
