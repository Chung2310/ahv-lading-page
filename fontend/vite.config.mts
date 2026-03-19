import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy backend local to avoid CORS in dev
      "/api/v1": {
        target: "http://localhost:5005",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

