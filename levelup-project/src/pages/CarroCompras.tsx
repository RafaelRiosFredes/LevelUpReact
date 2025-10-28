import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../assets/styles.css";
import { useCart } from "./CartContext";

export const CarroCompras = () => {
  // ✅ Usamos el contexto para obtener el estado y las funciones del carrito
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [cupon, setCupon] = useState<string>("");
  // El total ahora se calcula directamente
  const [descuento, setDescuento] = useState(0);

  // ✅ Formatear precios CLP
  const formatearPrecio = (valor: number) =>
    "$" + valor.toLocaleString("es-CL");

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.precio * item.quantity,
    0
  );
  const total = subtotal - descuento;

  // ✅ Aplicar cupón (simulado)
  const aplicarCupon = () => {
    if (cupon.toLowerCase() === "levelup10") {
      setDescuento(subtotal * 0.1);
      alert("🎉 Cupón aplicado: 10% de descuento");
    } else {
      alert("⚠️ Cupón inválido");
      setDescuento(0);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-5 text-center text-white">
        <Alert variant="info">
          <Alert.Heading>Tu carrito está vacío</Alert.Heading>
          <p>
            Parece que aún no has añadido productos. ¡Explora nuestro catálogo para encontrar algo que te guste!
          </p>
          <hr />
          <Link to="/">
            <Button variant="success">Ir a la tienda</Button>
          </Link>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5 text-white">
      <h2 className="highlight mb-4">Mi carrito de compras</h2>
      <Row className="g-4">
        {/* 🛒 Lista de productos */}
        <Col md={8}>
          {cartItems.map((item) => (
              <div
                key={item.id}
                className="d-flex align-items-center bg-dark p-3 rounded mb-3"
              >
                <img
                  src={item.imagenes && item.imagenes.length > 0 ? item.imagenes[0] : 'https://via.placeholder.com/100'}
                  alt={item.nombre}
                  className="rounded me-3"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
                <div className="flex-grow-1">
                  <h5 className="mb-1">{item.nombre}</h5>
                  <p className="text-muted small">
                    Precio unitario: {formatearPrecio(item.precio)}
                  </p>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <i className="bi bi-dash"></i>
                    </Button>
                    <Form.Control
                      type="number"
                      value={item.quantity}
                      className="mx-1 text-center bg-dark text-white border-secondary"
                      style={{ width: "60px" }}
                      disabled
                    />
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <i className="bi bi-plus"></i>
                    </Button>
                  </div>
                </div>
                <p className="price me-3">
                  {formatearPrecio(item.precio * item.quantity)}
                </p>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </div>
            ))}
        </Col>

        {/* 🧾 Resumen y botones */}
        <Col md={4}>
          <div className="bg-dark p-4 rounded">
            <h5 className="mb-3">
              TOTAL: <span className="price">{formatearPrecio(total)}</span>
            </h5>
            {descuento > 0 && (
              <p className="text-success">
                Descuento: -{formatearPrecio(descuento)}
              </p>
            )}
            <Form>
              <Form.Label>Ingrese el cupón de descuento</Form.Label>
              <div className="input-group mb-3">
                <Form.Control
                  type="text"
                  placeholder="Código"
                  value={cupon}
                  onChange={(e) => setCupon(e.target.value)}
                />
                <Button variant="outline-light" onClick={aplicarCupon}>
                  Aplicar
                </Button>
              </div>

              {/* 🔹 Botón que lleva a DetalleCompra */}
              <div className="d-grid gap-2 mt-3">
                <Link
                  to="/detalle-compra"
                  className={`btn btn-success btn-lg w-100 ${
                    cartItems.length === 0 ? "disabled" : ""
                  }`}
                >
                  Ir a Detalle de Compra 🧾
                </Link>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};


