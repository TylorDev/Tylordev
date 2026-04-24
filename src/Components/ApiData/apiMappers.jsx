const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export const getApiUrl = (path) => `${API_URL}${path}`;

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-GB").format(date);
};

const getTranslation = (translations = [], locale) =>
  translations.find((translation) => translation.locale === locale) ??
  translations[0] ??
  {};

export const mapProjectFromApi = (project, locale) => {
  const translation = getTranslation(project.translations, locale);

  return {
    slug: project.slug,
    publishedAt: project.publishedAt,
    data: {
      coverImageSrc: project.shared.coverImageSrc,
      coverImageAlt: project.shared.coverImageAlt,
      status: translation.status ?? "",
      type: translation.type ?? "",
      tittle: translation.title ?? "",
      tags: translation.tags ?? "",
      date: formatDisplayDate(project.publishedAt),
    },
    header: {
      backgroundImage: project.shared.backgroundImage,
      backgroundAlt: project.shared.backgroundAlt,
      message: translation.message ?? "",
      title: translation.title ?? "",
      subtitle: translation.subtitle ?? "",
      buttons: (project.shared.buttons ?? []).map((button) => ({
        text: getTranslation(button.translations, locale).text ?? "",
        icon: button.icon,
        url: button.url,
      })),
    },
    sections: (project.sections ?? []).map((section) => {
      const sectionTranslation = getTranslation(section.translations, locale);

      return {
        flexDirection: section.flexDirection,
        coverImage: section.coverImage,
        tmContent: {
          summary: sectionTranslation.summary ?? "",
          readMore: sectionTranslation.readMore ?? "",
          modalContent: sectionTranslation.modalContent ?? "",
          close: sectionTranslation.close ?? "X",
        },
      };
    }),
  };
};

export const mapArticleFromApi = (article, locale) => {
  const translation = getTranslation(article.translations, locale);

  return {
    slug: article.slug,
    publishedAt: article.publishedAt,
    data: {
      coverImageSrc: article.shared.coverImageSrc,
      category: translation.category ?? "",
      date: formatDisplayDate(article.publishedAt),
      title: translation.title ?? "",
      content: translation.content ?? "",
      id: article.slug,
    },
    bannerImage: article.shared.bannerImage,
    contentTitle: translation.contentTitle ?? "",
    sections: (article.sections ?? []).map((section) => {
      const sectionTranslation = getTranslation(section.translations, locale);

      return {
        tittle: sectionTranslation.title ?? "",
        paragraph: sectionTranslation.paragraph ?? "",
        image: section.image ?? "",
      };
    }),
    researchProps: {
      style: article.shared.researchStyle ?? {},
    },
  };
};
