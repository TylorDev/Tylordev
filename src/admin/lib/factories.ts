import { LOCALES, type RawArticle, type RawProject } from "./types";

export const slugify = (raw: string) =>
  raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

export function emptyProject(): RawProject {
  return {
    slug: "",
    publishedAt: new Date().toISOString().slice(0, 10),
    shared: {
      coverImageSrc: "",
      coverImageAlt: "",
      backgroundImage: "",
      backgroundAlt: "",
      buttons: [],
    },
    translations: LOCALES.map((locale) => ({
      locale,
      title: "",
      status: "Draft",
      type: "",
      tags: "",
      message: "",
      subtitle: "",
    })),
    sections: [],
  };
}

export function emptyArticle(): RawArticle {
  return {
    slug: "",
    publishedAt: new Date().toISOString().slice(0, 10),
    shared: {
      coverImageSrc: "",
      bannerImage: "",
      researchStyle: { borderColor: "#2e2e34" },
    },
    translations: LOCALES.map((locale) => ({
      locale,
      category: "",
      title: "",
      content: "",
      contentTitle: "",
    })),
    sections: [],
  };
}

export function emptyProjectSection() {
  return {
    flexDirection: "row",
    coverImage: "",
    translations: LOCALES.map((locale) => ({
      locale,
      summary: "",
      readMore: "Read more",
      modalContent: "",
      close: "X",
    })),
  };
}

export function emptyArticleSection() {
  return {
    image: "",
    translations: LOCALES.map((locale) => ({ locale, title: "", paragraph: "" })),
  };
}

export function emptyProjectButton() {
  return {
    url: "",
    translations: LOCALES.map((locale) => ({ locale, text: "" })),
  };
}
