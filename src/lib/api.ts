import { exampleArticles } from "./fixtures";
import {
  fetchRemoteMarkdownProjects,
  invalidateRemoteMarkdownProjectsCache,
  isWhitelistedProjectRepoName,
  isWhitelistedProjectSlug,
} from "./markdownProjects";
import { fetchRemotePage } from "./staticContent";
import type { Article, Locale, Project, RawArticle, RawProject } from "./types";

const DEFAULT_API_URL = import.meta.env.DEV
  ? "http://localhost:4000"
  : "https://tylordev-backend-production.up.railway.app";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? DEFAULT_API_URL;
export const apiUrl = (path: string) => `${API_URL}${path}`;
const shouldFetchApi = Boolean(import.meta.env.VITE_API_URL) || !import.meta.env.DEV;

interface CacheEntry<T> {
  data: T;
  t: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const pagePromiseCache = new Map<string, Promise<unknown>>();
const TTL = 5 * 60 * 1000;

async function cachedJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const hit = cache.get(url) as CacheEntry<T> | undefined;
  if (hit && Date.now() - hit.t < TTL) return hit.data;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
  const data = (await res.json()) as T;
  cache.set(url, { data, t: Date.now() });
  return data;
}

// Projects come from real whitelisted markdown/wiki content. Articles still
// keep fixture fallback so non-project pages can remain populated offline.
const isAbort = (err: unknown): boolean =>
  err instanceof Error && err.name === "AbortError";

class UnpublishedContentError extends Error {
  constructor(kind: "project" | "article") {
    super(`${kind} is not published.`);
  }
}

const isPublished = (item: { publishedAt?: string | null }): boolean =>
  Boolean(item.publishedAt);

const isWhitelistedProject = (project: RawProject): boolean =>
  isWhitelistedProjectSlug(project.slug) ||
  isWhitelistedProjectRepoName(project.shared?.title);

const filterPublishedWhitelistedProjects = (projects: RawProject[]): RawProject[] =>
  projects.filter(isPublished).filter(isWhitelistedProject);

export const fetchProjects = async (signal?: AbortSignal): Promise<RawProject[]> => {
  const remoteProjects = await fetchRemoteMarkdownProjects();

  if (remoteProjects && remoteProjects.length > 0) {
    return remoteProjects;
  }

  if (!shouldFetchApi) {
    return [];
  }

  try {
    const list = await cachedJson<RawProject[]>(apiUrl("/projects"), signal);
    return filterPublishedWhitelistedProjects(list);
  } catch (err) {
    if (isAbort(err)) throw err;
    console.warn("[api] /projects failed, returning no projects:", err);
    return [];
  }
};

export const fetchProject = async (slug: string, signal?: AbortSignal): Promise<RawProject> => {
  if (!isWhitelistedProjectSlug(slug)) {
    throw new Error(`Project "${slug}" not found.`);
  }

  const remoteProject = (await fetchRemoteMarkdownProjects()).find((p) => p.slug === slug);
  if (remoteProject) return remoteProject;

  if (!shouldFetchApi) {
    throw new Error(`Project "${slug}" not found.`);
  }

  try {
    const project = await cachedJson<RawProject>(apiUrl(`/projects/${slug}`), signal);
    if (!isPublished(project) || !isWhitelistedProject(project)) {
      throw new UnpublishedContentError("project");
    }
    return project;
  } catch (err) {
    if (isAbort(err) || err instanceof UnpublishedContentError) throw err;
    throw err;
  }
};

export const fetchArticles = async (signal?: AbortSignal): Promise<RawArticle[]> => {
  try {
    const list = await cachedJson<RawArticle[]>(apiUrl("/articles"), signal);
    return list.length > 0 ? list.filter(isPublished) : exampleArticles;
  } catch (err) {
    if (isAbort(err)) throw err;
    console.warn("[api] /articles failed, falling back to example articles:", err);
    return exampleArticles;
  }
};

