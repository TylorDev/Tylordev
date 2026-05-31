import type { RawButton, RawProject, RawSection, RawTranslation } from "./types";

const GITHUB_USER = "TylorDev";
const GITHUB_REPOS_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`;
const WIKI_LOCALE_SEPARATOR = "\u2010";
const LOCAL_TEST_BASE = "/Test";
const LOCAL_PROJECTS_INDEX_URL = `${LOCAL_TEST_BASE}/projects-index.json`;
const REMOTE_FETCH_TIMEOUT_MS = 3500;

const RAW_SHAPE_HEADING = "## RawProject shape in Markdown";
const TRANSLATION_PATCH_HEADING = "## RawProject translation patch in Markdown";

const fieldLine = /^\s*(?:-\s*)?[A-Za-z][A-Za-z0-9 /]*:\s*/;

interface GithubRepo {
  name: string;
  description: string | null;
  homepage: string | null;
  topics: string[];
  pushed_at: string | null;
}

interface LocalProjectIndexEntry {
  name: string;
  fileName: string;
}

let remoteProjectsPromise: Promise<RawProject[]> | null = null;

function createTimeoutSignal(timeoutMs: number): AbortSignal {
  const ctrl = new AbortController();
  globalThis.setTimeout(() => ctrl.abort(), timeoutMs);
  return ctrl.signal;
}

interface ProjectTranslationPatch {
  locale: string;
  translation?: RawTranslation;
  buttonTexts: string[];
  sectionTranslations: RawTranslation[];
}

const SOURCE_CODE_LABELS = ["source code", "codigo fuente", "codigo fonte"];
const LIVE_PREVIEW_LABELS = ["live preview", "see preview", "vista previa", "pre-visualizacao"];
const READ_MORE_BY_LOCALE: Record<string, string> = {
  "en-us": "Read more",
  "es-mx": "Leer mas",
  "pt-br": "Ler mais",
};
const CLOSE_BY_LOCALE: Record<string, string> = {
  "en-us": "X",
  "es-mx": "X",
  "pt-br": "X",
};
const TOPIC_TO_TECH: Record<string, string> = {
  react: "React",
  reactjs: "React",
  typescript: "TypeScript",
  ts: "TypeScript",
  javascript: "JavaScript",
  js: "JavaScript",
  tailwind: "Tailwind CSS",
  tailwindcss: "Tailwind CSS",
  vite: "Vite",
  node: "Node.js",
  nodejs: "Node.js",
  express: "Express",
  nestjs: "NestJS",
  postgres: "PostgreSQL",
  postgresql: "PostgreSQL",
  mysql: "MySQL",
  mongodb: "MongoDB",
  mongo: "MongoDB",
  prisma: "Prisma",
  typeorm: "TypeORM",
  docker: "Docker",
  git: "Git",
  electron: "Electron",
  next: "Next.js",
  nextjs: "Next.js",
  html: "HTML5",
  html5: "HTML5",
  css: "CSS3",
  css3: "CSS3",
  scss: "CSS3",
  sass: "CSS3",
  csharp: "C# / .NET",
  dotnet: "C# / .NET",
  ".net": "C# / .NET",
  cpp: "C++",
  "c++": "C++",
};
const TOPIC_TO_TYPE: Record<string, string> = {
  discord: "Discord Bot",
  "discord-bot": "Discord Bot",
  bot: "Discord Bot",
  fullstack: "Full-stack",
  "full-stack": "Full-stack",
  "full-stack-app": "Full-stack",
  backend: "Backend",
  api: "Backend",
  server: "Backend",
  serverless: "Backend",
  frontend: "Frontend",
  ui: "Frontend",
  web: "Frontend",
  webapp: "Frontend",
  website: "Frontend",
  react: "Frontend",
  next: "Frontend",
  vite: "Frontend",
  desktop: "Desktop",
  electron: "Desktop",
  mobile: "Mobile",
  android: "Mobile",
  ios: "Mobile",
  "react-native": "Mobile",
  "design-system": "Design System",
  "component-library": "Design System",
  "ui-kit": "Design System",
};
const TYPE_TOPIC_PRIORITY = [
  "discord",
  "discord-bot",
  "bot",
  "fullstack",
  "full-stack",
  "full-stack-app",
  "backend",
  "api",
  "server",
  "serverless",
  "frontend",
  "ui",
  "web",
  "webapp",
  "website",
  "react",
  "next",
  "vite",
  "desktop",
  "electron",
  "mobile",
  "android",
  "ios",
  "react-native",
  "design-system",
  "component-library",
  "ui-kit",
];

function slugifyRepoName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeLines(markdown: string): string[] {
  const lines: string[] = [];
  for (const rawLine of markdown.replace(/\r\n/g, "\n").split("\n")) {
    if (!rawLine.trim()) {
      lines.push("");
      continue;
    }
    if (fieldLine.test(rawLine) || lines.length === 0 || lines[lines.length - 1] === "") {
      lines.push(rawLine);
      continue;
    }
    lines[lines.length - 1] = `${lines[lines.length - 1]} ${rawLine.trim()}`;
  }
  return lines;
}

function getRawShape(markdown: string): string | null {
  const start = markdown.indexOf(RAW_SHAPE_HEADING);
  if (start === -1) return null;

  const rest = markdown.slice(start + RAW_SHAPE_HEADING.length);
  const nextHeading = rest.search(/\n##\s+/);
  return nextHeading === -1 ? rest : rest.slice(0, nextHeading);
}

function getTranslationPatchShape(markdown: string): string | null {
  const start = markdown.indexOf(TRANSLATION_PATCH_HEADING);
  if (start === -1) return null;

  const rest = markdown.slice(start + TRANSLATION_PATCH_HEADING.length);
  const nextHeading = rest.search(/\n##\s+/);
  return nextHeading === -1 ? rest : rest.slice(0, nextHeading);
}

function scalar(lines: string[], key: string): string | undefined {
  const prefix = `${key}:`;
  const found = lines.find((line) => line.trim().startsWith(prefix));
  return found?.trim().slice(prefix.length).trim();
}

function bullet(lines: string[], key: string): string | undefined {
  const prefix = `- ${key}:`;
  const found = lines.find((line) => line.trim().startsWith(prefix));
  return found?.trim().slice(prefix.length).trim();
}

function extractMarkdownImageSrc(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return trimmed;

  const imgMatch = trimmed.match(/<img\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1[^>]*>/i);
  return imgMatch?.[2]?.trim() || trimmed;
}

function blockBetween(lines: string[], startKey: string, endKeys: string[]): string[] {
  const start = lines.findIndex((line) => line.trim() === `${startKey}:`);
  if (start === -1) return [];

  const end = lines.findIndex(
    (line, index) => index > start && endKeys.some((key) => line.trim() === `${key}:`)
  );
  return lines.slice(start + 1, end === -1 ? undefined : end);
}

function hasUsefulContent(lines: string[]): boolean {
  return lines.some((line) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    return !trimmed.endsWith(":");
  });
}

function defaultReadMore(locale: string): string {
  return READ_MORE_BY_LOCALE[locale] ?? READ_MORE_BY_LOCALE["en-us"];
}

function defaultClose(locale: string): string {
  return CLOSE_BY_LOCALE[locale] ?? CLOSE_BY_LOCALE["en-us"];
}

function parseButtonTranslations(lines: string[], start: number, end: number): RawTranslation[] {
  const translations: RawTranslation[] = [];
  let current: RawTranslation | null = null;

  for (let i = start; i < end; i += 1) {
    const line = lines[i].trim();
    if (line.startsWith("- locale:")) {
      if (current?.locale) translations.push(current);
      current = { locale: line.slice("- locale:".length).trim() };
      continue;
    }
    if (line.startsWith("- text:") && current) {
      current.text = line.slice("- text:".length).trim();
    }
  }

  if (current?.locale) translations.push(current);
  return translations;
}

function parseButtons(sharedLines: string[]): RawButton[] {
  const start = sharedLines.findIndex((line) => line.trim() === "- buttons:");
  if (start === -1) return [];

  const buttonLines = sharedLines.slice(start + 1);
  const iconIndexes = buttonLines
    .map((line, index) => (line.trim().startsWith("- icon:") ? index : -1))
    .filter((index) => index >= 0);

  return iconIndexes
    .map((index, position) => {
      const end = iconIndexes[position + 1] ?? buttonLines.length;
      const chunk = buttonLines.slice(index, end);
      const translationsStart = chunk.findIndex((line) => line.trim() === "- translations:");

      return {
        icon: bullet(chunk, "icon"),
        url: bullet(chunk, "url"),
        translations:
          translationsStart === -1
            ? []
            : parseButtonTranslations(chunk, translationsStart + 1, chunk.length),
      };
    })
    .filter((button) => button.icon || button.url || button.translations.length > 0);
}

function parseTranslations(lines: string[]): RawTranslation[] {
  const localeIndexes = lines
    .map((line, index) => (line.trim().startsWith("- locale:") ? index : -1))
    .filter((index) => index >= 0);

  return localeIndexes
    .map((index, position) => {
      const chunk = lines.slice(index, localeIndexes[position + 1] ?? lines.length);
      return {
        locale: bullet(chunk, "locale") ?? "",
        subtitle: bullet(chunk, "subtitle") ?? "",
      };
    })
    .filter((translation) => translation.locale && translation.subtitle);
}

function parseSectionTranslations(lines: string[]): RawTranslation[] {
  const localeIndexes = lines
    .map((line, index) => (line.trim().startsWith("- locale:") ? index : -1))
    .filter((index) => index >= 0);

  return localeIndexes
    .map((index, position) => {
      const chunk = lines.slice(index, localeIndexes[position + 1] ?? lines.length);
      const locale = bullet(chunk, "locale") ?? "";
      return {
        locale,
        summary: bullet(chunk, "summary") ?? "",
        readMore: bullet(chunk, "readMore") ?? defaultReadMore(locale),
        modalContent: bullet(chunk, "modalContent") ?? "",
        close: bullet(chunk, "close") ?? defaultClose(locale),
      };
    })
    .filter((translation) => translation.locale);
}

function parseSections(lines: string[]): RawSection[] {
  const sectionIndexes = lines
    .map((line, index) => (line.trim().startsWith("- flexDirection:") ? index : -1))
    .filter((index) => index >= 0);

  return sectionIndexes.map((index, position) => {
    const chunk = lines.slice(index, sectionIndexes[position + 1] ?? lines.length);
    const translationsStart = chunk.findIndex((line) => line.trim() === "- translations:");

    return {
      flexDirection: bullet(chunk, "flexDirection"),
      coverImage: extractMarkdownImageSrc(bullet(chunk, "coverImage")),
      translations:
        translationsStart === -1
          ? []
          : parseSectionTranslations(chunk.slice(translationsStart + 1)),
    };
  });
}

function parsePatchSections(lines: string[], locale: string): RawTranslation[] {
  let sectionIndexes = lines
    .map((line, index) => (line.trim().startsWith("- summary:") ? index : -1))
    .filter((index) => index >= 0);

  if (sectionIndexes.length === 0) {
    sectionIndexes = lines
      .map((line, index) => (line.trim().startsWith("- modalContent:") ? index : -1))
      .filter((index) => index >= 0);
  }

  return sectionIndexes.map((index, position) => {
    const chunk = lines.slice(index, sectionIndexes[position + 1] ?? lines.length);
    return {
      locale,
      summary: bullet(chunk, "summary") ?? "",
      readMore: bullet(chunk, "readMore") ?? defaultReadMore(locale),
      modalContent: bullet(chunk, "modalContent") ?? "",
      close: bullet(chunk, "close") ?? defaultClose(locale),
    };
  });
}

function upsertTranslation<T extends { locale: string }>(list: T[] | undefined, translation: T): T[] {
  const existing = list ?? [];
  if (!existing.some((item) => item.locale === translation.locale)) {
    return [...existing, translation];
  }
  return existing.map((item) =>
    item.locale === translation.locale ? { ...item, ...translation } : item
  );
}

function applyTranslationPatch(project: RawProject, patch: ProjectTranslationPatch): RawProject {
  const next: RawProject = {
    ...project,
    shared: {
      ...project.shared,
      buttons: (project.shared.buttons ?? []).map((button, index) => {
        const text = patch.buttonTexts[index];
        if (!text) return button;
        return {
          ...button,
          translations: upsertTranslation(button.translations, {
            locale: patch.locale,
            text,
          }),
        };
      }),
    },
    translations: patch.translation
      ? upsertTranslation(project.translations, patch.translation)
      : project.translations,
    sections: (project.sections ?? []).map((section, index) => {
      const translation = patch.sectionTranslations[index];
      if (!translation) return section;
      return {
        ...section,
        translations: upsertTranslation(section.translations, translation),
      };
    }),
  };

  return next;
}

function repoGithubUrl(repoName: string): string {
  return `https://github.com/${GITHUB_USER}/${repoName}`;
}

