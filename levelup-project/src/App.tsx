import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UsuarioAdmin } from "./pages/UsuarioAdmin";

// LAS RUTAS DEBEN SER DESCOMENTADAS DESPUÉS DEL MERGE
// import { EditarUsuarioAdmin } from "./pages/EditarUsuarioAdmin";
// import { HistorialUsuario } from "./pages/HistorialUsuario";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";

const App = () => {
  return (
    <BrowserRouter>
<Routes>

  <Route path="/" element={<UsuarioAdmin />} />

  {/* LAS RUTAS DEBEN SER DESCOMENTADAS DESPUÉS DEL MERGE*/}
  {/* Página pública */}
  {/*<Route path="/" element={<Home />} />*/}

  {/* Panel de administración */}
  {/*<Route path="/admin/usuarios" element={<UsuarioAdmin />} />*/}
  {/*<Route path="editar/:id" element={<EditarUsuarioAdmin />} />*/}
  {/*<Route path="/historial/:id" element={<HistorialUsuario />} />*/}
  {/* LAS RUTAS DEBEN SER DESCOMENTADAS DESPUÉS DEL MERGE*/}
</Routes>

    </BrowserRouter>
  );
};

export default App;
