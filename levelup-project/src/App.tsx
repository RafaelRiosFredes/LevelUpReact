import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Login } from "./pages/Login";
import { ProductosPublic } from "./pages/ProductosPublic";
import { DetalleProducto } from "./pages/DetalleProducto";
import { CartProvider } from "./pages/CartContext";
import { CarroCompras } from "./pages/CarroCompras";
import { DashboardAdmin } from "./pages/DashboardAdmin";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/styles.css";
import HomePage from "./pages/HomePage";
import { RegistroUsuario } from "./pages/RegistroUsuario";
import { PerfilAdmin } from "./pages/PerfilAdmin";
import { Noticia } from "./pages/Noticias";
import { DetalleCompra } from "./pages/DetalleCompra";
import { EditarUsuarioAdmin } from "./pages/EditarUsuarioAdmin";
import { AdminProductos } from "./pages/AdminProductos";
import { AdminOrdenes } from "./pages/AdminOrdenes";
import { CrearProductoAdmin } from "./pages/CrearProductoAdmin";
import { Contacto } from "./pages/Contacto";
import { BoletaDetalle } from "./pages/BoletaDetalle";
import { BoletasAdmin } from "./pages/BoletasAdmin";


const isAdminFromStorage = (): boolean => {
  // Flag simple
  if (sessionStorage.getItem("isAdmin") === "true") return true;

  // Por si en algún momento no existe isAdmin pero sí el usuario con roles
  const USER_KEY = import.meta.env.VITE_USER_STORAGE_KEY || "levelup_user";
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return false;

  try {
    const user = JSON.parse(raw);
    const roles: string[] = user.roles || [];
    return (
      Array.isArray(roles) &&
      (roles.includes("ROLE_ADMIN") || roles.includes("ADMIN"))
    );
  } catch {
    return false;
  }
};

function RequireAdmin({ children }: { children: JSX.Element }) {
  const isAdmin = isAdminFromStorage();

  if (!isAdmin) {
    // si no es admin, lo mandamos al home (o donde quieras)
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <CartProvider>
        {!isAdminRoute && <NavBar />}
        <main className="app-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/productos" element={<ProductosPublic />} />
            <Route path="/noticias" element={<Noticia />} />
            <Route path="/detalle" element={<DetalleProducto />} />
            <Route path="/carrito" element={<CarroCompras />} />
            <Route path="/RegistroUsuario" element={<RegistroUsuario />} />
            <Route path="/detallecompra" element={<DetalleCompra />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/boleta/:id" element={<BoletaDetalle />} />

            {/* RUTAS ADMIN */}
            <Route
              path="/admin/dashboard"
              element={
                <RequireAdmin>
                  <DashboardAdmin />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/perfil"
              element={
                <RequireAdmin>
                  <PerfilAdmin />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/editarUsuarioAdmin/:id"
              element={
                <RequireAdmin>
                  <EditarUsuarioAdmin />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/editarUsuarioAdmin"
              element={
                <RequireAdmin>
                  <EditarUsuarioAdmin />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/productos"
              element={
                <RequireAdmin>
                  <AdminProductos />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/crearProducto"
              element={
                <RequireAdmin>
                  <CrearProductoAdmin />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/ordenes"
              element={
                <RequireAdmin>
                  <AdminOrdenes />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/boletas"
              element={
                <RequireAdmin>
                  <BoletasAdmin />
                </RequireAdmin>
              }
            />
          </Routes>
        </main>

        {/* Footer también NO debe aparecer en admin */}
        {/*{!isAdminRoute && <Footer />}*/}
      </CartProvider>
    </>
  );
}
