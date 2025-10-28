import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Navbar } from "./components/NavBar";
import { Footer } from "./components/Footer";
// import { LoginAdmin } from "./pages/LoginAdmin";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/styles.css";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Ruta ya lista para el login del admin hay que descomentar y eliminar este comentario, xao :P */}
          {/* <Route path="/loginAdmin" element={<LoginAdmin />} /> */}
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
};

export default App;