export const fetchArticle = async (slug: string, signal?: AbortSignal): Promise<RawArticle> => {
  try {
    const article = await cachedJson<RawArticle>(apiUrl(`/articles/${slug}`), signal);
    if (!isPublished(article)) throw new UnpublishedContentError("article");
    return article;
  } catch (err) {
    if (isAbort(err) || err instanceof UnpublishedContentError) throw err;
    const found = exampleArticles.find((a) => a.slug === slug);
    if (found) {
      console.warn(`[api] /articles/${slug} failed, falling back to example article:`, err);
      return found;
    }
    throw err;
  }
};

/**
 * Page content: fixed local copy plus remote Identity overlay from the wiki.
 */
export async function fetchPage<T>(lang: string, name: string): Promise<T> {
  const key = `${lang}:${name}`;
  if (!pagePromiseCache.has(key)) {
    pagePromiseCache.set(key, fetchRemotePage<T>(lang, name));
  }

  const page = await pagePromiseCache.get(key) as T | null;
  if (!page) throw new Error(`Unknown page "${name}"`);
  return page;
}

export function invalidateCache() {
  cache.clear();
  pagePromiseCache.clear();
  invalidateRemoteMarkdownProjectsCache();
}

const formatDate = (s?: string | null): string => {
  if (!s) return "";
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? "" : new Intl.DateTimeFormat("en-GB").format(d);
};

const pickTranslation = <T extends { locale: string }>(
  translations: T[] | undefined,
  locale: Locale
): Partial<T> => translations?.find((t) => t.locale === locale) ?? translations?.[0] ?? {};

export const mapProject = (project: RawProject, locale: Locale): Project => {
  const t = pickTranslation(project.translations, locale);
  return {
    slug: project.slug,
    publishedAt: project.publishedAt,
    data: {
      coverImageSrc: project.shared?.coverImageSrc,
      status: project.shared?.status ?? "",
      type: project.shared?.type ?? "",
      tittle: project.shared?.title ?? "",
      subtitle: t.subtitle ?? "",
      technologies: project.shared?.technologies ?? "",
      date: formatDate(project.publishedAt),
      buttons: (project.shared?.buttons ?? []).map((b) => ({
        text: pickTranslation(b.translations, locale).text ?? "",
        icon: b.icon,
        url: b.url,
      })),
    },
    header: {
      backgroundImage: project.shared?.backgroundImage,
      subtitle: t.subtitle ?? "",
      buttons: (project.shared?.buttons ?? []).map((b) => ({
        text: pickTranslation(b.translations, locale).text ?? "",
        icon: b.icon,
        url: b.url,
      })),
    },
    sections: (project.sections ?? []).map((s) => {
      const st = pickTranslation(s.translations, locale) as {
        summary?: string;
        readMore?: string;
        modalContent?: string;
        close?: string;
      };
      return {
        flexDirection: s.flexDirection,
        coverImage: s.coverImage,
        tmContent: {
          summary: st.summary ?? "",
          readMore: st.readMore ?? "",
          modalContent: st.modalContent ?? "",
          close: st.close ?? "X",
        },
      };
    }),
  };
};

export const mapArticle = (article: RawArticle, locale: Locale): Article => {
  const t = pickTranslation(article.translations, locale);
  return {
    slug: article.slug,
    publishedAt: article.publishedAt,
    data: {
      coverImageSrc: article.shared?.coverImageSrc,
      category: t.category ?? "",
      date: formatDate(article.publishedAt),
      title: t.title ?? "",
      content: t.content ?? "",
      id: article.slug,
    },
    bannerImage: article.shared?.bannerImage,
    contentTitle: t.contentTitle ?? "",
    sections: (article.sections ?? []).map((s) => {
      const st = pickTranslation(s.translations, locale) as {
        title?: string;
        paragraph?: string;
      };
      return {
        tittle: st.title ?? "",
        paragraph: st.paragraph ?? "",
        image: s.image ?? "",
      };
    }),
    researchProps: { style: article.shared?.researchStyle ?? {} },
  };
};
