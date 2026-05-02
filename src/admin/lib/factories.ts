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
    publishedAt: null,
    shared: {
      title: "",
      coverImageSrc: "",
      backgroundImage: "",
      status: "",
      type: "",
      technologies: "",
      buttons: [
        {
          icon: "preview",
          url: "",
          translations: [
            { locale: "en-us", text: "Live Preview" },
            { locale: "es-mx", text: "Vista Previa" },
            { locale: "pt-br", text: "Ver ao Vivo" },
          ],
        },
        {
          icon: "github",
          url: "",
          translations: [
            { locale: "en-us", text: "Source Code" },
            { locale: "es-mx", text: "Código Fuente" },
            { locale: "pt-br", text: "Código Fonte" },
          ],
        },
        {
          icon: "docs",
          url: "",
          translations: [
            { locale: "en-us", text: "Documentation" },
            { locale: "es-mx", text: "Documentación" },
            { locale: "pt-br", text: "Documentação" },
          ],
        },
      ],
    },
    translations: LOCALES.map((locale) => ({
      locale,
      subtitle: "",
    })),
    sections: [],
  };
}

export function emptyArticle(): RawArticle {
  return {
    slug: "",
    publishedAt: null,
    shared: {
      coverImageSrc: "",
      bannerImage: "",
      researchStyle: { borderTop: "", borderBottom: "" },
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
