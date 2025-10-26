import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";
import { AdminOrdenes } from "./pages/AdminOrdenes";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AdminOrdenes/>}/>
      <Route path="/admin/productos" element={<AdminOrdenes/>} />
    </Routes>
  </BrowserRouter>
);

export default App;
