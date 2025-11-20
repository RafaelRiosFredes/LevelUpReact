import { useEffect, useRef, useState } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import type { Categoria, NuevoProducto, Producto } from "../Types/Product.type";

export const CrearProducto = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [nuevoProducto, setNuevoProducto] = useState<NuevoProducto>({
    nombre: "",
    categoria: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    imagenes: [],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [processingImages, setProcessingImages] = useState<boolean>(false);
  const MAX_FILES = 6; // máximo permitido
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB por imagen

  useEffect(() => {
    const cargarDatos = async () => {
      setError("");
      setLoading(true);
      try {
        // Cargar categorías
        const categoriasResponse = await fetch("/categories.json");
        if (!categoriasResponse.ok) {
          throw new Error(
            `Error al cargar categorías: ${categoriasResponse.statusText}`
          );
        }
        const categoriasData = await categoriasResponse.json();

        // Validar estructura de categorías
        if (!Array.isArray(categoriasData)) {
          throw new Error("Formato inválido de categorías");
        }
        if (
          !categoriasData.every(
            (cat) =>
              typeof cat === "object" &&
              cat !== null &&
              typeof cat.id === "number" &&
              typeof cat.nombre === "string"
          )
        ) {
          throw new Error("Datos de categorías inválidos");
        }

        setCategorias(categoriasData);

        // Cargar productos existentes del localStorage
        const productosGuardados = localStorage.getItem("productos");
        if (!productosGuardados) {
          const productosResponse = await fetch("/products.json");
          if (!productosResponse.ok) {
            throw new Error(
              `Error al cargar productos: ${productosResponse.statusText}`
            );
          }
          const productosData = await productosResponse.json();
          localStorage.setItem("productos", JSON.stringify(productosData));
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setError(
          error instanceof Error ? error.message : "Error al cargar los datos"
        );
        // Si no hay categorías, establecer un array vacío para evitar errores
        setCategorias([]);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const handleImagenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileList = Array.from(files);

    // Validaciones básicas: cantidad y tamaño
    if (fileList.length + nuevoProducto.imagenes.length > MAX_FILES) {
      setError(`Máximo ${MAX_FILES} imágenes por producto.`);
      return;
    }

    const invalid = fileList.find(f => !f.type.startsWith('image/'));
    if (invalid) {
      setError('Solo se permiten archivos de imagen.');
      return;
    }

    const tooLarge = fileList.find(f => f.size > MAX_FILE_SIZE);
    if (tooLarge) {
      setError('Cada imagen debe ser menor a 2 MB.');
      return;
    }

    setError('');
    setProcessingImages(true);

    const imagenesPromesas = fileList.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') resolve(reader.result);
          else reject(new Error('No se pudo leer la imagen'));
        };
        reader.onerror = () => reject(new Error('Error leyendo la imagen'));
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagenesPromesas)
      .then(nuevasImagenes => {
        setNuevoProducto(prev => ({
          ...prev,
          imagenes: [...prev.imagenes, ...nuevasImagenes]
        }));
      })
      .catch(err => {
        console.error('Error procesando imágenes:', err);
        setError('Ocurrió un error al procesar las imágenes. Intenta otra vez.');
      })
      .finally(() => setProcessingImages(false));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevoProducto(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Obtener productos existentes (convalidar parseo)
    const productosGuardados = localStorage.getItem('productos') || '[]';
    let productos: Producto[] = [];
    try {
      const parsed = JSON.parse(productosGuardados);
      productos = Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn('productos en localStorage no es JSON válido, se inicializa array vacío', err);
      productos = [];
    }

    // Generar un id único y robusto
    const generarIdUnico = (lista: Producto[]) => {
      // Recoger solo ids numéricos válidos
      const idsNumericos = lista
        .map((p) => (typeof p?.id === 'number' && Number.isFinite(p.id) ? p.id : NaN))
        .filter(Number.isFinite);

      if (idsNumericos.length > 0) {
        // Asignar el siguiente número mayor al máximo existente
        return Math.max(...idsNumericos) + 1;
      }

      // Fallback: usar timestamp (nunca negativo y muy poco probable de colisión)
      return Date.now();
    };

    const nuevoId = generarIdUnico(productos);

    // Crear nuevo producto con ID
    // Validación final de imágenes: debe haber al menos una imagen y no estar procesando
    if (processingImages) {
      setError('Todavía se están procesando las imágenes. Espera unos segundos.');
      return;
    }

    if (!Array.isArray(nuevoProducto.imagenes) || nuevoProducto.imagenes.length === 0) {
      setError('Es necesario agregar al menos una imagen al producto.');
      return;
    }

    // Validación de tipado y campos antes de crear producto completo
    const validarNuevoProducto = (p: NuevoProducto, cats: Categoria[]) => {
      const errores: string[] = [];
      if (!p.nombre || typeof p.nombre !== 'string' || p.nombre.trim() === '') errores.push('Nombre inválido');
      if (!p.categoria || typeof p.categoria !== 'string' || !cats.some(c => c.nombre === p.categoria)) errores.push('Categoría inválida');
      if (typeof p.descripcion !== 'string') errores.push('Descripción inválida');
      if (typeof p.precio !== 'number' || !Number.isFinite(p.precio) || p.precio < 0) errores.push('Precio inválido');
      if (typeof p.stock !== 'number' || !Number.isInteger(p.stock) || p.stock < 0) errores.push('Stock inválido');
      if (!Array.isArray(p.imagenes) || p.imagenes.length === 0 || p.imagenes.some(img => typeof img !== 'string' || img.trim() === '')) errores.push('Imágenes inválidas');
      return errores;
    };

    const erroresProducto = validarNuevoProducto(nuevoProducto, categorias);
    if (erroresProducto.length > 0) {
      setError('Errores de validación: ' + erroresProducto.join(', '));
      return;
    }

    const productoCompleto: Producto = {
      ...nuevoProducto,
      id: nuevoId,
    };
    
    // Guardar en localStorage
    try {
      localStorage.setItem('productos', JSON.stringify([...productos, productoCompleto]));
      // Trigger update for other tabs
      try {
        localStorage.setItem('productos_lastUpdate', Date.now().toString());
      } catch {}
    } catch (err) {
      console.error('Error al guardar en localStorage:', err);
      setError('No se pudo guardar el producto en localStorage (posible límite de espacio). Se descargará una copia.');
      // fallback: export current products + new one
      try {
        const merged = [...productos, productoCompleto];
        const blob = new Blob([JSON.stringify(merged, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'productos-export-failed-save.json';
        a.click();
        URL.revokeObjectURL(url);
      } catch (exportErr) {
        console.error('Error al exportar fallback:', exportErr);
      }
    }
    
    // Resetear el formulario
    setNuevoProducto({
      nombre: "",
      categoria: "",
      descripcion: "",
      precio: 0,
      stock: 0,
      imagenes: []
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    alert('Producto creado exitosamente!');
  };

  // Export current productos from localStorage (download JSON)
  const exportProductos = () => {
    const productosGuardados = localStorage.getItem('productos') || '[]';
    try {
      const blob = new Blob([productosGuardados], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'productos-export.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exportando productos:', err);
      setError('No fue posible exportar productos.');
    }
  };

  // Import productos from a JSON file into localStorage (replaces current productos)
  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed)) throw new Error('El archivo no contiene un array');
        // Basic validation: ensure items have nombre and imagenes
        const ok = parsed.every((p: any) => typeof p.nombre === 'string' && Array.isArray(p.imagenes));
        if (!ok) throw new Error('Formato de productos inválido');
        try {
          localStorage.setItem('productos', JSON.stringify(parsed));
          localStorage.setItem('productos_lastUpdate', Date.now().toString());
          alert('Productos importados correctamente.');
          window.location.reload();
        } catch (err) {
          console.error('Error guardando productos importados:', err);
          setError('No fue posible guardar los productos importados en localStorage.');
        }
      } catch (err) {
        console.error('Error importando archivo:', err);
        setError('Archivo de importación inválido.');
      }
    };
    reader.onerror = () => setError('Error leyendo el archivo de importación');
    reader.readAsText(file);
  };

  const triggerImportClick = () => {
    if (importInputRef.current) importInputRef.current.click();
  };

  return (
    <Container fluid="lg">
      <div className="product-list-box">
        <h2 className="list-title">Crear Nuevo Producto</h2>

        {loading ? (
          <div className="text-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando datos...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            <p>{error}</p>
            <button
              type="button"
              className="btn btn-outline-danger ms-3"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        ) : (
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
                    name="categoria"
                    value={nuevoProducto.categoria}
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
                      <option key={categoria.id} value={categoria.nombre}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </Form.Select>
                  {categorias.length === 0 && (
                    <Form.Text className="text-danger">
                      No se pudieron cargar las categorías. Por favor, intenta
                      recargar la página.
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text input-group-text-dark">$</span>
                    <Form.Control
                      type="text"
                      name="precio"
                      value={nuevoProducto.precio === 0 ? "" : nuevoProducto.precio}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, ''); // Solo números y elimina ceros al inicio
                        const numericValue = value === "" ? 0 : parseInt(value);
                        setNuevoProducto(prev => ({
                          ...prev,
                          precio: numericValue
                        }));
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          setNuevoProducto(prev => ({
                            ...prev,
                            precio: 0
                          }));
                        }
                      }}
                      pattern="\d*"
                      inputMode="numeric"
                      required
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <div className="stock-input-group">
                    <Form.Control
                      type="text"
                      name="stock"
                      value={nuevoProducto.stock.toString()}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, ''); // Solo números
                        if (value === "" || value === "0") {
                          setNuevoProducto(prev => ({
                            ...prev,
                            stock: 0
                          }));
                        } else {
                          const withoutLeadingZeros = value.replace(/^0+(?=\d)/, ''); // Elimina ceros al inicio solo si no es un 0 solo
                          const numericValue = parseInt(withoutLeadingZeros);
                          setNuevoProducto(prev => ({
                            ...prev,
                            stock: numericValue
                          }));
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          setNuevoProducto(prev => ({
                            ...prev,
                            stock: 0
                          }));
                        }
                      }}
                      pattern="\d*"
                      inputMode="numeric"
                      className="stock-input"
                      required
                    />
                    <div className="stock-buttons">
                      <button
                        type="button"
                        className="stock-button"
                        onClick={() => setNuevoProducto(prev => ({
                          ...prev,
                          stock: prev.stock + 1
                        }))}
                        onMouseDown={(e) => {
                          if (e.button === 0) { // Solo botón izquierdo
                            const interval = setInterval(() => {
                              setNuevoProducto(prev => ({
                                ...prev,
                                stock: prev.stock + 1
                              }));
                            }, 150); // Incrementa cada 150ms
                            
                            const cleanup = () => {
                              clearInterval(interval);
                              window.removeEventListener('mouseup', cleanup);
                            };
                            
                            window.addEventListener('mouseup', cleanup);
                          }
                        }}
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        className="stock-button"
                        onClick={() => setNuevoProducto(prev => ({
                          ...prev,
                          stock: Math.max(0, prev.stock - 1)
                        }))}
                        onMouseDown={(e) => {
                          if (e.button === 0) { // Solo botón izquierdo
                            const interval = setInterval(() => {
                              setNuevoProducto(prev => ({
                                ...prev,
                                stock: Math.max(0, prev.stock - 1)
                              }));
                            }, 150); // Decrementa cada 150ms
                            
                            const cleanup = () => {
                              clearInterval(interval);
                              window.removeEventListener('mouseup', cleanup);
                            };
                            
                            window.addEventListener('mouseup', cleanup);
                          }
                        }}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
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

            <Form.Group className="mb-3">
              <Form.Label>Imágenes del Producto</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImagenChange}
                ref={fileInputRef}
                className="form-control-custom-file"
                required
              />
            </Form.Group>

            {nuevoProducto.imagenes.length > 0 && (
              <div className="mb-3">
                <p>Imágenes seleccionadas:</p>
                <Row>
                  {nuevoProducto.imagenes.map((imagen, index) => (
                    <Col key={index} xs={6} md={3} className="mb-3">
                      <img
                        src={imagen}
                        alt={`Vista previa ${index + 1}`}
                        className="img-thumbnail"
                        style={{ maxHeight: '150px', width: 'auto' }}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setNuevoProducto(prev => ({
                            ...prev,
                            imagenes: prev.imagenes.filter((_, i) => i !== index)
                          }));
                        }}
                      >
                        Eliminar
                      </Button>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            <div className="d-flex justify-content-end mt-4">
              {error.includes("localStorage") && (
                <div className="me-auto d-flex gap-2">
                  <Button variant="outline-secondary" size="sm" onClick={exportProductos}>
                    Exportar productos
                  </Button>
                  <input
                    type="file"
                    accept="application/json"
                    ref={importInputRef}
                    onChange={handleImportFileChange}
                    style={{ display: "none" }}
                  />
                  <Button variant="outline-secondary" size="sm" onClick={triggerImportClick}>
                    Importar productos
                  </Button>
                </div>
              )}
              
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={categorias.length === 0}
              >
                Crear Producto
              </Button>
            </div>
          </Form>
        )}
      </div>
    </Container>
  );
};