// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["vitest.setup.ts"], // <— ruta desde la raíz del repo
    isolate: true,
    clearMocks: true,
    restoreMocks: false,
    mockReset: false,
  },
  resolve: {
    dedupe: ["react", "react-dom"], // evita dos copias de React en tests
  },
});
