import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "node:fs/promises";
import path from "node:path";

function testContentWatcher(): Plugin {
  const testContentPattern = "public/Test/**/*.{md,json}";
  const testContentDir = path.resolve(__dirname, "public", "Test");
  const rawProjectHeading = "## RawProject shape in Markdown";

  const isBaseProjectMarkdown = (fileName: string) => {
    if (!/\.md$/i.test(fileName)) return false;
    if (/-(es|pt)\.md$/i.test(fileName)) return false;
    if (/^Tylordev(?:-(?:es|pt))?\.md$/i.test(fileName)) return false;
    return true;
  };

  const readProjectIndex = async () => {
    const entries = await fs.readdir(testContentDir, { withFileTypes: true });
    const projects = await Promise.all(
      entries
        .filter((entry) => entry.isFile() && isBaseProjectMarkdown(entry.name))
        .map(async (entry) => {
          const filePath = path.join(testContentDir, entry.name);
          const markdown = await fs.readFile(filePath, "utf8");
          if (!markdown.includes(rawProjectHeading)) return null;

          return {
            name: entry.name.replace(/\.md$/i, ""),
            fileName: entry.name,
          };
        })
    );

    return projects
      .filter((project): project is { name: string; fileName: string } => project !== null)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  return {
    name: "test-content-watcher",
    apply: "serve",
    configureServer(server) {
      server.watcher.add(testContentPattern);

      server.middlewares.use("/Test/projects-index.json", async (_req, res) => {
        try {
          const projects = await readProjectIndex();
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.setHeader("Cache-Control", "no-store");
          res.end(JSON.stringify(projects));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ error: "Failed to read test project index." }));
        }
      });

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
