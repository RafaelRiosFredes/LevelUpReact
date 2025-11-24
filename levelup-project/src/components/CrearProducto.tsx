import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { apiFetch } from "../services/api";

// === Tipos que reflejan el backend ===
interface CategoriaBackend {
  idCategoria: number;
  nombre: string;
}

interface ProductoCreadoResponse {
  idProducto: number;
}

// Imagen en el formulario
interface ImagenForm {
  base64: string; // solo la parte después de "base64,"
  contentType: string; // ej: "image/png"
  fileName: string;
  previewUrl: string; // dataURL completo para mostrar en <img>
}

// Estado del formulario
interface NuevoProductoForm {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoriaId: number | ""; // "" = no seleccionada
}

export const CrearProducto = () => {
  const [categorias, setCategorias] = useState<CategoriaBackend[]>([]);
  const [nuevoProducto, setNuevoProducto] = useState<NuevoProductoForm>({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    categoriaId: "",
  });

  const [imagenes, setImagenes] = useState<ImagenForm[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILES = 6;
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  // ============= Cargar categorías desde el backend =============
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        setError(null);
        setLoadingCategorias(true);
        const data = await apiFetch<CategoriaBackend[]>("/categorias");
        setCategorias(data);
      } catch (err) {
        console.error("Error cargando categorías:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar categorías desde el servidor."
        );
      } finally {
        setLoadingCategorias(false);
      }
    };

    cargarCategorias();
  }, []);

  // ============= Handlers de inputs =============
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setNuevoProducto((prev) => {
      switch (name) {
        case "nombre":
          return { ...prev, nombre: value };
        case "descripcion":
          return { ...prev, descripcion: value };
        case "precio":
          return { ...prev, precio: value === "" ? 0 : Number(value) || 0 };
        case "stock":
          return { ...prev, stock: value === "" ? 0 : Number(value) || 0 };
        case "categoriaId":
          return {
            ...prev,
            categoriaId: value === "" ? "" : Number(value),
          };
        default:
          return prev;
      }
    });
  };

  // ============= Manejo de imágenes (a base64) =============
  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setError(null);
    setSuccess(null);

    const filesArray = Array.from(files);

    if (imagenes.length + filesArray.length > MAX_FILES) {
      setError(`Puedes subir un máximo de ${MAX_FILES} imágenes por producto.`);
      return;
    }

    for (const file of filesArray) {
      if (!file.type.startsWith("image/")) {
        setError("Solo se permiten archivos de imagen.");
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(`La imagen "${file.name}" supera el tamaño máximo de 2MB.`);
        continue;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // result es algo como: "data:image/png;base64,AAAA..."
        const commaIndex = result.indexOf(",");
        const base64 =
          commaIndex >= 0 ? result.substring(commaIndex + 1) : result;

        setImagenes((prev) => [
          ...prev,
          {
            base64,
            contentType: file.type,
            fileName: file.name,
            previewUrl: result,
          },
        ]);
      };
      reader.onerror = () => {
        console.error("Error leyendo archivo:", file.name);
        setError("Ocurrió un error al leer una de las imágenes.");
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImagen = (index: number) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  // ============= Submit: crear producto + subir imágenes =============
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { nombre, descripcion, precio, stock, categoriaId } = nuevoProducto;

    if (!nombre.trim() || !descripcion.trim() || !precio || !stock) {
      setError("Es necesario completar todos los campos obligatorios.");
      return;
    }

    if (!categoriaId) {
      setError("Debes seleccionar una categoría.");
      return;
    }

    try {
      setSaving(true);

      // 1) Crear el producto
      const payloadProducto = {
        nombreProducto: nombre,
        descripcion,
        precio,
        stock,
        categoriaId,
      };

      const productoCreado = await apiFetch<ProductoCreadoResponse>(
        "/productos",
        {
          method: "POST",
          body: JSON.stringify(payloadProducto),
        }
      );

      // 2) Subir imágenes en base64 para ese producto
      for (const img of imagenes) {
        await apiFetch(`/productos/${productoCreado.idProducto}/imagenes`, {
          method: "POST",
          body: JSON.stringify({
            base64: img.base64, // SIN el "data:image/...;base64,"
            nombreArchivo: img.fileName,
            contentType: img.contentType,
          }),
        });
      }

      // 3) Resetear formulario
      setNuevoProducto({
        nombre: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        categoriaId: "",
      });
      setImagenes([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccess("Producto creado exitosamente en la base de datos.");
    } catch (err) {
      console.error("Error creando producto:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error al crear el producto en el servidor."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============= Render =============
  return (
    <Container fluid="lg" className="mt-5 pt-5">
      <div className="product-list-box">
        <h2 className="list-title">Crear Nuevo Producto</h2>

        {loadingCategorias ? (
          <div className="text-center p-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
            <p className="mt-2">Cargando categorías...</p>
          </div>
        ) : (
          <>
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant="success" className="mt-3">
                {success}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} className="mt-4">
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre del Producto</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={nuevoProducto.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Categoría</Form.Label>
                    <Form.Select
                      name="categoriaId"
                      value={
                        nuevoProducto.categoriaId === ""
                          ? ""
                          : String(nuevoProducto.categoriaId)
                      }
                      onChange={handleInputChange}
                      required
                      disabled={categorias.length === 0}
                    >
                      <option value="">
                        {categorias.length === 0
                          ? "No hay categorías disponibles"
                          : "Seleccione una categoría"}
                      </option>
                      {categorias.map((categoria) => (
                        <option
                          key={categoria.idCategoria}
                          value={categoria.idCategoria}
                        >
                          {categoria.nombre}
                        </option>
                      ))}
                    </Form.Select>
                    {categorias.length === 0 && (
                      <Form.Text className="text-danger">
                        No se pudieron cargar las categorías. Revisa el backend.
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descripcion"
                  value={nuevoProducto.descripcion}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Precio (CLP)</Form.Label>
                    <Form.Control
                      type="number"
                      min={0}
                      name="precio"
                      value={
                        nuevoProducto.precio === 0 ? "" : nuevoProducto.precio
                      }
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                      type="number"
                      min={0}
                      name="stock"
                      value={
                        nuevoProducto.stock === 0 ? "" : nuevoProducto.stock
                      }
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Imágenes del producto</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImagenChange}
                  ref={fileInputRef}
                />
                <Form.Text muted>
                  Máximo {MAX_FILES} imágenes, cada una de hasta 2MB.
                </Form.Text>
              </Form.Group>

              {imagenes.length > 0 && (
                <Row className="mb-3">
                  {imagenes.map((img, idx) => (
                    <Col key={idx} xs={6} md={4} lg={3} className="mb-3">
                      <div className="border rounded p-2 text-center">
                        <img
                          src={img.previewUrl}
                          alt={img.fileName}
                          style={{
                            width: "100%",
                            height: "140px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                        <small className="d-block mt-1 text-truncate">
                          {img.fileName}
                        </small>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleRemoveImagen(idx)}
                        >
                          Quitar
                        </Button>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}

              <div className="d-flex justify-content-end mt-4">
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar producto"}
                </Button>
              </div>
            </Form>
          </>
        )}
      </div>
    </Container>
  );
};
