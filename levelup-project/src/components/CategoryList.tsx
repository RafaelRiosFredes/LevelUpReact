import type { Categoria } from "../types";

interface Props {
  categorias: Categoria[];
  filtro: string;
  onFiltrar: (categoria: string) => void;
}

export const CategoryList = ({ categorias, filtro, onFiltrar }: Props) => (
  <div className="list-group categorias">
    <button
      className={`list-group-item list-group-item-action ${
        filtro === "todos" ? "active" : ""
      }`}
      onClick={() => onFiltrar("todos")}
    >
      Todas las categorías
    </button>
    {categorias.map((c) => (
      <button
        key={c.id}
        className={`list-group-item list-group-item-action ${
          filtro === c.nombre ? "active" : ""
        }`}
        onClick={() => onFiltrar(c.nombre)}
      >
        {c.nombre}
      </button>
    ))}
  </div>
);