function normalizeButtonText(text: unknown): string {
  return typeof text === "string"
    ? text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    : "";
}

function isSourceCodeButton(button: RawButton): boolean {
  if (button.icon === "github") return true;
  return (button.translations ?? []).some((translation) => {
    return SOURCE_CODE_LABELS.includes(normalizeButtonText(translation.text));
  });
}

function isLivePreviewButton(button: RawButton): boolean {
  if (button.icon === "preview") return true;
  return (button.translations ?? []).some((translation) => {
    return LIVE_PREVIEW_LABELS.includes(normalizeButtonText(translation.text));
  });
}

function compactButtons(buttons: RawButton[], priorityButtons: RawButton[]): RawButton[] {
  const prioritized = new Set(priorityButtons);
  return [...priorityButtons, ...buttons.filter((button) => !prioritized.has(button))];
}

function ensureRemoteButtons(project: RawProject, repoName: string, website: string | null): RawProject {
  const repoUrl = repoGithubUrl(repoName);
  const buttons = project.shared.buttons ?? [];
  const sourceIndex = buttons.findIndex(isSourceCodeButton);
  const previewIndex = buttons.findIndex(isLivePreviewButton);

  const sourceButton =
    sourceIndex === -1
      ? {
          icon: "github",
          url: repoUrl,
          translations: [
            { locale: "en-us", text: "Source Code" },
            { locale: "es-mx", text: "Codigo fuente" },
            { locale: "pt-br", text: "Codigo fonte" },
          ],
        }
      : { ...buttons[sourceIndex], icon: "github", url: repoUrl };

  const livePreviewUrl = website?.trim();
  const previewButton =
    previewIndex === -1
      ? livePreviewUrl
        ? {
            icon: "preview",
            url: livePreviewUrl,
            translations: [
              { locale: "en-us", text: "Live Preview" },
              { locale: "es-mx", text: "Vista Previa" },
              { locale: "pt-br", text: "Pre-visualizacao" },
            ],
          }
        : undefined
      : {
          ...buttons[previewIndex],
          icon: "preview",
          url: livePreviewUrl || buttons[previewIndex].url,
        };

  const patchedButtons = buttons.map((button, index) => {
    if (index === sourceIndex) return sourceButton;
    if (previewButton && index === previewIndex) return previewButton;
    return button;
  });

  if (sourceIndex === -1) patchedButtons.push(sourceButton);
  if (previewButton && previewIndex === -1) patchedButtons.unshift(previewButton);

  const priorityButtons = previewButton ? [previewButton, sourceButton] : [sourceButton];

  return {
    ...project,
    shared: {
      ...project.shared,
      buttons: compactButtons(patchedButtons, priorityButtons),
    },
  };
}

