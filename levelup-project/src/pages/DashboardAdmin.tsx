import React, { useEffect, useMemo, useState } from "react";
import { NavBarAdmin } from "../components/NavBarAdmin";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type Item = {
  id: number | string;
  nombre: string;
  quantity: number;
};

type Orden = {
  id: number | string;
  fecha: string; // ISO
  total: number;
  items: Item[];
};

const THEME = {
  text: "var(--text)",
  green: "var(--gamer-green)",
  blue: "var(--electric-blue)",
  purple: "var(--neon-purple)",
  axis: "var(--axis)",
  grid: "var(--grid)",
};

const IS_TEST =
  (typeof process !== "undefined" && process.env.NODE_ENV === "test") ||
  (typeof import.meta !== "undefined" && (import.meta as any).vitest);


const STORAGE_KEY = "ordenes_compra";

// Formatea CLP como "$150" (sin decimales y sin espacios no-rompibles molestos)
function formatCLP(value: number): string {
  try {
    return value
      .toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/\s/g, "");
  } catch {
    // Fallback minimalista
    return `$${Math.round(value)}`;
  }
}

function safeReadOrdenes(): Orden[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Orden[];
  } catch {
    return [];
  }
}

export const DashboardAdmin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);

  useEffect(() => {
    // Simular carga asíncrona para que el spinner sea visible en el primer render
    const timer = setTimeout(() => {
      setOrdenes(safeReadOrdenes());
      setIsLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Métricas
  const { ingresosTotales, ordenesTotales, valorPromedio } = useMemo(() => {
    const total = ordenes.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    const count = ordenes.length;
    const avg = count > 0 ? total / count : 0;
    return {
      ingresosTotales: total,
      ordenesTotales: count,
      valorPromedio: avg,
    };
  }, [ordenes]);

  // Top productos por cantidad total
  const topProductos = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const o of ordenes) {
      for (const it of o.items || []) {
        const key = it.nombre ?? String(it.id);
        mapa.set(key, (mapa.get(key) || 0) + (Number(it.quantity) || 0));
      }
    }
    return Array.from(mapa.entries())
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);
  }, [ordenes]);

  // Ventas por día para el gráfico
  const ventasPorDia = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const o of ordenes) {
      if (!o.fecha) continue;
      const d = new Date(o.fecha);
      if (isNaN(d.getTime())) continue;
      // Normalizamos a YYYY-MM-DD para agrupar
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`;
      mapa.set(key, (mapa.get(key) || 0) + (Number(o.total) || 0));
    }
    // Para XAxis es más legible un label corto (DD/MM)
    return Array.from(mapa.entries())
      .map(([iso, total]) => {
        const [y, m, day] = iso.split("-");
        const label = `${day}/${m}`;
        return { dia: label, total: Math.round(total) };
      })
      .sort((a, b) => {
        // ordenar por fecha (asumiendo mismo año) usando MM y DD del label
        const [d1, m1] = a.dia.split("/").map(Number);
        const [d2, m2] = b.dia.split("/").map(Number);
        return m1 !== m2 ? m1 - m2 : d1 - d2;
      });
  }, [ordenes]);

  return (
    <>
      <NavBarAdmin />

      <main className="container py-4">
        <h1>Dashboard de Rendimiento</h1>

        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div
              className="spinner-border"
              role="status"
              data-testid="loading-spinner"
            />
          </div>
        ) : (
          <>
            {/* Métricas */}
            <section className="row g-3 my-2">
              <div className="col-12 col-md-4">
                <div className="dashboard-card">
                  <div className="card-body">
                    <h5 className="card-title-metric">Ingresos Totales</h5>
                    <p className="card-value">{formatCLP(ingresosTotales)}</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="dashboard-card">
                  <div className="card-body">
                    <h5 className="card-title-metric">Órdenes Totales</h5>
                    <p className="card-value">{ordenesTotales}</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="dashboard-card">
                  <div className="card-body-metric">
                    <h5 className="card-title">Valor Promedio Orden</h5>
                    <p className="card-value">{formatCLP(valorPromedio)}</p>
                  </div>
                </div>
              </div>
            </section>
<section className="my-3">
  <div className="dashboard-split">
    {/* Columna izquierda: gráfico */}
    <div className="dashboard-card chart-card">
      <div className="card-body">
        <h5 className="card-title-section">Ventas por día</h5>
        {ventasPorDia.length === 0 ? (
          <p className="empty-hint">No hay suficientes datos para mostrar el gráfico.</p>
        ) : (
          <div className="chart-wrap">
            <ResponsiveContainer>
              <BarChart data={ventasPorDia}>
                <defs>
                  <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--electric-blue)"/>
                    <stop offset="100%" stopColor="var(--neon-purple)"/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(128,0,255,.25)" strokeDasharray="3 3"/>
                <XAxis dataKey="dia" tick={{fill:"var(--axis)"}} axisLine={{stroke:"var(--neon-purple)"}} tickLine={{stroke:"var(--neon-purple)"}}/>
                <YAxis tick={{fill:"var(--axis)"}} axisLine={{stroke:"var(--neon-purple)"}} tickLine={{stroke:"var(--neon-purple)"}}/>
                <Tooltip
                  contentStyle={{background:"#111", border:"1px solid var(--neon-purple)", borderRadius:10, color:"var(--text)"}}
                  labelStyle={{color:"var(--gamer-green)"}}
                  itemStyle={{color:"var(--text)"}}
                  cursor={{fill:"rgba(57,255,20,.08)"}}
                />
                <Legend wrapperStyle={{color:"var(--text)"}}/>
                <Bar dataKey="total" name="Total" fill="url(#barFill)" stroke="var(--gamer-green)" strokeWidth={1.5} radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>

    {/* Columna derecha: Top 5 productos */}
    <div className="dashboard-card top5-card">
      <div className="card-body">
        <h5 className="card-title-section">Top 5 productos</h5>
        {topProductos.length === 0 ? (
          <p className="empty-hint">No hay datos de productos vendidos.</p>
        ) : (
          <div className="table-responsive top5-scroll">
            <table className="table table-sm align-middle table-dashboard">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-end">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {topProductos.map(p => (
                  <tr key={p.nombre}>
                    <td className="name-cell"><span className="name-ellipsis" title={p.nombre}>{p.nombre}</span></td>
                    <td className="text-end qty-cell"><span className="qty-chip">{p.cantidad}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </div>
</section>

          </>
        )}
      </main>
    </>
  );
};
