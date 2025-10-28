import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import img1 from "../assets/pz.jpg";
import img2 from "../assets/ea.jpg";
import img3 from "../assets/gm.jpg";
import "../assets/styles.css";

interface Noticia {
  id: string;
  titulo: string;
  fecha: string;
  fuente: string;
  imagenUrl?: string;
  enlace: string;
}

export const Noticia = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mock: Noticia[] = [
      {
        id: "1",
        titulo: "Todo lo nuevo en la actualización de la build tan esperada para este año.",
        fecha: "2025-10-28",
        fuente: "GamingWorld",
        imagenUrl: img1,
        enlace: "#",
      },
      {
        id: "2",
        titulo: "Torneo de eSports con premio de $1M",
        fecha: "2025-10-27",
        fuente: "eSportsNews",
        imagenUrl: img2,
        enlace: "#",
      },
      {
        id: "3",
        titulo: "Hardware gamer 2025: lo que debes saber",
        fecha: "2025-10-26",
        fuente: "TechGamer",
        imagenUrl: img3,
        enlace: "#",
      },
    ];

    setTimeout(() => {
      setNoticias(mock);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <>
      <NavBar />
      <section className="noticias-gamer">
        <div className="noticias-content">
          <div className="noticias-header">
            <h1 className="titulo-noticias">Noticias</h1>
            <p className="subtitulo-noticias">
              Las últimas novedades del mundo gamer.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-light">Cargando noticias...</p>
          ) : (
            <div className="news-grid">
              {noticias.map((n) => (
                <a
                  key={n.id}
                  href={n.enlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-card"
                >
                  {n.imagenUrl && (
                    <img src={n.imagenUrl} alt={n.titulo} className="news-img" />
                  )}
                  <div className="news-info">
                    <h2>{n.titulo}</h2>
                    <p className="news-meta">
                      {n.fuente} •{" "}
                      {new Date(n.fecha).toLocaleDateString("es-CL")}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
