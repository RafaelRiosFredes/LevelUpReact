import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UsuarioAdmin } from "./pages/UsuarioAdmin";

// Rutas que se habilitarán después del merge
// import { EditarUsuarioAdmin } from "./pages/EditarUsuarioAdmin";
// import { HistorialUsuarioAdmin } from "./pages/HistorialUsuarioAdmin";
// import { Home } from "./pages/Home";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Ruta temporal  */}
        <Route path="/" element={<UsuarioAdmin />} />

        {/* Rutas del panel admin (activar después del merge) */}
        {/*
        <Route path="/admin/usuarios" element={<UsuarioAdmin />} />
        <Route path="/admin/editar/:id" element={<EditarUsuarioAdmin />} />
        <Route path="/admin/historialUsuario/:id" element={<HistorialUsuarioAdmin />} />
        */}

        {/*  Ruta home del sitio web) */}
        {/* <Route path="/" element={<Home />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
