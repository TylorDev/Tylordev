import type {
  Article,
  AuthSession,
  Locale,
  Project,
  RawArticle,
  RawProject,
} from "./types";
import {
  isTestMode,
  testSession,
  tmCreateArticle,
  tmCreateProject,
  tmDeleteArticle,
  tmDeleteProject,
  tmGetArticle,
  tmGetProject,
  tmListArticles,
  tmListProjects,
  tmUpdateArticle,
  tmUpdateProject,
} from "./testMode";

const DEFAULT_API_URL = import.meta.env.DEV
  ? "http://localhost:4000"
  : "https://tylordev-backend-production.up.railway.app";

export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? DEFAULT_API_URL;

export const apiUrl = (path: string) => `${API_URL}${path}`;

// ─── Low-level fetch helpers ─────────────────────────────────────────────
// All admin requests carry the session cookie set by /auth/github/start.

class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function request<T>(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<T> {
  const { json, headers, ...rest } = init ?? {};
  const res = await fetch(apiUrl(path), {
    credentials: "include",
    ...rest,
    headers: {
      ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(headers ?? {}),
    },
    body: json !== undefined ? JSON.stringify(json) : (init?.body as BodyInit | null | undefined),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let body: unknown = text;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      // keep text
    }
    if (res.status === 401) window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    throw new ApiError(res.status, body, `HTTP ${res.status} ${res.statusText}`);
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

export function extractApiError(err: unknown): string {
  if (err instanceof ApiError) {
    const b = err.body as { message?: unknown } | null;
    if (b && typeof b === "object") {
      if (Array.isArray(b.message)) return b.message.map(String).join(", ");
      if (typeof b.message === "string") return b.message;
    }
    if (typeof err.body === "string" && err.body.trim()) return err.body;
    return err.message;
  }
  if (err instanceof Error) return err.message;
  return "Unexpected error.";
}

// ─── Auth ────────────────────────────────────────────────────────────────

export const getSession = () =>
  isTestMode() ? Promise.resolve(testSession) : request<AuthSession>("/auth/session");
export const logout = () =>
  isTestMode() ? Promise.resolve() : request<void>("/auth/logout", { method: "POST" });
export const buildLoginUrl = (returnTo = window.location.href) => {
  const url = new URL("/auth/github/start", API_URL);
  url.searchParams.set("returnTo", returnTo);
  return url.toString();
};

// ─── CRUD ────────────────────────────────────────────────────────────────

// Backend DTOs reject `id`, `createdAt`, `updatedAt`, the `shared` wrapper, and
// section IDs. Flatten the GET shape into the wire shape the API expects.
const toProjectPayload = (p: RawProject) => ({
  slug: p.slug,
  publishedAt: p.publishedAt ?? null,
  coverImageSrc: p.shared?.coverImageSrc ?? "",
  backgroundImage: p.shared?.backgroundImage ?? "",
  status: p.shared?.status ?? "",
  type: p.shared?.type ?? "",
  title: p.shared?.title ?? "",
  technologies: p.shared?.technologies ?? "",
  translations: p.translations,
  buttons: p.shared?.buttons ?? [],
  sections: (p.sections ?? []).map((s) => ({
    flexDirection: s.flexDirection ?? "row",
    coverImage: s.coverImage ?? "",
    translations: s.translations ?? [],
  })),
});

const toArticlePayload = (a: RawArticle) => ({
  slug: a.slug,
  publishedAt: a.publishedAt ?? null,
  coverImageSrc: a.shared?.coverImageSrc ?? "",
  bannerImage: a.shared?.bannerImage ?? "",
  translations: a.translations,
  researchStyle: a.shared?.researchStyle ?? { borderTop: "", borderBottom: "" },
  sections: (a.sections ?? []).map((s) => ({
    image: s.image ?? "",
    translations: s.translations ?? [],
  })),
});

export const listProjects = () =>
  isTestMode() ? tmListProjects() : request<RawProject[]>("/projects");
export const getProject = (slug: string) =>
  isTestMode() ? tmGetProject(slug) : request<RawProject>(`/projects/${slug}`);
export const createProject = (payload: RawProject) =>
  isTestMode()
    ? tmCreateProject(payload)
    : request<RawProject>("/projects", { method: "POST", json: toProjectPayload(payload) });
export const updateProject = (slug: string, payload: RawProject) =>
  isTestMode()
    ? tmUpdateProject(slug, payload)
    : request<RawProject>(`/projects/${slug}`, { method: "PUT", json: toProjectPayload(payload) });
export const deleteProject = (slug: string) =>
  isTestMode()
    ? tmDeleteProject(slug)
    : request<void>(`/projects/${slug}`, { method: "DELETE" });

export const listArticles = () =>
  isTestMode() ? tmListArticles() : request<RawArticle[]>("/articles");
export const getArticle = (slug: string) =>
  isTestMode() ? tmGetArticle(slug) : request<RawArticle>(`/articles/${slug}`);
export const createArticle = (payload: RawArticle) =>
  isTestMode()
    ? tmCreateArticle(payload)
    : request<RawArticle>("/articles", { method: "POST", json: toArticlePayload(payload) });
export const updateArticle = (slug: string, payload: RawArticle) =>
  isTestMode()
    ? tmUpdateArticle(slug, payload)
    : request<RawArticle>(`/articles/${slug}`, { method: "PUT", json: toArticlePayload(payload) });
export const deleteArticle = (slug: string) =>
  isTestMode()
    ? tmDeleteArticle(slug)
    : request<void>(`/articles/${slug}`, { method: "DELETE" });

// ─── Mappers (raw → view used by ProjectCard / ArticleCard) ──────────────

const formatDate = (s?: string | null) => {
  if (!s) return "";
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? "" : new Intl.DateTimeFormat("en-GB").format(d);
};

const pickTranslation = <T extends { locale: string }>(
  list: T[] | undefined,
  locale: Locale
): Partial<T> => list?.find((t) => t.locale === locale) ?? list?.[0] ?? {};

export function mapProject(project: RawProject, locale: Locale): Project {
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
        url: b.url,
        icon: b.icon,
      })),
    },
    header: {
      backgroundImage: project.shared?.backgroundImage,
      subtitle: t.subtitle ?? "",
      buttons: (project.shared?.buttons ?? []).map((b) => ({
        text: pickTranslation(b.translations, locale).text ?? "",
        url: b.url,
        icon: b.icon,
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
}

export function mapArticle(article: RawArticle, locale: Locale): Article {
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
}
