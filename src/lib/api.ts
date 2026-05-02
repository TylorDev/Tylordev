import { exampleArticles, exampleProjects, getPageFixture } from "./fixtures";
import { fetchRemotePage } from "./staticContent";
import type { Article, Locale, Project, RawArticle, RawProject } from "./types";

const DEFAULT_API_URL = import.meta.env.DEV
  ? "http://localhost:4000"
  : "https://tylordev-backend-production.up.railway.app";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? DEFAULT_API_URL;
export const apiUrl = (path: string) => `${API_URL}${path}`;

interface CacheEntry<T> {
  data: T;
  t: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
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

// Projects + articles: live Railway API with fixture fallback so the
// portfolio never renders an empty state when the API is unreachable
// (e.g. CORS misconfiguration, network error) or returns an empty list.
const isAbort = (err: unknown): boolean =>
  err instanceof Error && err.name === "AbortError";

class UnpublishedContentError extends Error {
  constructor(kind: "project" | "article") {
    super(`${kind} is not published.`);
  }
}

const isPublished = (item: { publishedAt?: string | null }): boolean =>
  Boolean(item.publishedAt);

export const fetchProjects = async (signal?: AbortSignal): Promise<RawProject[]> => {
  try {
    const list = await cachedJson<RawProject[]>(apiUrl("/projects"), signal);
    return list.length > 0 ? list.filter(isPublished) : exampleProjects;
  } catch (err) {
    if (isAbort(err)) throw err;
    console.warn("[api] /projects failed, falling back to example projects:", err);
    return exampleProjects;
  }
};

export const fetchProject = async (slug: string, signal?: AbortSignal): Promise<RawProject> => {
  try {
    const project = await cachedJson<RawProject>(apiUrl(`/projects/${slug}`), signal);
    if (!isPublished(project)) throw new UnpublishedContentError("project");
    return project;
  } catch (err) {
    if (isAbort(err) || err instanceof UnpublishedContentError) throw err;
    const found = exampleProjects.find((p) => p.slug === slug);
    if (found) {
      console.warn(`[api] /projects/${slug} failed, falling back to example project:`, err);
      return found;
    }
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
 * Page content: remote GitHub raw first, fixture fallback.
 * The remote JSON merges section by section — if the remote has "Hero" but
 * not "About", About still comes from fixtures.ts.
 */
export async function fetchPage<T>(lang: string, name: string): Promise<T> {
  const remote = await fetchRemotePage<T>(lang, name);
  if (remote !== null) return remote;

  const fixture = getPageFixture<T>(lang as Locale, name);
  if (!fixture) throw new Error(`Unknown page fixture "${name}"`);
  return fixture;
}

export function invalidateCache() {
  cache.clear();
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

export const CONTACT_FORM_URL =
  "https://docs.google.com/forms/u/0/d/e/1FAIpQLSe90nNoZ9Ro9VquD51WqJwE_yUUJvYTQ3N7WQ_wU0Hbs8lEPw/formResponse";

export const CONTACT_FIELDS = {
  name: "entry.1873119902",
  email: "entry.1965438775",
  message: "entry.1909091615",
} as const;
