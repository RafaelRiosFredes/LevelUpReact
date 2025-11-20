import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../assets/styles.css";

export const NavBarAdmin = () => {
  const admin = JSON.parse(localStorage.getItem("admin") || "null");
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
            <Nav.Link onClick={() => navigate("/home")}>Home</Nav.Link>
            <Nav.Link onClick={() => navigate("/admin/boletas")}>
              Boletas
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/admin/productos")}>
              Productos
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/admin/categorias")}>
              Categorías
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/admin/usuarios")}>
              Usuarios
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/admin/editarUsuarioAdmin/1")}>
              Editar Usuario
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/admin/ordenes")}>
              Ordenes
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/admin/reportes")}>
              Reportes
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/admin/perfil")}>
              Perfil
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};