import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../services/api";
import { Spinner, Card, Table, Container, Button, Alert } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../assets/LEVEL-UP.png";

export const BoletaDetalle = () => {
  const { id } = useParams();
  const [boleta, setBoleta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatPrice = (v: number) =>
    v.toLocaleString("es-CL", { style: "currency", currency: "CLP" });

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

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
        <Link to="/"><Button variant="outline-light">Volver</Button></Link>
      </Container>
    );

  // ---------------- PDF BLANCO GAMER -----------------
  const descargarPDF = async () => {
    const original = document.getElementById("pdf-area");
    if (!original) return;

    // Clonar el contenido SIN afectar la pantalla
    const clone = original.cloneNode(true) as HTMLElement;
    clone.id = "pdf-temp";

    // Aplicar modo PDF
    clone.classList.add("pdf-white");

    // Contenedor temporal oculto
    const wrap = document.createElement("div");
    wrap.style.position = "fixed";
    wrap.style.top = "-999999px";
    wrap.appendChild(clone);
    document.body.appendChild(wrap);

    await new Promise((res) => setTimeout(res, 200));

    const canvas = await html2canvas(clone, {
      scale: 2,
      backgroundColor: "#ffffff"
    });

    document.body.removeChild(wrap);

    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, w, h);
    pdf.save(`Boleta-${boleta.idBoleta}.pdf`);
  };

  return (
    <Container className="p-4 mb-5 text-white" style={{ marginTop: "140px" }}>

      {/* ZONA QUE VA AL PDF */}
      <div id="pdf-area" className="boleta-normal">

        <div className="text-center mb-3">
          <img src={logo} width="150" alt="logo" />
        </div>

        <Card className="p-4 mb-4 shadow card-dark">
          <h2 className="text-info">Boleta #{boleta.idBoleta}</h2>
          <p>{formatDate(boleta.fechaEmision)}</p>
          <p className="fw-bold">{boleta.nombreUsuario}</p>
        </Card>

        <Card className="p-4 mb-4 shadow card-dark">
          <h4 className="text-info mb-3">Detalle de la compra</h4>
          <Table bordered hover responsive variant="dark">
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

        <Card className="p-4 shadow card-dark">
          <h4 className="text-info mb-3">Resumen de pago</h4>
          <p><strong>Subtotal:</strong> {formatPrice(boleta.totalSinDescuento)}</p>
          <p><strong>Descuento:</strong> {boleta.descuento}%</p>
          <h4 className="mt-3 text-success">
            Total pagado: {formatPrice(boleta.total)}
          </h4>
        </Card>

      </div>

      <div className="text-center mt-4 d-flex gap-3 justify-content-center">
        <Button size="lg" variant="primary" onClick={descargarPDF}>
          Descargar PDF
        </Button>

        <Link to="/"><Button size="lg" variant="success">Volver</Button></Link>
      </div>

    </Container>
  );
};
