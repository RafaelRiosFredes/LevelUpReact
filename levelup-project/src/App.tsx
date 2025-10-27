import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HistorialUsuarioAdmin } from "./pages/HistorialUsuarioAdmin";


import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔹 Historial de usuario (vista por ID) */}
        <Route path="/admin/historialUsuario/:id" element={<HistorialUsuarioAdmin />} />

        {/*  Detalle de compra (con ID de orden) */}
       {/*  <Route path="/admin/detalleCompra/:id" element={<DetalleCompra />} /> */} 

        {/* Ruta de prueba (opcional, se puede borrar luego del merge) */}
        <Route path="/" element={<HistorialUsuarioAdmin />} />
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;