import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/", // <-- IMPORTANTE: para que funcione bien en el dominio raíz
  server: {
    host: true,
    port: 5173,
  },
  plugins: [tailwindcss(), react()],
});
