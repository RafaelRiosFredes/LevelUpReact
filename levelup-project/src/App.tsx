import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UsuarioAdmin } from "./pages/UsuarioAdmin";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/usuarios" />} /> {/* redirige a usuarios */}
        <Route path="/admin/home" element={<h1>Bienvenido al panel de administración</h1>} />
        <Route path="/admin/usuarios" element={<UsuarioAdmin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
