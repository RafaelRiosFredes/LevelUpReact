import { Navbar } from "../components/NavBar";

const CATEGORIAS = [
  {
    key: "juegos",
    label: "Juegos de Mesa",
    icon: "bi-dice-5",
    to: "/productos?cat=juegos",
  },
  {
    key: "accesorios",
    label: "Accesorios",
    icon: "bi-controller",
    to: "/accesorios",
  },
  { key: "consolas", label: "Consolas", icon: "bi-joystick", to: "/consolas" },
  { key: "pc", label: "Computadores Gamer", icon: "bi-pc-display", to: "/pc" },
  {
    key: "sillas",
    label: "Sillas Gamer",
    icon: "bi-person-workspace",
    to: "/sillas",
  },
  { key: "mouse", label: "Mouse", icon: "bi-mouse", to: "/mouse" },
  {
    key: "mousepad",
    label: "MousePad",
    to: "/mousepad",
    labelAlt: "Mousepad",
  },
  {
    key: "poleras",
    label: "Poleras Personalizadas",
    icon: "bi-tshirt",
    to: "/poleras",
  },
  {
    key: "poleras_gamer",
    label: "Poleras Gamer Personalizadas",
    icon: "bi-tshirt",
    to: "/poleras",
  },
].map((x) => ({ ...x, label: x.label ?? (x as any).labelAlt }));

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="home-wrap">
        {/* Hero */}
        <section className="hero-spot">
          <div className="hero-img" />
          <div className="hero-overlay">
            <h1 className="hero-title">
              ¡DESAFÍA TUS LÍMITES CON LEVEL-UP
              <br />
              GAMER!
            </h1>
          </div>
        </section>

        {/* Categorías */}
        <section className="container py-4">
          <h2 className="home-section-title">CATEGORÍAS</h2>

          <div className="cat-grid">
            {CATEGORIAS.map((c) => (
              <a key={c.key} href={c.to} className="cat-card">
                <div className="cat-icon">
                  <i className={`bi ${c.icon}`} />
                </div>
                <div className="cat-label">{c.label}</div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
