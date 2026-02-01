import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-utils": [
            "@tanstack/react-query",
            "react-hook-form",
            "react-hot-toast",
          ],
          "vendor-charts": ["recharts"],
          "vendor-supabase": ["@supabase/supabase-js"],
        },
      },
    },
  },
});
