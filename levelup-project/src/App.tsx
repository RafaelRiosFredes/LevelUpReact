import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { Login } from "./pages/Login";
import { DetalleProducto } from "./pages/DetalleProducto";
import { DashboardAdmin } from "./pages/DashboardAdmin";
import { LoginAdmin } from "./pages/LoginAdmin";
import { NotFound } from "./pages/NotFound";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/styles.css";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/detalle" element={<DetalleProducto />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}