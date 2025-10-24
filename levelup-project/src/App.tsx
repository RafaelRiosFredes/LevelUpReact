import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RegistroUsuario } from "./pages/RegistroUsuario";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/registro" element={<RegistroUsuario />} />
    </Routes>
  </BrowserRouter>
);

export default App; 
