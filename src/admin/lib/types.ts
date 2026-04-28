// Mirrors the Tylordev-Admin contract:
//   /projects, /articles → RawProject / RawArticle
//   3 locales: en-us, es-mx, pt-br
// The Project / Article shapes are the locale-resolved view used by the
// portfolio cards. We reuse them here so the ProjectCard / ArticleCard
// components copied from /optimized work without modification.

export type Locale = "en-us" | "es-mx" | "pt-br";

export const LOCALES: Locale[] = ["en-us", "es-mx", "pt-br"];

export interface RawTranslation {
  locale: Locale;
  [key: string]: unknown;
}

export interface RawProjectButton {
  icon?: boolean;
  url?: string;
  translations?: { locale: Locale; text?: string }[];
}

export interface RawProjectSection {
  id?: string;
  flexDirection?: string;
  coverImage?: string;
  translations?: {
    locale: Locale;
    summary?: string;
    readMore?: string;
    modalContent?: string;
    close?: string;
  }[];
}

export interface RawArticleSection {
  id?: string;
  image?: string;
  translations?: { locale: Locale; title?: string; paragraph?: string }[];
}

export interface RawProject {
  id?: string;
  slug: string;
  publishedAt?: string | null;
  shared: {
    coverImageSrc?: string;
    coverImageAlt?: string;
    backgroundImage?: string;
    backgroundAlt?: string;
    buttons?: RawProjectButton[];
  };
  translations: {
    locale: Locale;
    title?: string;
    status?: string;
    type?: string;
    tags?: string;
    message?: string;
    subtitle?: string;
  }[];
  sections?: RawProjectSection[];
}

export interface RawArticle {
  id?: string;
  slug: string;
  publishedAt?: string | null;
  shared: {
    coverImageSrc?: string;
    bannerImage?: string;
    researchStyle?: Record<string, string>;
  };
  translations: {
    locale: Locale;
    category?: string;
    title?: string;
    content?: string;
    contentTitle?: string;
  }[];
  sections?: RawArticleSection[];
}

// View models — same shape ProjectCard / ArticleCard expect.
export interface ProjectButton { text: string; icon?: string; url?: string; }

export interface Project {
  slug: string;
  publishedAt?: string | null;
  data: {
    coverImageSrc?: string;
    coverImageAlt?: string;
    status: string;
    type: string;
    tittle: string;
    tags: string;
    date: string;
  };
  header: {
    backgroundImage?: string;
    backgroundAlt?: string;
    message: string;
    title: string;
    subtitle: string;
    buttons: ProjectButton[];
  };
  sections: {
    flexDirection?: string;
    coverImage?: string;
    tmContent: { summary: string; readMore: string; modalContent: string; close: string };
  }[];
}

export interface Article {
  slug: string;
  publishedAt?: string | null;
  data: {
    coverImageSrc?: string;
    category: string;
    date: string;
    title: string;
    content: string;
    id: string;
  };
  bannerImage?: string;
  contentTitle: string;
  sections: { tittle: string; paragraph: string; image: string }[];
  researchProps: { style: Record<string, string> };
}

export interface AuthSession {
  githubId: number;
  login: string;
  name: string | null;
  avatarUrl: string | null;
}
