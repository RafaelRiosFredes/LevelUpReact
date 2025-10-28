import { Routes, Route } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { Login } from "./pages/Login";
import { ProductosPublic } from "./pages/ProductosPublic";
import { DetalleProducto } from "./pages/DetalleProducto";
import { CartProvider } from "./pages/CartContext";
import { DashboardAdmin } from "./pages/DashboardAdmin";
import { LoginAdmin } from "./pages/LoginAdmin";
import { NotFound } from "./pages/NotFound";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/styles.css";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <>
    <CartProvider>
      <Navbar />
      <main className="app-container">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/productos" element={<ProductosPublic />} />
          <Route path="/detalle" element={<DetalleProducto />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </CartProvider>
    </>
  );
};
