import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";
import { Routes, Route } from "react-router-dom";

import { DetalleProducto } from "./pages/DetalleProducto";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";

function App() {
  return (
    <> {/* Usamos un Fragmento React para agrupar los elementos */}
      <NavBar />
      <Routes>
        <Route path="/detalle" element={<DetalleProducto />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
