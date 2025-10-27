import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PerfilAdmin } from "./pages/PerfilAdmin";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<PerfilAdmin />} />
    </Routes>
  </BrowserRouter>
);

export default App;