function applyRemoteRepoIdentity(project: RawProject, repoName: string, website: string | null): RawProject {
  const nextProject = ensureRemoteButtons(project, repoName, website);
  return {
    ...nextProject,
    shared: {
      ...nextProject.shared,
      title: repoName,
    },
  };
}

function applyRemoteRepoSubtitle(project: RawProject, description: string | null): RawProject {
  const subtitle = description?.trim();
  if (!subtitle) return project;

  return {
    ...project,
    translations: upsertTranslation(project.translations, {
      locale: "en-us",
      subtitle,
    }),
  };
}

function normalizeRepoTopics(topics: string[] | undefined): string[] {
  if (!topics || topics.length === 0) return [];

  const seen = new Set<string>();
  const normalized: string[] = [];

  topics.forEach((topic) => {
    const mapped = TOPIC_TO_TECH[topic.toLowerCase()];
    if (!mapped || seen.has(mapped)) return;
    seen.add(mapped);
    normalized.push(mapped);
  });

  return normalized;
}

function applyRemoteRepoTechnologies(project: RawProject, topics: string[] | undefined): RawProject {
  const technologies = normalizeRepoTopics(topics);
  if (technologies.length === 0) return project;

  return {
    ...project,
    shared: {
      ...project.shared,
      technologies: technologies.join(", "),
    },
  };
}

