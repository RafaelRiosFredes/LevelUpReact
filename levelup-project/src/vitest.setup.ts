// vitest.setup.ts
import * as React from "react";
import { vi } from "vitest";

// Dummy factory para cualquier componente de recharts
const make = (name: string) =>
  function Dummy(props: any) {
    return React.createElement(
      "div",
      { "data-recharts-mock": name, ...props },
      props?.children
    );
  };

vi.mock("recharts", () => {
  const base: Record<string, any> = {
    __esModule: true,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        "div",
        { "data-testid": "responsive-container" },
        children
      ),
    BarChart: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", { "data-testid": "bar-chart" }, children),
    Bar: make("Bar"),
    XAxis: make("XAxis"),
    YAxis: make("YAxis"),
    CartesianGrid: make("CartesianGrid"),
    Tooltip: make("Tooltip"),
    Legend: make("Legend"),
  };

  // Cualquier otro export que pida tu código queda mockeado automáticamente
  return new Proxy(base, {
    get(target, prop: string) {
      if (prop in target) return (target as any)[prop];
      const comp = make(prop);
      (target as any)[prop] = comp;
      return comp;
    },
  });
});
