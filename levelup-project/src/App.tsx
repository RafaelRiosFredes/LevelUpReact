import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";

import { ProductosPublic } from "./pages/ProductosPublic";
import { DetalleProducto } from "./pages/DetalleProducto";
import { CarroCompras } from "./pages/CarroCompras";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<ProductosPublic />} />
        <Route path="/detalle" element={<DetalleProducto />} />
        <Route path="/carrito" element={<CarroCompras />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