function detectRepoType(topics: string[] | undefined): string | undefined {
  if (!topics || topics.length === 0) return undefined;

  const normalizedTopics = new Set(topics.map((topic) => topic.toLowerCase()));
  const matchedTopic = TYPE_TOPIC_PRIORITY.find((topic) => normalizedTopics.has(topic));
  return matchedTopic ? TOPIC_TO_TYPE[matchedTopic] : undefined;
}

function applyRemoteRepoType(project: RawProject, topics: string[] | undefined): RawProject {
  if (project.shared.type?.trim()) return project;

  const type = detectRepoType(topics);
  if (!type) return project;

  return {
    ...project,
    shared: {
      ...project.shared,
      type,
    },
  };
}

function applyRemoteRepoPublishedAt(project: RawProject, pushedAt: string | null): RawProject {
  if (!pushedAt) return project;
  return {
    ...project,
    publishedAt: pushedAt,
  };
}

export function parseMarkdownProject(markdown: string): RawProject | null {
  const rawShape = getRawShape(markdown);
  if (!rawShape) return null;

  const lines = normalizeLines(rawShape);
  if (!hasUsefulContent(lines)) return null;

  const sharedLines = blockBetween(lines, "shared", ["translations", "sections"]);
  const translationLines = blockBetween(lines, "translations", ["sections"]);
  const sectionLines = blockBetween(lines, "sections", []);

  const project: RawProject = {
    slug: scalar(lines, "slug") ?? "",
    publishedAt: scalar(lines, "publishedAt") === "null" ? null : scalar(lines, "publishedAt"),
    shared: {
      title: bullet(sharedLines, "title"),
      coverImageSrc: extractMarkdownImageSrc(bullet(sharedLines, "coverImageSrc")),
      backgroundImage: extractMarkdownImageSrc(bullet(sharedLines, "backgroundImage")),
      status: bullet(sharedLines, "status"),
      type: bullet(sharedLines, "type"),
      technologies: bullet(sharedLines, "technologies"),
      buttons: parseButtons(sharedLines),
    },
    translations: parseTranslations(translationLines),
    sections: parseSections(sectionLines),
  };

  return project;
}

