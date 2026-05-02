export type Locale = "en-us" | "es-mx" | "pt-br";

export interface RawTranslation {
  locale: string;
  [key: string]: unknown;
}

export interface RawButton {
  icon?: string;
  url?: string;
  translations?: { locale: string; text?: string }[];
}

export interface RawSection {
  flexDirection?: string;
  coverImage?: string;
  image?: string;
  translations?: RawTranslation[];
}

export interface RawProject {
  id?: string;
  slug: string;
  publishedAt?: string | null;
  shared: {
    title?: string;
    coverImageSrc?: string;
    backgroundImage?: string;
    status?: string;
    type?: string;
    technologies?: string;
    buttons?: RawButton[];
  };
  translations: (RawTranslation & {
    subtitle?: string;
  })[];
  sections?: RawSection[];
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
  translations: (RawTranslation & {
    category?: string;
    title?: string;
    content?: string;
    contentTitle?: string;
  })[];
  sections?: RawSection[];
}

export interface ProjectButton {
  text: string;
  icon?: string;
  url?: string;
}

export interface Project {
  slug: string;
  publishedAt?: string | null;
  data: {
    coverImageSrc?: string;
    status: string;
    type: string;
    tittle: string;
    subtitle: string;
    technologies: string;
    date: string;
    buttons: ProjectButton[];
  };
  header: {
    backgroundImage?: string;
    subtitle: string;
    buttons: ProjectButton[];
  };
  sections: {
    flexDirection?: string;
    coverImage?: string;
    tmContent: {
      summary: string;
      readMore: string;
      modalContent: string;
      close: string;
    };
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

export interface HeroPage {
  hero: {
    subtitle: string;
    title: string;
    videoSrc: string;
    post: { title: string; content: string; buttonText: string };
  };
}

export interface HeaderPage {
  logoSrc: string;
  logoAlt: string;
  menuLabel: string;
  navItems: Record<string, string>;
}

export interface FooterPage {
  logoSrc: string;
  logoAlt: string;
  links: Record<string, string>;
  footerText: string;
  privacyPolicy: string;
  footerDynamicText: string;
}

export interface AboutPage {
  header: { section: string; title: string };
  profile: { name: string; role: string; username: string; imageSrc: string };
  paragraphs: string[];
  History: {
    imageSrc: string;
    latest: { header: { section: string; title: string }; headerTitle: string }[];
  };
  blogHeader: { section: string; title: string };
  blog: { title: string; cornerLink: { icon: string } };
}

export interface ContactPage {
  contactMeta: { title: string; email: string };
  formFields: {
    name: { label: string; placeholder: string; errorMessage: string };
    email: {
      label: string;
      placeholder: string;
      errorMessage: { required: string; invalid: string };
    };
    message: { label: string; placeholder: string; errorMessage: string };
    submitButton: string;
  };
  thankYouMessage: string;
}
