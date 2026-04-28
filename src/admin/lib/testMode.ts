// Dev-only "Test mode": bypasses GitHub auth and persists projects /
// articles to localStorage instead of hitting the backend. The flag is
// only honoured when import.meta.env.DEV is true, so a stale localStorage
// entry can never enable it in a production build.

import type { AuthSession, RawArticle, RawProject } from "./types";

const FLAG_KEY = "tylordev.admin.testMode";
const PROJECTS_KEY = "tylordev.admin.testProjects";
const ARTICLES_KEY = "tylordev.admin.testArticles";

export const isDevBuild = () => import.meta.env.DEV === true;

export function isTestMode(): boolean {
  if (!isDevBuild()) return false;
  try {
    return localStorage.getItem(FLAG_KEY) === "1";
  } catch {
    return false;
  }
}

export function enableTestMode(): void {
  if (!isDevBuild()) return;
  localStorage.setItem(FLAG_KEY, "1");
}

export function disableTestMode(): void {
  localStorage.removeItem(FLAG_KEY);
}

export const testSession: AuthSession = {
  githubId: 0,
  login: "test-mode",
  name: "Test mode (local)",
  avatarUrl: null,
};

function readList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, list: T[]): void {
  localStorage.setItem(key, JSON.stringify(list));
}

// ─── Projects ────────────────────────────────────────────────────────────
export const tmListProjects = async (): Promise<RawProject[]> =>
  readList<RawProject>(PROJECTS_KEY);

export const tmGetProject = async (slug: string): Promise<RawProject> => {
  const found = readList<RawProject>(PROJECTS_KEY).find((p) => p.slug === slug);
  if (!found) throw new Error(`Test mode: project "${slug}" not found.`);
  return found;
};

export const tmCreateProject = async (payload: RawProject): Promise<RawProject> => {
  const list = readList<RawProject>(PROJECTS_KEY);
  if (list.some((p) => p.slug === payload.slug)) {
    throw new Error(`Test mode: project "${payload.slug}" already exists.`);
  }
  writeList(PROJECTS_KEY, [payload, ...list]);
  return payload;
};

export const tmUpdateProject = async (
  slug: string,
  payload: RawProject
): Promise<RawProject> => {
  const list = readList<RawProject>(PROJECTS_KEY);
  if (!list.some((p) => p.slug === slug)) {
    throw new Error(`Test mode: project "${slug}" not found.`);
  }
  writeList(
    PROJECTS_KEY,
    list.map((p) => (p.slug === slug ? payload : p))
  );
  return payload;
};

export const tmDeleteProject = async (slug: string): Promise<void> => {
  writeList(
    PROJECTS_KEY,
    readList<RawProject>(PROJECTS_KEY).filter((p) => p.slug !== slug)
  );
};

// ─── Articles ────────────────────────────────────────────────────────────
export const tmListArticles = async (): Promise<RawArticle[]> =>
  readList<RawArticle>(ARTICLES_KEY);

export const tmGetArticle = async (slug: string): Promise<RawArticle> => {
  const found = readList<RawArticle>(ARTICLES_KEY).find((a) => a.slug === slug);
  if (!found) throw new Error(`Test mode: article "${slug}" not found.`);
  return found;
};

export const tmCreateArticle = async (payload: RawArticle): Promise<RawArticle> => {
  const list = readList<RawArticle>(ARTICLES_KEY);
  if (list.some((a) => a.slug === payload.slug)) {
    throw new Error(`Test mode: article "${payload.slug}" already exists.`);
  }
  writeList(ARTICLES_KEY, [payload, ...list]);
  return payload;
};

export const tmUpdateArticle = async (
  slug: string,
  payload: RawArticle
): Promise<RawArticle> => {
  const list = readList<RawArticle>(ARTICLES_KEY);
  if (!list.some((a) => a.slug === slug)) {
    throw new Error(`Test mode: article "${slug}" not found.`);
  }
  writeList(
    ARTICLES_KEY,
    list.map((a) => (a.slug === slug ? payload : a))
  );
  return payload;
};

export const tmDeleteArticle = async (slug: string): Promise<void> => {
  writeList(
    ARTICLES_KEY,
    readList<RawArticle>(ARTICLES_KEY).filter((a) => a.slug !== slug)
  );
};
