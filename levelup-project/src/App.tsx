import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Noticia } from "./pages/Noticia";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Noticia />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
