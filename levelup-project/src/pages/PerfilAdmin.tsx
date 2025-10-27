import { useEffect, useMemo, useState } from "react";
import { NavBarAdmin } from "../components/NavBarAdmin";
import "../assets/styles.css";

interface Admin {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  telefono: string;
  fechaIngreso: string;
  region: string;
}

type Mark = "P" | "A" | undefined; // Presente / Ausente

export const PerfilAdmin = () => {
  const [admin, setAdmin] = useState<Admin | null>(null);

  // ===== Notas =====
  const [nota, setNota] = useState("");
  const [notas, setNotas] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("admin_notes") || "[]"); }
    catch { return []; }
  });

  const addNota = () => {
    const text = nota.trim();
    if (!text) return;
    const next = [text, ...notas].slice(0, 50);
    setNotas(next);
    localStorage.setItem("admin_notes", JSON.stringify(next));
    setNota("");
  };

  const delNota = (i: number) => {
    const next = notas.filter((_, idx) => idx !== i);
    setNotas(next);
    localStorage.setItem("admin_notes", JSON.stringify(next));
  };

  // ===== Calendario de asistencia =====
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-11

  // Mapa: "YYYY-MM-DD" -> "P" | "A"
  const [marks, setMarks] = useState<Record<string, Mark>>(() => {
    try { return JSON.parse(localStorage.getItem("admin_attendance") || "{}"); }
    catch { return {}; }
  });

  const ymLabel = useMemo(
    () => new Date(year, month, 1).toLocaleString("es-CL", { month: "long", year: "numeric" }),
    [year, month]
  );

  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month]);
  const firstWeekday = useMemo(() => new Date(year, month, 1).getDay() || 7, [year, month]); // L=1..D=7

  const keyOf = (d: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const toggleMark = (d: number, kind: Mark) => {
    const k = keyOf(d);
    const next = { ...marks, [k]: marks[k] === kind ? undefined : kind };
    setMarks(next);
    localStorage.setItem("admin_attendance", JSON.stringify(next));
  };

  const prevMonth = () => {
    const date = new Date(year, month, 1);
    date.setMonth(date.getMonth() - 1);
    setYear(date.getFullYear());
    setMonth(date.getMonth());
  };
  const nextMonth = () => {
    const date = new Date(year, month, 1);
    date.setMonth(date.getMonth() + 1);
    setYear(date.getFullYear());
    setMonth(date.getMonth());
  };

  useEffect(() => {
    // Puedes reemplazar por datos reales del admin conectado
    setAdmin({
      id: 1,
      nombre: "Caly Jara",
      correo: "Caly@levelup.cl",
      rol: "Administradora General",
      telefono: "+56 9 8765 4321",
      fechaIngreso: "2023-05-15",
      region: "Región de Valparaíso",
    });
  }, []);

  if (!admin) return <p className="text-center text-light">Cargando perfil...</p>;

  return (
    <>
      <NavBarAdmin />
      <section className="admin-dashboard perfil-admin">
        <div className="perfil-layout">
          {/* Columna: Perfil */}
          <div className="perfil-card neon-box">
            <div className="perfil-header">
              <h1>¡Hola! Administrador</h1>
            </div>

              <div className="perfil-info">
                <p><strong>Nombre:</strong> {admin.nombre}</p>
                <p><strong>Correo:</strong> {admin.correo}</p>
                <p><strong>Teléfono:</strong> {admin.telefono}</p>
                <p><strong>Región:</strong> {admin.region}</p>
                <p><strong>Rol:</strong> {admin.rol}</p>
                <p><strong>Fecha de ingreso:</strong> {admin.fechaIngreso}</p>
              </div>

          </div>

          {/* Columna: Widgets laterales */}
          <aside className="perfil-widgets">
            {/* Notas rápidas */}
            <div className="widget neon-outline">
              <div className="widget-header">
                <h3>Notas</h3>
              </div>

              <div className="notes-area">
                <textarea
                  placeholder="Escribe una nota..."
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  maxLength={300}
                />
                <button className="btn btn-success btn-small" onClick={addNota}>Agregar</button>
              </div>

              <ul className="notes-list">
                {notas.length === 0 && <li className="muted">Aún no hay notas.</li>}
                {notas.map((n, i) => (
                  <li key={i} className="note-item">
                    <span>{n}</span>
                    <button className="btn btn-ghost" onClick={() => delNota(i)}>×</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Calendario de asistencia */}
            <div className="widget neon-outline">
              <div className="widget-header calendar-header">
                <button className="btn btn-ghost" onClick={prevMonth}>‹</button>
                <h3 className="calendar-title">{ymLabel}</h3>
                <button className="btn btn-ghost" onClick={nextMonth}>›</button>
              </div>

              <div className="calendar-grid">
                {["L", "M", "M", "J", "V", "S", "D"].map((d) => (
                  <div key={d} className="cal-cell cal-head">{d}</div>
                ))}
                {/* Espacios antes del día 1 (semana inicia Lunes) */}
                {Array.from({ length: firstWeekday - 1 }).map((_, i) => (
                  <div key={`pad-${i}`} className="cal-cell cal-empty" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const day = idx + 1;
                  const k = keyOf(day);
                  const mark = marks[k];
                  return (
                    <div key={day} className="cal-cell cal-day">
                      <div className="cal-day-top">
                        <span className="cal-number">{day}</span>
                        {mark && <span className={`chip ${mark === "P" ? "chip-p" : "chip-a"}`}>{mark}</span>}
                      </div>
                      <div className="cal-actions">
                        <button className="btn btn-chip p" onClick={() => toggleMark(day, "P")}>P</button>                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};
