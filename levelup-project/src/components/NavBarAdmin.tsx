
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../assets/styles.css";

export const NavBarAdmin = () => {
  const navigate = useNavigate();

  return (
    <Navbar
      expand="lg"
      className="navbar-admin shadow-sm fixed-top"
      variant="dark"
    >
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/admin")}
          className="brand-admin"
        >
          LEVEL-UP <span>ADMIN</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-admin-nav" />
        <Navbar.Collapse id="navbar-admin-nav" className="justify-content-end">
          <Nav className="align-items-center gap-4">
            <Nav.Link onClick={() => navigate("/admin/home")}>Home</Nav.Link>
            <Nav.Link onClick={() => navigate("/admin/boletas")}>Boletas</Nav.Link>
            <Nav.Link onClick={() => navigate("/admin/productos")}>Producto</Nav.Link>
            <Nav.Link onClick={() => navigate("/admin/categorias")}>Categoría</Nav.Link>
            <Nav.Link onClick={() => navigate("/admin/usuarios")}>Usuario</Nav.Link>
            <Nav.Link onClick={() => navigate("/admin/reportes")}>Reportes</Nav.Link>
            <Nav.Link onClick={() => navigate("/admin/perfil")}>Perfil</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};