import { NavBarAdmin } from "../components/NavBarAdmin";
import { CrearProducto } from "../components/CrearProducto";
import "../assets/styles.css";

export const AdminProductos = () => {
  return (
    <>
      <NavBarAdmin />
      <section className="product-list-section">
        <CrearProducto />
      </section>
    </>
  );
};
