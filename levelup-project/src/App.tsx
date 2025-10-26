import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";

import { CarroCompras } from "./pages/CarroCompras";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { DetalleProducto } from "./pages/DetalleProducto";
import { CartProvider } from "./pages/CartContext";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <NavBar />
        <Routes>
          <Route path="/detalle" element={<DetalleProducto />} />
          <Route path="/carrito" element={<CarroCompras />} />
        </Routes>
        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
