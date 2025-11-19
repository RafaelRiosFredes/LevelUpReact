import { Routes, Route } from "react-router-dom";
import { Footer } from "./components/Footer";
import { NavBar } from "./components/NavBar";
import { Login } from "./pages/Login";
import { ProductosPublic } from "./pages/ProductosPublic";
import { DetalleProducto } from "./pages/DetalleProducto";
import { CartProvider } from "./pages/CartContext";
import { CarroCompras } from "./pages/CarroCompras";
import { DashboardAdmin } from "./pages/DashboardAdmin";
import { LoginAdmin } from "./pages/LoginAdmin";
import { NotFound } from "./pages/NotFound";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/styles.css";
import HomePage from "./pages/HomePage";
import { RegistroUsuario } from "./pages/RegistroUsuario";
import { PerfilAdmin } from "./pages/PerfilAdmin";

export default function App() {
  return (
    <>
    <CartProvider>
      <NavBar />
      <main className="app-container">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/productos" element={<ProductosPublic />} />
          <Route path="/detalle" element={<DetalleProducto />} />
          <Route path="/carrito" element={<CarroCompras />} />
          <Route path="/RegistroUsuario" element={<RegistroUsuario />} />
          

         {/* RUTAS ADMIN */}
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="/admin/perfil" element={<PerfilAdmin />} />






        </Routes>
      </main>

      {/* Footer también NO debe aparecer en admin */}
      {/*{!isAdminRoute && <Footer />}*/}
    </CartProvider>
    </>
  );
};