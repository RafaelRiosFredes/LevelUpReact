import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// CSS: importa primero Bootstrap y luego tus estilos para que los puedas sobrescribir
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";   // <- o "./index.css" si ese es tu archivo

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
