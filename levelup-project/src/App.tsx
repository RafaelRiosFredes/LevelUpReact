import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";
import { AdminProductos } from "./pages/AdminProductos";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AdminProductos/>}/>
      <Route path="/admin/productos" element={<AdminProductos/>} />
    </Routes>
  </BrowserRouter>
);

export default App;
