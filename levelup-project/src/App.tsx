import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RegistroUsuario } from "./pages/RegistroUsuario";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const App = () => (
    <div
    className="bg-black text-light min-vh-100"
    style={{
      backgroundColor: "#000", 
    }}
  >
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<RegistroUsuario />} />
    </Routes>
  </BrowserRouter>
  </div>
);

export default App;
