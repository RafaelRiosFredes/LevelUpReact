interface Props {
  icon?: string;  // clase de ícono Bootstrap (bi-controller, bi-pc, etc.)
  img?: string;   // URL de imagen externa (icons8, etc.)
  text: string;   // texto debajo del ícono
}

export const CategoryCard = ({ icon, img, text }: Props) => {
  const handleClick = () => (window.location.href = "/productos");

  return (
    <div className="category-card text-center" onClick={handleClick}>
      {/* Contenedor visual para que todo se mantenga alineado */}
      <div className="icon-wrapper">
        {icon && <i className={`bi ${icon}`}></i>}
        {img && <img src={img} alt={text} />}
      </div>
      <p>{text}</p>
    </div>
  );
};
