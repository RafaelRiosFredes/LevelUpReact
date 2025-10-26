import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";
import { DetalleCompra } from "./pages/DetalleCompra";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { CartProvider } from "./pages/CartContext";

function App() {
  return (
    <BrowserRouter>
      {/* Envolvemos todo con CartProvider */}
      <CartProvider>
        <NavBar />
        <Routes>
          <Route path="/detalle-compra" element={<DetalleCompra />} />
        </Routes>
        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
