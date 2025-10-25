import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export const NavBar = () => (
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
          <Nav.Link as={Link} to="/carrito">
            <i className="bi bi-cart3 me-1"></i> Carrito
          </Nav.Link>
          <Nav.Link as={Link} to="/login">Inicia sesión</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);
