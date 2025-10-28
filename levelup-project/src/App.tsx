import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";
import { DashboardAdmin } from "./pages/DashboardAdmin";
import { NotFound } from "./pages/NotFound";

const App = () => (
    <Routes>
      <Route path="/" element={<DashboardAdmin />} />
      <Route path="/admin/dashboard" element={<DashboardAdmin/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
);

export default App;
