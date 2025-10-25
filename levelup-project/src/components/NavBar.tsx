import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export const NavBar = () => {
  const [cantidadCarrito, setCantidadCarrito] = useState(0);

  // 🔁 Actualiza el badge del carrito cada vez que cambia el localStorage
  useEffect(() => {
    const actualizarBadge = () => {
      const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
      const total = carrito.reduce(
        (acc: number, item: any) => acc + item.cantidad,
        0
      );
      setCantidadCarrito(total);
    };

    actualizarBadge(); // Llamada inicial

    // Escucha cambios de localStorage (por ejemplo, desde DetalleProducto)
    window.addEventListener("storage", actualizarBadge);

    return () => {
      window.removeEventListener("storage", actualizarBadge);
    };
  }, []);

  return (
    <Navbar expand="lg" bg="black" variant="dark" className="py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-success fw-bold">
          LEVEL-UP GAMER
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
            <Nav.Link as={Link} to="/noticias">Noticias</Nav.Link>

            {/* 🛒 CARRITO CON CONTADOR */}
            <Nav.Link
              as={Link}
              to="/carrito"
              className="position-relative nav-link-carrito"
            >
              <i className="bi bi-cart3 me-1" style={{ fontSize: "1.2rem" }}></i>
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

            <Nav.Link as={Link} to="/login">Inicia sesión</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