export function parseMarkdownProjectTranslationPatch(
  markdown: string,
  expectedLocale?: string
): ProjectTranslationPatch | null {
  const rawShape = getTranslationPatchShape(markdown);
  if (!rawShape) return null;

  const lines = normalizeLines(rawShape);
  if (!hasUsefulContent(lines)) return null;

  const locale = expectedLocale ?? scalar(lines, "locale") ?? "";
  if (!locale) return null;

  const translationLines = blockBetween(lines, "translation", ["buttons", "sections"]);
  const buttonLines = blockBetween(lines, "buttons", ["sections"]);
  const sectionLines = blockBetween(lines, "sections", []);
  const subtitle = bullet(translationLines, "subtitle");

  return {
    locale,
    translation: subtitle ? { locale, subtitle } : undefined,
    buttonTexts: buttonLines
      .map((line) => (line.trim().startsWith("- text:") ? line.trim().slice("- text:".length).trim() : ""))
      .filter(Boolean),
    sectionTranslations: parsePatchSections(sectionLines, locale),
  };
}

async function fetchText(url: string, signal?: AbortSignal): Promise<string | null> {
  try {
    const res = await fetch(url, { signal, cache: import.meta.env.DEV ? "no-store" : "default" });
    if (!res.ok) return null;
    return res.text();
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") throw err;
    return null;
  }
}

function wikiMarkdownUrl(repoName: string, fileName: string): string {
  return `https://raw.githubusercontent.com/wiki/${GITHUB_USER}/${repoName}/${encodeURIComponent(fileName)}`;
}

function localMarkdownFileName(repoName: string, locale?: "es" | "pt"): string {
  return locale ? `${repoName}-${locale}.md` : `${repoName}.md`;
}

