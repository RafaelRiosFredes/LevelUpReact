import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { Producto } from "../types";
import "../assets/styles.css";

interface ProductoCarrito {
  id: number;
  cantidad: number;
}

interface ProductoCarritoCompleto extends Producto {
  cantidad: number;
}

export const CarroCompras = () => {
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [productosCompletos, setProductosCompletos] = useState<ProductoCarritoCompleto[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [cupon, setCupon] = useState<string>("");

  useEffect(() => {
    const cargarCarrito = () => {
      const carritoGuardado: ProductoCarrito[] = JSON.parse(localStorage.getItem("carrito") || "[]");
      const productosGuardados: Producto[] = JSON.parse(localStorage.getItem("productos") || "[]");

      const carritoCompleto = carritoGuardado.map(item => {
        const productoInfo = productosGuardados.find(p => p.id === item.id);
        return { ...productoInfo, ...item } as ProductoCarritoCompleto;
      }).filter(item => item.nombre); // Filtrar por si un producto fue eliminado

      setCarrito(carritoGuardado);
      setProductosCompletos(carritoCompleto);
      calcularTotal(carritoCompleto);
    };

    cargarCarrito();

    // Escuchar cambios para actualizar el carrito
    window.addEventListener('carritoActualizado', cargarCarrito);
    return () => {
      window.removeEventListener('carritoActualizado', cargarCarrito);
    };
  }, []);

  // ✅ Formatear precios CLP
  const formatearPrecio = (valor: number) =>
    "$" + valor.toLocaleString("es-CL");

  // ✅ Calcular total
  const calcularTotal = (items: ProductoCarritoCompleto[]) => {
    const total = items.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
    setTotal(total);
  };

  // ✅ Cambiar cantidad
  const cambiarCantidad = (idProducto: number, cambio: number) => {
    const nuevoCarrito = carrito.map(item => {
      if (item.id === idProducto) {
        return { ...item, cantidad: Math.max(1, item.cantidad + cambio) };
      }
      return item;
    });
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    window.dispatchEvent(new Event('carritoActualizado'));
  };

  // ✅ Eliminar producto
  const eliminarProducto = (idProducto: number) => {
    const nuevoCarrito = carrito.filter(item => item.id !== idProducto);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    window.dispatchEvent(new Event('carritoActualizado'));
  };

  // ✅ Aplicar cupón (simulado)
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
        {/* 🛒 Lista de productos */}
        <Col md={8}>
          {productosCompletos.length === 0 ? (
            <p className="text-white">Tu carrito está vacío 🛒</p>
          ) : (
            productosCompletos.map((item) => (
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
                      onClick={() => cambiarCantidad(item.id, -1)}
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
                      onClick={() => cambiarCantidad(item.id, 1)}
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
                  onClick={() => eliminarProducto(item.id)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </div>
            ))
          )}
        </Col>

        {/* 🧾 Resumen y botones */}
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

              {/* 🔹 Botón que lleva a DetalleCompra */}
              <div className="d-grid gap-2 mt-3">
                <Link
                  to="/detalle-compra"
                  className={`btn btn-success btn-lg w-100 ${
                    carrito.length === 0 ? "disabled" : ""
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
