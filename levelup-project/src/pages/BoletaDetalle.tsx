import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../services/api";
import { Spinner, Card, Table, Container, Button, Alert } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import logo from "../assets/Level.png"; // <-- Logo del proyecto

export const BoletaDetalle = () => {
  const { id } = useParams();
  const [boleta, setBoleta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ----------- FORMATOS ----------
  const formatPrice = (value: number) =>
    value.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
    });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // --------- CARGAR BOLETA ----------
  useEffect(() => {
    apiFetch(`/boletas/${id}`)
      .then((data) => {
        setBoleta(data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar la boleta.");
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <Container className="text-center text-white py-5">
        <Spinner animation="border" /> <p>Cargando boleta...</p>
      </Container>
    );

  if (error || !boleta)
    return (
      <Container className="text-center text-white py-5">
        <Alert variant="danger">{error || "Boleta no encontrada"}</Alert>
        <Link to="/"><Button variant="outline-light">Volver a la tienda</Button></Link>
      </Container>
    );

  // ----------- PDF --------------
  const descargarPDF = async () => {
    const boletaDiv = document.getElementById("boleta-completa");
    if (!boletaDiv) return;

    // Activar modo PDF (fondo blanco)
    boletaDiv.classList.add("pdf-mode");

    await new Promise((resolve) => setTimeout(resolve, 250));

    const canvas = await html2canvas(boletaDiv, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    // Quitar modo PDF
    boletaDiv.classList.remove("pdf-mode");

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    // Logo arriba a la izquierda
    pdf.addImage(logo, "PNG", 10, 10, 40, 20);

    pdf.save(`Boleta-${boleta.idBoleta}.pdf`);
  };

  return (
    <Container className="p-4 mb-5 shadow text-white" style={{ marginTop: "140px" }}>
      
      {/* 🎯 Contenedor que será capturado en el PDF */}
      <div id="boleta-completa">

        {/* LOGO */}
        <div className="text-center mb-3">
          <img src={logo} alt="LevelUp Gamer" width="160" />
        </div>

        {/* ENCABEZADO */}
        <Card className="bg-dark text-white p-4 mb-4 shadow">
          <h2 className="text-info">Boleta #{boleta.idBoleta}</h2>
          <p>{formatDate(boleta.fechaEmision)}</p>
          <p className="fw-bold">{boleta.nombreUsuario}</p>
        </Card>

        {/* DETALLE */}
        <Card className="bg-dark text-white p-4 mb-4 shadow">
          <h4 className="text-info mb-3">Detalle de la compra</h4>

          <Table bordered striped hover responsive variant="dark">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {boleta.detalles.map((d: any, i: number) => (
                <tr key={i}>
                  <td>{d.nombreProducto}</td>
                  <td>{formatPrice(d.precioUnitario)}</td>
                  <td>{d.cantidad}</td>
                  <td>{formatPrice(d.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        {/* RESUMEN */}
        <Card className="bg-dark text-white p-4 shadow mb-4">
          <h4 className="text-info mb-3">Resumen de pago</h4>
          <p><strong>Subtotal:</strong> {formatPrice(boleta.totalSinDescuento)}</p>
          <p><strong>Descuento aplicado:</strong> {boleta.descuento}%</p>
          <h4 className="mt-3">
            <span className="text-success">Total pagado:</span> {formatPrice(boleta.total)}
          </h4>
        </Card>

      </div>

      {/* BOTONES */}
      <div className="text-center mt-4 d-flex gap-3 justify-content-center">
        <Button variant="primary" size="lg" onClick={descargarPDF}>
          Descargar PDF
        </Button>

        <Link to="/">
          <Button variant="success" size="lg">
            Volver a la tienda
          </Button>
        </Link>
      </div>

    </Container>
  );
};
