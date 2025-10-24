import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RegistroUsuario } from "./pages/RegistroUsuario";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";


const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Mostrar RegistroUsuario en la ruta raíz */}
      <Route path="/" element={<RegistroUsuario />} />

      {/* También mantener ruta /registro si quieres */}
      <Route path="/registro" element={<RegistroUsuario />} />
    </Routes>
  </BrowserRouter>
);

export default App;
