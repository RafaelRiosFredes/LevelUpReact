import { useEffect, useState } from "react";

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
        {/* LOGO */}
        <a className="navbar-brand" href="#">LEVEL-UP GAMER</a>

        {/* BOTÓN HAMBURGUESA */}
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

        {/* MENÚ */}
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
            <li className="nav-item"><a className="nav-link active" href="#">Inicio</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Productos</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Noticias</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Contacto</a></li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button">
                {usuario ? `Hola, ${usuario}` : "Hola, Inicia sesión"}
              </a>
              <ul className="dropdown-menu dropdown-menu-end bg-dark text-white">
                {!usuario && (
                  <>
                    <li><a className="dropdown-item text-white" href="#">Inicia sesión</a></li>
                    <li><a className="dropdown-item text-white" href="#">Regístrate</a></li>
                  </>
                )}
                
                {usuario && (
                  <li>
                    <a className="dropdown-item text-white" href="#" onClick={cerrarSesion}>
                      Cerrar sesión
                    </a>
                  </li>
                )}
                <li><hr className="dropdown-divider bg-light" /></li>
                <li><a className="dropdown-item text-white" href="#">Puntos LevelUp</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
