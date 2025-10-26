import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";
import { DashboardAdmin } from "./pages/DashboardAdmin";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/admin/dashboard" element={<DashboardAdmin/>} />
    </Routes>
  </BrowserRouter>
);

export default App;
