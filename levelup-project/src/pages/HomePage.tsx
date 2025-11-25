import { NavBar } from "../components/NavBar";

const CATEGORIAS = [
  {
    key: "juegos",
    label: "Juegos de Mesa",
    icon: "bi-dice-5",
    to: "/productos?categoria=Juegos de Mesa",
  },
  {
    key: "accesorios",
    label: "Accesorios",
    icon: "bi-controller",
    to: "/productos?categoria=Accesorios",
  },
  {
    key: "consolas",
    label: "Consolas",
    icon: "bi-joystick",
    to: "/productos?categoria=Consolas",
  },
  {
    key: "pc",
    label: "Computadores Gamer",
    icon: "bi-pc-display",
    to: "/productos?categoria=Computadores Gamer",
  },
  {
    key: "sillas",
    label: "Sillas Gamer",
    icon: "bi-person-workspace",
    to: "/productos?categoria=Sillas Gamer",
  },
  {
    key: "mouse",
    label: "Mouse",
    icon: "bi-mouse",
    to: "/productos?categoria=Mouse",
  },
  {
    key: "mousepad",
    label: "MousePad",
    to: "/productos?categoria=MousePad",
    labelAlt: "Mousepad",
  },
  {
    key: "poleras",
    label: "Poleras Personalizadas",
    icon: "bi-tshirt",
    to: "/productos?categoria=Poleras Personalizadas",
  },
  {
    key: "poleras_gamer",
    label: "Poleras Gamer Personalizadas",
    icon: "bi-tshirt",
    to: "/productos?categoria=Poleras Gamer Personalizadas",
  },
].map((x) => ({ ...x, label: x.label ?? (x as any).labelAlt }));

export default function HomePage() {
  return (
    <>
      <NavBar />
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
