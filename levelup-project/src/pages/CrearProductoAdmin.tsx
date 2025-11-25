// src/pages/CrearProductoAdmin.tsx
import { NavBarAdmin } from "../components/NavBarAdmin";
import { CrearProducto } from "../components/CrearProducto";
import "../assets/styles.css";

export const CrearProductoAdmin = () => {
  return (
    <>
      <NavBarAdmin />

      <section className="product-list-section">
          <CrearProducto />
      </section>
    </>
  );
};
