
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: `${import.meta.env.VITE_API_URL}`,  // Ensure VITE_API_URL is defined in .env
        changeOrigin: true, // This will help with cross-origin requests
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
