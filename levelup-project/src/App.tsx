import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginAdmin } from "./pages/LoginAdmin";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginAdmin />} />
    </Routes>
  </BrowserRouter>
);

export default App;
