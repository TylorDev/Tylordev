import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "node:fs/promises";
import path from "node:path";

const DEV_GITHUB_API_PREFIX = "/__dev/github-api";

interface ProjectAssetIndexEntry {
  name: string;
  coverImageSrc?: string;
  bannerImage?: string;
  sectionImages: string[];
}

const PROJECT_IMAGE_EXTENSIONS = ["avif", "webp", "png", "jpeg", "jpg"] as const;

function publicProjectUrl(projectName: string, fileName: string): string {
  return `/Projects/${encodeURIComponent(projectName)}/${encodeURIComponent(fileName)}`;
}

function preferredProjectImage(baseName: string, fileNames: string[]): string | undefined {
  const availableFiles = new Set(fileNames);
  return PROJECT_IMAGE_EXTENSIONS
    .map((extension) => `${baseName}.${extension}`)
    .find((fileName) => availableFiles.has(fileName));
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function readLocalEnvValue(envText: string, key: string): string | undefined {
  const line = envText
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .find((entry) => entry && !entry.startsWith("#") && entry.startsWith(`${key}=`));

  if (!line) return undefined;

  const value = line.slice(key.length + 1).trim();
  return value.replace(/^["']|["']$/g, "") || undefined;
}

async function readLocalGithubToken(): Promise<string | undefined> {
  const envFiles = [".env.local", ".env"];

  for (const fileName of envFiles) {
    try {
      const envText = await fs.readFile(path.resolve(__dirname, fileName), "utf8");
      const token = readLocalEnvValue(envText, "GITHUB_TOKEN");
      if (token) return token;
    } catch {
      // Missing local env files are fine in dev.
    }
  }

  return undefined;
}

function githubDevProxy(): Plugin {
  return {
    name: "github-dev-proxy",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(DEV_GITHUB_API_PREFIX, async (req, res) => {
        try {
          const rawUrl = req.url ?? "";
          const githubPath = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
          const targetUrl = `https://api.github.com${githubPath}`;
          const token = await readLocalGithubToken();
          const headers: HeadersInit = {
            Accept: "application/vnd.github+json",
            "User-Agent": "Tylordev-local-dev",
          };

          if (token) {
            headers.Authorization = `Bearer ${token}`;
          }

          const response = await fetch(targetUrl, { headers });
          const body = await response.arrayBuffer();

          res.statusCode = response.status;
          res.setHeader("Content-Type", response.headers.get("content-type") ?? "application/json; charset=utf-8");
          res.setHeader("Cache-Control", "no-store");
          res.end(Buffer.from(body));
        } catch {
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ error: "Failed to proxy GitHub API request." }));
        }
      });
    },
  };
}

function projectsWhitelistIndex(): Plugin {
  const projectsDir = path.resolve(__dirname, "public", "Projects");
  const projectsPattern = "public/Projects/**/*";

  const readProjectIndex = async (): Promise<ProjectAssetIndexEntry[]> => {
    if (!(await pathExists(projectsDir))) return [];

    const entries = await fs.readdir(projectsDir, { withFileTypes: true });
    const projects = await Promise.all(
      entries
        .filter((entry) => entry.isDirectory())
        .map(async (entry) => {
          const projectDir = path.join(projectsDir, entry.name);
          const files = await fs.readdir(projectDir, { withFileTypes: true });
          const fileNames = files.filter((file) => file.isFile()).map((file) => file.name);
          const sectionIndexes = Array.from(
            new Set(
              fileNames
                .map((fileName) => fileName.match(/^Seccion_(\d+)\.(?:avif|webp|png|jpeg|jpg)$/)?.[1])
                .filter((index): index is string => index !== undefined)
                .map(Number)
            )
          ).sort((a, b) => a - b);

          const sectionImages = sectionIndexes
            .map((index) => preferredProjectImage(`Seccion_${index}`, fileNames))
            .filter((fileName): fileName is string => fileName !== undefined)
            .map((fileName) => publicProjectUrl(entry.name, fileName));
          const coverImage = preferredProjectImage("Portada", fileNames);
          const bannerImage = preferredProjectImage("Banner", fileNames);

          return {
            name: entry.name,
            coverImageSrc: coverImage ? publicProjectUrl(entry.name, coverImage) : undefined,
            bannerImage: bannerImage ? publicProjectUrl(entry.name, bannerImage) : undefined,
            sectionImages,
          };
        })
    );

    return projects.sort((a, b) => a.name.localeCompare(b.name));
  };

  return {
    name: "projects-whitelist-index",
    configureServer(server) {
      server.watcher.add(projectsPattern);

      server.middlewares.use("/Projects/projects-index.json", async (_req, res) => {
        try {
          const projects = await readProjectIndex();
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.setHeader("Cache-Control", "no-store");
          res.end(JSON.stringify(projects));
        } catch {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ error: "Failed to read project whitelist index." }));
        }
      });

      const notify = (filePath: string) => {
        const normalized = filePath.replace(/\\/g, "/");
        if (!normalized.includes("/public/Projects/")) return;

        server.ws.send({
          type: "custom",
          event: "test-content:update",
          data: { path: normalized },
        });
      };

      server.watcher.on("add", notify);
      server.watcher.on("change", notify);
      server.watcher.on("unlink", notify);
      server.watcher.on("addDir", notify);
      server.watcher.on("unlinkDir", notify);
    },
    async generateBundle() {
      const projects = await readProjectIndex();
      this.emitFile({
        type: "asset",
        fileName: "Projects/projects-index.json",
        source: JSON.stringify(projects),
      });
    },
  };
}

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
  plugins: [react(), githubDevProxy(), projectsWhitelistIndex(), testContentWatcher()],
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
