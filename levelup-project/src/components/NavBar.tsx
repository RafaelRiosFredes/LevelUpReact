/** @jsxImportSource react */
import { useEffect, useState } from "react";
import {
  Navbar as RBNavbar,
  Container,
  Nav,
  NavDropdown,
  Form,
  Button
} from "react-bootstrap";
import { Link } from "react-router-dom";

export const NavBar = () => {
  const [usuario, setUsuario] = useState<string | null>(null);
  const [cantidadCarrito, setCantidadCarrito] = useState(0);
  const [query, setQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Carga de usuario desde localStorage
  useEffect(() => {
    const cargarUsuario = () => {
      const u = localStorage.getItem("usuario");
      setUsuario(u);

      const adminFlag = localStorage.getItem("isAdmin") === "true";
      setIsAdmin(adminFlag)
    };

    // cargar al inicio
    cargarUsuario();

    // escuchar cambios de usuario
    window.addEventListener("usuarioActualizado", cargarUsuario);

    return () => {
      window.removeEventListener("usuarioActualizado", cargarUsuario);
    };
  }, []);


  // Badge del carrito (storage + evento custom)
  useEffect(() => {
    const actualizarBadge = () => {
      const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
      const total = carrito.reduce(
        (acc: number, item: any) => acc + (item?.cantidad ?? 0),
        0
      );
      setCantidadCarrito(total);
    };

    actualizarBadge();
    window.addEventListener("storage", actualizarBadge);
    // TypeScript no conoce este evento custom; lo casteamos.
    (window as any).addEventListener("carritoActualizado", actualizarBadge);

    return () => {
      window.removeEventListener("storage", actualizarBadge);
      (window as any).removeEventListener("carritoActualizado", actualizarBadge);
    };
  }, []);

  const cerrarSesion = () => {
    const TOKEN_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || "levelup_token";
    const USER_KEY = import.meta.env.VITE_USER_STORAGE_KEY || "levelup_user";

    localStorage.removeItem("usuario");
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("carrito");

    setUsuario(null);

    // avisar al NavBar (por si hay otras instancias)
    window.dispatchEvent(new Event("usuarioActualizado"));
  };


  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí puedes navegar a /productos?search=query si quieres.
    // Por ahora solo evita el reload y deja el valor en consola.
    console.log("buscar:", query);
  };

  return (
    <RBNavbar
      expand="lg"
      bg="black"
      variant="dark"
      fixed="top"
      className="py-3"
    >
      <Container>
        {/* LOGO */}
        <RBNavbar.Brand as={Link} to="/" className="text-success fw-bold">
          LEVEL-UP GAMER
        </RBNavbar.Brand>

        {/* BOTÓN HAMBURGUESA */}
        <RBNavbar.Toggle aria-controls="lvlup-navbar" />

        <RBNavbar.Collapse id="lvlup-navbar">
          {/* BUSCADOR */}
          <Form
            className="d-flex mx-auto my-2 my-lg-0"
            onSubmit={onSearchSubmit}
            role="search"
          >
            <Form.Control
              type="search"
              placeholder="Buscar en LEVEL-UP GAMER"
              className="me-2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" variant="outline-success">
              <i className="bi bi-search" />
            </Button>
          </Form>

          {/* MENÚ */}
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={Link} to="/home" className="active">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/productos">
              Productos
            </Nav.Link>
            <Nav.Link as={Link} to="/noticias">
              Noticias
            </Nav.Link>
            <Nav.Link as={Link} to="/contacto">
              Contacto
            </Nav.Link>

            {/* Carrito con badge */}
            <Nav.Link as={Link} to="/carrito" className="position-relative">
              <i className="bi bi-cart3 me-1" style={{ fontSize: "1.2rem" }} />
              Carrito
              {cantidadCarrito > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success"
                  style={{ fontSize: "0.7rem" }}
                >
                  {cantidadCarrito}
                </span>
              )}
            </Nav.Link>

            {/* Usuario / Sesión */}
            <NavDropdown
              title={usuario ? `Hola, ${usuario}` : "Hola, Inicia sesión"}
              align="end"
              menuVariant="dark"
            >
              {!usuario && (
                <>
                  <NavDropdown.Item
                    as={Link}
                    to="/login"
                    className="text-white"
                  >
                    Inicia sesión
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/RegistroUsuario">
                    Regístrate
                  </NavDropdown.Item>
                </>
              )}

              {usuario && (
                <>
                  {isAdmin && (
                    <NavDropdown.Item
                      as={Link}
                      to="/admin/dashboard"
                      className="text-white"
                    >
                      Panel Admin
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Item
                    onClick={cerrarSesion}
                    className="text-white"
                  >
                    Cerrar sesión
                  </NavDropdown.Item>
                </>
              )}

              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/puntos" className="text-white">
                Puntos LevelUp
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </RBNavbar.Collapse>
      </Container>
    </RBNavbar>
  );
};
