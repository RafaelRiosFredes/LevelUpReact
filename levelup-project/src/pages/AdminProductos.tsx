import { Container, Row, Col, Form, Table, Pagination } from "react-bootstrap";
import { NavBarAdmin } from "../components/NavBarAdmin";
import "../assets/styles.css";

// Datos de ejemplo basados en tu imagen
const productos = [
  {
    id: 1,
    producto: "Catan",
    categoria: "Juegos de Mesa",
    stock: 15,
    precio: "$29.990",
    estado: "Disponible",
  },
  {
    id: 2,
    producto: "Controlador Xbox",
    categoria: "Accesorios",
    stock: 5,
    precio: "$59.990",
    estado: "Stock Bajo",
  },
  {
    id: 3,
    producto: "PlayStation 5",
    categoria: "Consolas",
    stock: 0,
    precio: "$549.990",
    estado: "Agotado",
  },
  // ... puedes añadir más productos
];

// Función para asignar clases de CSS según el estado
const getStatusClass = (estado: string) => {
  switch (estado) {
    case "Disponible":
      return "status-disponible";
    case "Stock Bajo":
      return "status-stock-bajo";
    case "Agotado":
      return "status-agotado";
    default:
      return "";
  }
};

export const AdminProductos = () => {
  return (
    <>
      <NavBarAdmin />
      <section className="product-list-section">
        <Container fluid="lg">
          <div className="product-list-box">
            <h2 className="list-title">Gestión de Productos</h2>

            {/* Filtros y Búsqueda */}
            <Row className="filters-header mb-4">
              <Col md={4}>
                <Form.Select aria-label="Filtrar por categoría">
                  <option>Todos los productos</option>
                  <option value="1">Juegos de Mesa</option>
                  <option value="2">Accesorios</option>
                  <option value="3">Consolas</option>
                </Form.Select>
              </Col>
              <Col md={4} className="ms-auto">
                <Form.Control type="search" placeholder="Buscar producto..." />
              </Col>
            </Row>

            {/* Tabla de Productos */}
            <Table responsive className="table-admin">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  {/* Columna de Acciones omitida, como solicitaste */}
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.producto}</td>
                    <td>{p.categoria}</td>
                    <td>{p.stock}</td>
                    <td>{p.precio}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(p.estado)}`}
                      >
                        {p.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Paginación */}
            <Pagination className="pagination-admin justify-content-center">
              <Pagination.Prev />
              <Pagination.Item active>{1}</Pagination.Item>
              <Pagination.Item>{2}</Pagination.Item>
              <Pagination.Item>{3}</Pagination.Item>
              <Pagination.Next />
            </Pagination>
          </div>
        </Container>
      </section>
    </>
  );
};
