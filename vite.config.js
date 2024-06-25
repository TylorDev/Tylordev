import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Tylordev/",
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "./src/_globals.scss" as *;
        `,
      },
    },
  },
});
