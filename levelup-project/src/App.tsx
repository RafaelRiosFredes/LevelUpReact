import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";
import { ProductosPublic } from "./pages/ProductosPublic";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";

const App = () => (
  <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path="/" element={<ProductosPublic />} />
      <Route path="/productos" element={<ProductosPublic />} />
    </Routes>
    <Footer />
  </BrowserRouter>
);

export default App;

