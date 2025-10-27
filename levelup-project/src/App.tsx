import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HistorialUsuarioAdmin } from "./pages/HistorialUsuarioAdmin";


import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Historial de usuario*/}
        <Route path="/admin/historial/:id" element={<HistorialUsuarioAdmin />} />

        {/*  Detalle de compra con ID de orden */}
       {/* <Route path="/admin/detalleCompra/:id" element={<DetalleCompra />} /> */} 
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;