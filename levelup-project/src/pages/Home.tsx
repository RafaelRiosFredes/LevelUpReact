import { HeroBanner } from "../components/HeroBanner";
import { CategoryCard } from "../components/CategoryCard";

export const Home = () => {
  const categorias = [
    { icon: "bi-dice-5", text: "Juegos de Mesa" },
    { icon: "bi-controller", text: "Accesorios" },
    { icon: "bi-device-hdd", text: "Consolas" },
    { icon: "bi-pc", text: "Computadores Gamer" },
    {
      img: "https://img.icons8.com/?size=100&id=cnYTrlcPnC0e&format=png&color=39ff14",
      text: "Sillas Gamer",
    },
    { icon: "bi-mouse", text: "Mouse" },
    {
      img: "https://img.icons8.com/?size=100&id=k2sKvYhF2GC8&format=png&color=39ff14",
      text: "Mousepad",
    },
    {
      img: "https://img.icons8.com/?size=100&id=N757ereBOFWm&format=png&color=39ff14",
      text: "Poleras Personalizadas",
    },
  ];

  return (
    <>
      <HeroBanner />
      <section className="container py-5">
       <div className="row g-4 justify-content-center">
          {categorias.map((c, i) => (
            <div
              key={i}
              className="col-6 col-md-4 col-lg-3 d-flex justify-content-center"
            >
              <CategoryCard {...c} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};