function markdownUrl(repoName: string, locale?: "es" | "pt"): string {
  if (import.meta.env.DEV) {
    return `${LOCAL_TEST_BASE}/${encodeURIComponent(localMarkdownFileName(repoName, locale))}`;
  }

  return wikiMarkdownUrl(
    repoName,
    locale ? `${repoName}${WIKI_LOCALE_SEPARATOR}${locale}.md` : `${repoName}.md`
  );
}

function reposUrl(): string {
  return import.meta.env.DEV ? `${LOCAL_TEST_BASE}/repos.json` : GITHUB_REPOS_URL;
}

function normalizeGithubRepo(repo: Partial<GithubRepo>, name: string): GithubRepo {
  return {
    name,
    description: typeof repo.description === "string" ? repo.description : null,
    homepage: typeof repo.homepage === "string" ? repo.homepage : null,
    topics: Array.isArray(repo.topics) ? repo.topics.filter((topic) => typeof topic === "string") : [],
    pushed_at: typeof repo.pushed_at === "string" ? repo.pushed_at : null,
  };
}

async function loadLocalTestRepos(signal: AbortSignal): Promise<GithubRepo[]> {
  const [indexRes, templateRes] = await Promise.all([
    fetch(LOCAL_PROJECTS_INDEX_URL, {
      signal,
      cache: "no-store",
    }),
    fetch(reposUrl(), {
      signal,
      cache: "no-store",
    }),
  ]);

  if (!indexRes.ok) return [];

  const index = (await indexRes.json()) as LocalProjectIndexEntry[];
  const templates = templateRes.ok ? ((await templateRes.json()) as Partial<GithubRepo>[]) : [];
  const template = templates[0] ?? {};

  return index
    .filter((entry) => entry.name && entry.fileName)
    .map((entry) => normalizeGithubRepo(template, entry.name));
}

async function loadGithubRepos(signal: AbortSignal): Promise<GithubRepo[]> {
  const reposRes = await fetch(reposUrl(), {
    signal,
    cache: "default",
  });
  if (!reposRes.ok) return [];

  return (await reposRes.json()) as GithubRepo[];
}

async function loadRemoteMarkdownProjects(): Promise<RawProject[]> {
  try {
    const signal = createTimeoutSignal(REMOTE_FETCH_TIMEOUT_MS);
    const repos = import.meta.env.DEV
      ? await loadLocalTestRepos(signal)
      : await loadGithubRepos(signal);

    const projects = await Promise.all(
      repos
        .filter((repo) => repo.name)
        .map(async (repo) => {
          const markdown = await fetchText(markdownUrl(repo.name), signal);
          const project = markdown ? parseMarkdownProject(markdown) : null;
          if (!project) return null;

          const patches = await Promise.all([
            fetchText(markdownUrl(repo.name, "es"), signal).then((patchMarkdown) =>
              patchMarkdown ? parseMarkdownProjectTranslationPatch(patchMarkdown, "es-mx") : null
            ),
            fetchText(markdownUrl(repo.name, "pt"), signal).then((patchMarkdown) =>
              patchMarkdown ? parseMarkdownProjectTranslationPatch(patchMarkdown, "pt-br") : null
            ),
          ]);

          const mergedProject = patches
            .filter((patch): patch is ProjectTranslationPatch => patch !== null)
            .reduce(
              (nextProject, patch) => applyTranslationPatch(nextProject, patch),
              { ...project, slug: slugifyRepoName(repo.name) }
            );

          return applyRemoteRepoIdentity(
            applyRemoteRepoPublishedAt(
              applyRemoteRepoType(
                applyRemoteRepoTechnologies(
                  applyRemoteRepoSubtitle(mergedProject, repo.description),
                  repo.topics
                ),
                repo.topics
              ),
              repo.pushed_at
            ),
            repo.name,
            repo.homepage
          );
        })
    );

    return projects.filter((project): project is RawProject => project !== null);
  } catch (err) {
    return [];
  }
}

export function fetchRemoteMarkdownProjects(): Promise<RawProject[]> {
  if (!remoteProjectsPromise) {
    remoteProjectsPromise = loadRemoteMarkdownProjects();
  }
  return remoteProjectsPromise;
}

export function invalidateRemoteMarkdownProjectsCache() {
  remoteProjectsPromise = null;
}
