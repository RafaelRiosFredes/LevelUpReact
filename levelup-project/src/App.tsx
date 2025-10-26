import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EditarUsuarioAdmin } from "./pages/EditarUsuarioAdmin";


import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Única página disponible */}
        <Route path="/" element={<EditarUsuarioAdmin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
