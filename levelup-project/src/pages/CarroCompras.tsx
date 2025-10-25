import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "../assets/styles.css";

interface ProductoCarrito {
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

export const CarroCompras = () => {
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [cupon, setCupon] = useState<string>("");

  // Cargar carrito desde localStorage
  useEffect(() => {
    const data = localStorage.getItem("carrito");
    if (data) {
      const parsed = JSON.parse(data);
      setCarrito(parsed);
      calcularTotal(parsed);
    }
  }, []);

  // Función para formatear precios CLP
  const formatearPrecio = (valor: number) =>
    "$" + valor.toLocaleString("es-CL");

  // Calcular total
  const calcularTotal = (items: ProductoCarrito[]) => {
    const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    setTotal(total);
  };

  // Cambiar cantidad
  const cambiarCantidad = (index: number, cambio: number) => {
    const copia = [...carrito];
    copia[index].cantidad += cambio;
    if (copia[index].cantidad < 1) copia[index].cantidad = 1;
    setCarrito(copia);
    localStorage.setItem("carrito", JSON.stringify(copia));
    calcularTotal(copia);
  };

  // Eliminar producto
  const eliminarProducto = (index: number) => {
    const copia = carrito.filter((_, i) => i !== index);
    setCarrito(copia);
    localStorage.setItem("carrito", JSON.stringify(copia));
    calcularTotal(copia);
  };

  // Aplicar cupón (simulado)
  const aplicarCupon = () => {
    if (cupon.toLowerCase() === "levelup10") {
      const descuento = total * 0.1;
      setTotal(total - descuento);
      alert("🎉 Cupón aplicado: 10% de descuento");
    } else {
      alert("⚠️ Cupón inválido");
    }
  };

  return (
    <Container className="py-5 text-white">
      <h2 className="highlight mb-4">Mi carrito de compras</h2>
      <Row className="g-4">
        {/* Lista de productos */}
        <Col md={8}>
          {carrito.length === 0 ? (
            <p className="text-white">Tu carrito está vacío 🛒</p>
          ) : (
            carrito.map((item, index) => (
              <div
                key={index}
                className="d-flex align-items-center bg-dark p-3 rounded mb-3"
              >
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="rounded me-3"
                  style={{ width: "100px" }}
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
                      onClick={() => cambiarCantidad(index, -1)}
                    >
                      <i className="bi bi-dash"></i>
                    </Button>
                    <Form.Control
                      type="number"
                      value={item.cantidad}
                      className="mx-1 text-center"
                      style={{ width: "60px" }}
                      disabled
                    />
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => cambiarCantidad(index, 1)}
                    >
                      <i className="bi bi-plus"></i>
                    </Button>
                  </div>
                </div>
                <p className="price me-3">
                  {formatearPrecio(item.precio * item.cantidad)}
                </p>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => eliminarProducto(index)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </div>
            ))
          )}
        </Col>

        {/* Resumen */}
        <Col md={4}>
          <div className="bg-dark p-4 rounded">
            <h5 className="mb-3">
              TOTAL: <span className="price">{formatearPrecio(total)}</span>
            </h5>
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
              <Button variant="success" className="w-100 fw-bold">
                PAGAR
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
