import { Routes, Route } from "react-router-dom";
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
import { Noticia } from "./pages/Noticias";
import { DetalleCompra } from "./pages/DetalleCompra";
import { EditarUsuarioAdmin } from "./pages/EditarUsuarioAdmin";

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
          <Route path="/noticias" element={<Noticia />} />
          <Route path="/detalle" element={<DetalleProducto />} />
          <Route path="/carrito" element={<CarroCompras />} />
          <Route path="/RegistroUsuario" element={<RegistroUsuario />} />
          <Route path="/detallecompra" element={<DetalleCompra />} />
          

         {/* RUTAS ADMIN */}
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="/admin/perfil" element={<PerfilAdmin />} />
          <Route path="/admin/editarUsuarioAdmin/:id" element={<EditarUsuarioAdmin />} />






        </Routes>
      </main>

      {/* Footer también NO debe aparecer en admin */}
      {/*{!isAdminRoute && <Footer />}*/}
    </CartProvider>
    </>
  );
};