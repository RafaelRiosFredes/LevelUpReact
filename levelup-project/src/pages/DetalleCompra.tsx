import React, { useState } from "react";
import { Container, Table, Form, Row, Col, Button, Card, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom"; // <-- IMPORTAR useLocation
import "../assets/styles.css";
import { useCart } from "./CartContext";
import { crearBoleta } from "../services/BoletaService";  
import { obtenerUsuarioPorId } from "../services/UsuarioService";


export const DetalleCompra = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    // --------------------------------------------------------
    // OBTENER ESTADO DE NAVEGACIÓN (Descuento y Total Final)
    // --------------------------------------------------------
    const passedState = location.state as { appliedDiscountPercentage: number, finalTotal: number } | undefined;
    
    // Calcular SUBTOTAL (para mostrar desglose)
    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.precio * item.quantity,
        0
    );

    // Usar los valores pasados o el subtotal si no se pasaron (ej. recarga de página)
    const descuentoPorcentaje = passedState?.appliedDiscountPercentage || 0;
    const totalFinal = passedState?.finalTotal || subtotal; // Usamos totalFinal

    // --------------------------------------------------------
    // Datos del cliente (omitiendo la inicialización por brevedad)
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");
    const [calle, setCalle] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [region, setRegion] = useState("");
    const [comuna, setComuna] = useState("");
    const [indicaciones, setIndicaciones] = useState("");


    // -------------------------------------------------------------
    // CARGAR DATOS DEL USUARIO LOGEADO AUTOMÁTICAMENTE
    // -------------------------------------------------------------
    React.useEffect(() => {
        const USER_KEY = import.meta.env.VITE_USER_STORAGE_KEY || "levelup_user";

        const userData = localStorage.getItem(USER_KEY);
        if (!userData) return;

        const parsed = JSON.parse(userData);

        if (!parsed.id) return;

        // Llamar al backend
        obtenerUsuarioPorId(parsed.id)
            .then((data) => {
                setNombre(data.nombres || "");
                setApellido(data.apellidos || "");
                setCorreo(data.correo || "");
            })
            .catch((err) => {
                console.error("Error obteniendo usuario:", err);
            });
    }, []);

    // Pago
    const [tarjeta, setTarjeta] = useState("");
    const [mensaje, setMensaje] = useState<{ tipo: "success" | "danger"; texto: string } | null>(null);
    const [procesando, setProcesando] = useState(false);

    const formatPrice = (value: number) =>
        "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        
    // Calcular el monto absoluto del descuento
    const montoDescuento = subtotal - totalFinal;

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        console.log("HANDLE SUBMIT INICIADO");
        
        event.preventDefault();
        const form = event.currentTarget;

        // Usamos la validación nativa del navegador
        if (form.checkValidity() === false || tarjeta.trim().length !== 16) {
            event.stopPropagation();
            setMensaje({
                tipo: "danger",
                texto: "El pago no pudo ser realizado. Intentalo Denuevo...",
            });
            return;
        }

        setProcesando(true);
        setMensaje(null);

        try {
            // ------------------------------------------------------------------
            // ENVÍO DE DATOS CORREGIDO
            // ------------------------------------------------------------------
            const data = {
                items: cartItems.map(item => ({
                    idProducto: item.id,
                    cantidad: item.quantity,
                })),
                total: totalFinal, 
                descuento: descuentoPorcentaje, 
            };

            console.log("ENVIANDO DATA A BACKEND:", data);

            // llama al backend
            const response = await crearBoleta(data);

            console.log("RESPUESTA DEL BACKEND:", response);

            setMensaje({
                tipo: "success",
                texto: `¡Compra realizada! Total: ${formatPrice(totalFinal)}`,
            });

            clearCart();
            setProcesando(false);

            // redirige a la boleta 
            navigate(`/boleta/${response.idBoleta}`);

        } catch (error) {
            console.error(error);

            setMensaje({
                tipo: "danger",
                texto: "Hubo un problema al procesar la compra.",
            });

            setProcesando(false);
        }
    };

    // Si el carrito está vacío y no hay un mensaje de éxito, redirigir o mostrar un aviso.
    if (cartItems.length === 0 && !mensaje) {
        return (
            <Container className="py-5 text-center text-white">
                <Alert variant="info">
                    <Alert.Heading>Tu carrito está vacío</Alert.Heading>
                    <p>
                        No hay productos para comprar. Vuelve a la tienda para seguir explorando.
                    </p>
                    <Link to="/">
                        <Button variant="success">Ir a la tienda</Button>
                    </Link>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5 text-white">
            <h2 className="highlight mb-4">Carrito de compra</h2>

            {/*  Tabla de productos */}
            <Card className="bg-dark text-white mb-4 p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Completa la siguiente información</h5>
                    <h5 className="bg-success text-white px-3 py-1 rounded">
                        Total a pagar: {formatPrice(totalFinal)} 
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
                        {cartItems.length > 0 ? (
                            cartItems.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ width: "80px" }}>
                                        <img
                                            src={item.imagenes[0]} // Asumiendo que la primera imagen es la principal
                                            alt={item.nombre}
                                            style={{ width: "60px", borderRadius: "8px" }}
                                        />
                                    </td>
                                    <td>{item.nombre}</td>
                                    <td>{formatPrice(item.precio)}</td>
                                    <td>{item.quantity}</td>
                                    <td>{formatPrice(item.precio * item.quantity)}</td>
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
                
                {/* Mostrar desglose de descuento */}
                {descuentoPorcentaje > 0 && (
                    <Row className="mt-3 text-end">
                        <Col xs={12}>
                            <p className="text-muted mb-0">Subtotal: {formatPrice(subtotal)}</p>
                            <p className="text-success fw-bold mb-0">Descuento ({descuentoPorcentaje}%): -{formatPrice(montoDescuento)}</p>
                            <h5 className="mt-2">Total final: {formatPrice(totalFinal)}</h5>
                        </Col>
                    </Row>
                )}
            </Card>

            {/* Si ya se pagó, no mostrar los formularios */}
            {mensaje?.tipo === 'success' ? (
                <Alert
                    variant="success"
                    className="mt-3 text-center fw-bold"
                >
                    {mensaje.texto}
                    <hr />
                    <Button variant="outline-success" onClick={() => navigate('/')}>Volver a la tienda</Button>
                </Alert>
            ) : (
            <>
            <Form noValidate onSubmit={handleSubmit}>
            {/*  Información del cliente */}
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
                                required
                                onChange={(e) => setNombre(e.target.value)}
                            /> 
                            <Form.Control.Feedback type="invalid">Por favor, ingrese su nombre.</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Apellidos*</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ej: Pérez"
                                value={apellido}
                                required
                                onChange={(e) => setApellido(e.target.value)}
                            /> 
                            <Form.Control.Feedback type="invalid">Por favor, ingrese sus apellidos.</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={12}>
                        <Form.Group>
                            <Form.Label>Correo*</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ej: ana.perez@email.com"
                                value={correo}
                                required
                                onChange={(e) => setCorreo(e.target.value)}
                            /> 
                            <Form.Control.Feedback type="invalid">Por favor, ingrese un correo válido.</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
            </Card>

            {/*  Dirección de entrega */}
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
                                required
                                onChange={(e) => setCalle(e.target.value)}
                            /> 
                            <Form.Control.Feedback type="invalid">Por favor, ingrese su calle.</Form.Control.Feedback>
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
                                required
                                onChange={(e) => setRegion(e.target.value)}
                            >
                                <option value="">Seleccione una región</option>
                                <option>Región Metropolitana de Santiago</option>
                                <option>Valparaíso</option>
                                <option>Biobío</option>
                                <option>Antofagasta</option>
                            </Form.Select> 
                            <Form.Control.Feedback type="invalid">Por favor, seleccione una región.</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Comuna*</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ej: Cerrillos"
                                value={comuna}
                                required
                                onChange={(e) => setComuna(e.target.value)}
                            /> 
                            <Form.Control.Feedback type="invalid">Por favor, ingrese su comuna.</Form.Control.Feedback>
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

            {/*  Sección de pago */}
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
                                required
                                onChange={(e) => setTarjeta(e.target.value.replace(/\D/g, ""))}
                            /> 
                            <Form.Text className="text-muted">
                                Solo se permiten 16 dígitos.
                            </Form.Text>
                            <Form.Control.Feedback type="invalid">Por favor, ingrese un número de tarjeta de 16 dígitos.</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <div className="text-end mt-4">
                    <Button
                        type="submit"
                        variant="success"
                        size="lg"
                        disabled={cartItems.length === 0 || procesando}
                    >
                        {procesando ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                <span className="ms-2">Procesando...</span>
                            </>
                        ) : `Pagar ahora ${formatPrice(totalFinal)}`}
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
            </Form>
            </>
            )}
        </Container>
    );
};