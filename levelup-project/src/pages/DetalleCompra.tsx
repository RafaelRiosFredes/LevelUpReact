import { useEffect, useState } from "react";
import { Container, Table, Form, Row, Col, Button, Card, Alert } from "react-bootstrap";
import "../assets/styles.css";

interface ProductoCarrito {
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

export const DetalleCompra = () => {
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [total, setTotal] = useState(0);

  // Datos del cliente
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [calle, setCalle] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [indicaciones, setIndicaciones] = useState("");

  // Pago
  const [tarjeta, setTarjeta] = useState("");
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "danger"; texto: string } | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("carrito") || "[]");
    setCarrito(data);
    const totalCalc = data.reduce(
      (acc: number, item: ProductoCarrito) => acc + item.precio * item.cantidad,
      0
    );
    setTotal(totalCalc);
  }, []);

  const formatPrice = (value: number) =>
    "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const handlePagar = () => {
    if (tarjeta.trim().length === 16) {
      setMensaje({
        tipo: "success",
        texto: `✅ ¡Gracias por tu compra, ${nombre || "cliente"}! Tu pago por ${formatPrice(total)} fue exitoso.`,
      });
      localStorage.removeItem("carrito");
      window.dispatchEvent(new Event("carritoActualizado"));
      setCarrito([]);
      setTarjeta("");
    } else {
      setMensaje({
        tipo: "danger",
        texto: "❌ Error: número de tarjeta inválido. Debe contener 16 dígitos.",
      });
    }
  };

  return (
    <Container className="py-5 text-white">
      <h2 className="highlight mb-4">Carrito de compra</h2>

      {/* 🧾 Tabla de productos */}
      <Card className="bg-dark text-white mb-4 p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Completa la siguiente información</h5>
          <h5 className="bg-success text-white px-3 py-1 rounded">
            Total a pagar: {formatPrice(total)}
          </h5>
        </div>

        <Table striped bordered hover responsive variant="dark">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {carrito.length > 0 ? (
              carrito.map((item, index) => (
                <tr key={index}>
                  <td style={{ width: "80px" }}>
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      style={{ width: "60px", borderRadius: "8px" }}
                    />
                  </td>
                  <td>{item.nombre}</td>
                  <td>{formatPrice(item.precio)}</td>
                  <td>{item.cantidad}</td>
                  <td>{formatPrice(item.precio * item.cantidad)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  Tu carrito está vacío 🛒
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>

      {/* 🧍 Información del cliente */}
      <Card className="bg-dark text-white mb-4 p-4">
        <h5 className="mb-3 text-info">Información del cliente</h5>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Nombre*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Ana"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Apellidos*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Pérez"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group>
              <Form.Label>Correo*</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ej: ana.perez@email.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card>

      {/* 🚚 Dirección de entrega */}
      <Card className="bg-dark text-white p-4 mb-4">
        <h5 className="mb-3 text-info">Dirección de entrega de los productos</h5>
        <Row className="g-3">
          <Col md={8}>
            <Form.Group>
              <Form.Label>Calle*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Av. Los Héroes 1234"
                value={calle}
                onChange={(e) => setCalle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Departamento (opcional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: 603"
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Región*</Form.Label>
              <Form.Select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="">Seleccione una región</option>
                <option>Región Metropolitana de Santiago</option>
                <option>Valparaíso</option>
                <option>Biobío</option>
                <option>Antofagasta</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Comuna*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Cerrillos"
                value={comuna}
                onChange={(e) => setComuna(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group>
              <Form.Label>Indicaciones de entrega (opcional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Ej: Entre calles, color del edificio, no tiene timbre..."
                value={indicaciones}
                onChange={(e) => setIndicaciones(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card>

      {/* 💳 Sección de pago */}
      <Card className="bg-dark text-white p-4 mb-4">
        <h5 className="mb-3 text-info">Pago con tarjeta</h5>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Número de tarjeta*</Form.Label>
              <Form.Control
                type="text"
                maxLength={16}
                placeholder="Ej: 1234567812345678"
                value={tarjeta}
                onChange={(e) => setTarjeta(e.target.value.replace(/\D/g, ""))}
              />
              <Form.Text className="text-muted">
                Solo se permiten 16 dígitos.
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <div className="text-end mt-4">
          <Button
            variant="success"
            size="lg"
            onClick={handlePagar}
            disabled={carrito.length === 0}
          >
            Pagar ahora {formatPrice(total)}
          </Button>
        </div>

        {/* Mensaje de éxito o error */}
        {mensaje && (
          <Alert
            variant={mensaje.tipo}
            className="mt-3 text-center fw-bold"
            onClose={() => setMensaje(null)}
            dismissible
          >
            {mensaje.texto}
          </Alert>
        )}
      </Card>
    </Container>
  );
};
