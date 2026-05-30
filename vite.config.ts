import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

function testContentWatcher(): Plugin {
  const testContentPattern = "public/Test/**/*.{md,json}";

  return {
    name: "test-content-watcher",
    apply: "serve",
    configureServer(server) {
      server.watcher.add(testContentPattern);

      const notify = (filePath: string) => {
        const normalized = filePath.replace(/\\/g, "/");
        if (!normalized.includes("/public/Test/")) return;
        if (!/\.(md|json)$/i.test(normalized)) return;

        server.ws.send({
          type: "custom",
          event: "test-content:update",
          data: { path: normalized },
        });
      };

      server.watcher.on("add", notify);
      server.watcher.on("change", notify);
      server.watcher.on("unlink", notify);
    },
  };
}

export default defineConfig({
  base: "/",
  plugins: [react(), testContentWatcher()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
        additionalData: `@use "@/styles/_tokens.scss" as *;`,
      },
    },
  },
  build: {
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          form: ["react-hook-form"],
          icons: ["react-icons"],
        },
      },
    },
  },
  server: { port: 5173 },
});
