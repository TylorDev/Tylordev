/**
 * Static site copy is intentionally local and versioned with the app.
 * The GitHub wiki only provides mutable identity fields.
 */

import type { IdentityContent, Locale } from "./types";

const WIKI_RAW_BASE = "https://raw.githubusercontent.com/wiki/TylorDev/Tylordev";
const LOCAL_TEST_BASE = "/Test";
const BASE_MARKDOWN_URL = `${WIKI_RAW_BASE}/Tylordev.md`;

type StaticSection = Record<string, unknown>;
type StaticContent = Record<string, StaticSection>;

const PAGE_ALIASES: Record<string, string> = {
  ProjectsContent: "projectsContent",
};

export const DEFAULT_IDENTITY: IdentityContent = {
  displayName: "Jhon Tylor",
  githubUsername: "TylorDev",
  username: "@TylorDev",
  avatarSrc: "https://avatars.githubusercontent.com/u/107888704?v=4",
  githubUrl: "https://github.com/TylorDev",
  linkedinUrl: "https://www.linkedin.com/",
  contactEmail: "tylordeveloper@gmail.com",
  role: "Full-Stack Web Developer",
};

const SITE_COPY_BY_LOCALE: Record<Locale, StaticContent> = {
  "en-us": {
    Header: {
      logoSrc: "/logo.svg",
      logoAlt: "TylorDev Logo",
      menuLabel: "Menu",
      navItems: {
        about: "About",
        projects: "Projects",
        research: "Writing",
        resources: "Resources",
        contact: "Contact",
      },
      aria: {
        home: "Home",
        openMenu: "Open menu",
        closeMenu: "Close menu",
        switchTo: "Switch to",
      },
    },
    About: {
      header: { section: "01/", title: "Profile" },
      profile: {
        imageSrc: "/logo.svg",
        languages: "English, Español, Português",
      },
      paragraphs: [
        "Full-Stack Web Developer specializing in crafting modern applications with Next.js. I build and manage backend infrastructures and monitoring using Railway, ensuring seamless production deployments via Vercel. I maintain efficient, automated workflows relying on GitHub for version control, always operating from an optimized development environment.",
        "I complement this technical foundation with my background in graphic design and editing. This combination helps me connect robust backend performance with visually engaging interfaces and excellent user experiences.",
        "When I'm not writing code or optimizing my PC hardware, I spend time improving my Portuguese, exploring player-driven economies, and competing in Counter-Strike.",
      ],
    },
    Contact: {
      contactMeta: { title: "Contact" },
      pageHeader: { eyebrow: "Get in touch", title: "Let's build something." },
      replyTime: "Average reply within 24 hours.",
      sendingLabel: "Sending...",
      formFields: {
        name: { label: "Name", placeholder: "Your name", errorMessage: "Name is required." },
        email: {
          label: "Email",
          placeholder: "you@example.com",
          errorMessage: {
            required: "Email is required.",
            invalid: "That email does not look valid.",
          },
        },
        message: {
          label: "Message",
          placeholder: "Tell me a little about your project or idea...",
          errorMessage: "Message is required.",
        },
        submitButton: "Send message",
      },
      thankYouMessage: "Thanks for writing. I will reply soon.",
    },
    Footer: {
      logoSrc: "/logo.svg",
      logoAlt: "TylorDev Logo",
      links: {
        about: "About",
        projects: "Projects",
        instagram: "https://www.instagram.com/",
      },
      headings: { navigate: "Navigate", social: "Social" },
      footerText: "Built with React.",
    },
    Home: {
      about: {
        readMore: "Read more",
        downloadCv: "Download CV",
        cvHref: "/cv.pdf",
        cvFilename: "TylorDev-CV.pdf",
        githubLabel: "Github",
        linkedinLabel: "LinkedIn",
      },
      projects: { eyebrow: "Work", allProjects: "All projects" },
    },
    projectsContent: {
      Projects: {
        header: { mainText: "Selected work/", tittle: "PROJECTS" },
        filters: { all: "All" },
        empty: "No projects yet.",
      },
    },
    ProjectDetailContent: {
      allProjects: "All projects",
      defaultType: "Project",
      readMore: "Read more",
      notFound: "Project not found",
      backToProjects: "Back to projects",
      sectionAlt: "Section {number}",
    },
  },
  "es-mx": {
    Header: {
      logoSrc: "/logo.svg",
      logoAlt: "TylorDev Logo",
      menuLabel: "Menú",
      navItems: {
        about: "Sobre mí",
        projects: "Proyectos",
        research: "Escritos",
        resources: "Recursos",
        contact: "Contacto",
      },
      aria: {
        home: "Inicio",
        openMenu: "Abrir menú",
        closeMenu: "Cerrar menú",
        switchTo: "Cambiar a",
      },
    },
    About: {
      header: { section: "01/", title: "Perfil" },
      profile: {
        imageSrc: "/logo.svg",
        languages: "English, Español, Português",
      },
      paragraphs: [
        "Desarrollador Full-Stack especializado en crear aplicaciones modernas con Next.js. Construyo y gestiono infraestructuras backend y monitoreo con Railway, asegurando despliegues de producción fluidos mediante Vercel. Mantengo flujos automatizados y eficientes con GitHub para el control de versiones.",
        "Complemento esta base técnica con mi experiencia en diseño gráfico y edición. Esta combinación me permite conectar rendimiento backend sólido con interfaces visualmente atractivas y excelentes experiencias de usuario.",
        "Cuando no estoy escribiendo código u optimizando hardware de PC, dedico tiempo a mejorar mi portugués, explorar economías impulsadas por jugadores y competir en Counter-Strike.",
      ],
    },
    Contact: {
      contactMeta: { title: "Contacto" },
      pageHeader: { eyebrow: "Contacto", title: "Construyamos algo." },
      replyTime: "Respuesta promedio en menos de 24 horas.",
      sendingLabel: "Enviando...",
      formFields: {
        name: { label: "Nombre", placeholder: "Tu nombre", errorMessage: "El nombre es obligatorio." },
        email: {
          label: "Email",
          placeholder: "tu@ejemplo.com",
          errorMessage: {
            required: "El email es obligatorio.",
            invalid: "Ese email no parece válido.",
          },
        },
        message: {
          label: "Mensaje",
          placeholder: "Cuéntame un poco sobre tu proyecto o idea...",
          errorMessage: "El mensaje es obligatorio.",
        },
        submitButton: "Enviar mensaje",
      },
      thankYouMessage: "Gracias por escribir. Te responderé pronto.",
    },
    Footer: {
      logoSrc: "/logo.svg",
      logoAlt: "TylorDev Logo",
      links: {
        about: "Sobre mí",
        projects: "Proyectos",
        instagram: "https://www.instagram.com/",
      },
      headings: { navigate: "Navegar", social: "Social" },
      footerText: "Hecho con React.",
    },
    Home: {
      about: {
        readMore: "Leer más",
        downloadCv: "Descargar CV",
        cvHref: "/cv.pdf",
        cvFilename: "TylorDev-CV.pdf",
        githubLabel: "Github",
        linkedinLabel: "LinkedIn",
      },
      projects: { eyebrow: "Trabajo", allProjects: "Todos los proyectos" },
    },
    projectsContent: {
      Projects: {
        header: { mainText: "Trabajo seleccionado/", tittle: "PROYECTOS" },
        filters: { all: "Todos" },
        empty: "Todavía no hay proyectos.",
      },
    },
    ProjectDetailContent: {
      allProjects: "Todos los proyectos",
      defaultType: "Proyecto",
      readMore: "Leer más",
      notFound: "Proyecto no encontrado",
      backToProjects: "Volver a proyectos",
      sectionAlt: "Sección {number}",
    },
  },
  "pt-br": {
    Header: {
      logoSrc: "/logo.svg",
      logoAlt: "TylorDev Logo",
      menuLabel: "Menu",
      navItems: {
        about: "Sobre mim",
        projects: "Projetos",
        research: "Escritos",
        resources: "Recursos",
        contact: "Contato",
      },
      aria: {
        home: "Início",
        openMenu: "Abrir menu",
        closeMenu: "Fechar menu",
        switchTo: "Mudar para",
      },
    },
    About: {
      header: { section: "01/", title: "Perfil" },
      profile: {
        imageSrc: "/logo.svg",
        languages: "English, Español, Português",
      },
      paragraphs: [
        "Desenvolvedor Full-Stack especializado em criar aplicações modernas com Next.js. Construo e gerencio infraestruturas backend e monitoramento com Railway, garantindo deploys de produção fluidos via Vercel. Mantenho fluxos automatizados e eficientes com GitHub para controle de versão.",
        "Complemento essa base técnica com minha experiência em design gráfico e edição. Essa combinação me ajuda a conectar performance backend robusta com interfaces visualmente envolventes e excelentes experiências de usuário.",
        "Quando não estou escrevendo código ou otimizando hardware de PC, dedico tempo a melhorar meu português, explorar economias movidas por jogadores e competir em Counter-Strike.",
      ],
    },
    Contact: {
      contactMeta: { title: "Contato" },
      pageHeader: { eyebrow: "Contato", title: "Vamos construir algo." },
      replyTime: "Resposta média em até 24 horas.",
      sendingLabel: "Enviando...",
      formFields: {
        name: { label: "Nome", placeholder: "Seu nome", errorMessage: "O nome é obrigatório." },
        email: {
          label: "Email",
          placeholder: "voce@exemplo.com",
          errorMessage: {
            required: "O email é obrigatório.",
            invalid: "Esse email não parece válido.",
          },
        },
        message: {
          label: "Mensagem",
          placeholder: "Me conte um pouco sobre seu projeto ou ideia...",
          errorMessage: "A mensagem é obrigatória.",
        },
        submitButton: "Enviar mensagem",
      },
      thankYouMessage: "Obrigado pela mensagem. Responderei em breve.",
    },
    Footer: {
      logoSrc: "/logo.svg",
      logoAlt: "TylorDev Logo",
      links: {
        about: "Sobre mim",
        projects: "Projetos",
        instagram: "https://www.instagram.com/",
      },
      headings: { navigate: "Navegar", social: "Social" },
      footerText: "Feito com React.",
    },
    Home: {
      about: {
        readMore: "Ler mais",
        downloadCv: "Baixar CV",
        cvHref: "/cv.pdf",
        cvFilename: "TylorDev-CV.pdf",
        githubLabel: "Github",
        linkedinLabel: "LinkedIn",
      },
      projects: { eyebrow: "Trabalho", allProjects: "Todos os projetos" },
    },
    projectsContent: {
      Projects: {
        header: { mainText: "Trabalhos selecionados/", tittle: "PROJETOS" },
        filters: { all: "Todos" },
        empty: "Ainda não há projetos.",
      },
    },
    ProjectDetailContent: {
      allProjects: "Todos os projetos",
      defaultType: "Projeto",
      readMore: "Ler mais",
      notFound: "Projeto não encontrado",
      backToProjects: "Voltar aos projetos",
      sectionAlt: "Seção {number}",
    },
  },
};

let _cache: Partial<Record<string, string | null>> = {};
let _promise: Promise<StaticSection | null> | null = null;
let _githubProfilePromise: Promise<GitHubProfile | null> | null = null;
let _githubSocialAccountsPromise: Promise<GitHubSocialAccount[]> | null = null;

const ABOUT_BIO_MARKDOWN_URLS: Record<Locale, string> = {
  "en-us": "Tylordev.md",
  "es-mx": "Tylordev-es.md",
  "pt-br": "Tylordev-pt.md",
};

interface GitHubProfile {
  login?: string | null;
  name?: string | null;
  avatar_url?: string | null;
  html_url?: string | null;
  email?: string | null;
  bio?: string | null;
}

interface GitHubSocialAccount {
  provider?: string | null;
  url?: string | null;
}

function normalizePageName(pageName: string): string {
  return PAGE_ALIASES[pageName] ?? pageName;
}

async function fetchText(url: string): Promise<string | null> {
  if (import.meta.env.DEV && url.startsWith(LOCAL_TEST_BASE)) {
    return fetch(`${url}?t=${Date.now()}`)
      .then((res) => (res.ok ? res.text() : null))
      .catch(() => null);
  }

  if (Object.prototype.hasOwnProperty.call(_cache, url)) return _cache[url] ?? null;

  return fetch(url)
    .then((res) => (res.ok ? res.text() : null))
    .then((text) => {
      _cache[url] = text;
      return text;
    })
    .catch(() => {
      _cache[url] = null;
      return null;
    });
}

function parseIdentityMarkdown(markdown: string): StaticSection | null {
  const normalized = markdown.replace(/\r\n/g, "\n");
  const match = normalized.match(/(?:^|\n)##\s+Identity\s*\n([\s\S]*?)(?=\n##\s+|$)/);
  if (!match) return null;

  const identity: StaticSection = {};
  match[1].split("\n").forEach((line) => {
    const field = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!field) return;
    identity[field[1]] = field[2].trim();
  });

  const githubUsername = typeof identity.githubUsername === "string" ? identity.githubUsername : "";
  return {
    ...identity,
    username: githubUsername ? `@${githubUsername}` : undefined,
  };
}

function parseAboutBioMarkdown(markdown: string): string[] | null {
  const normalized = markdown.replace(/\r\n/g, "\n");
  const match = normalized.match(/(?:^|\n)##\s+AboutBio\s*\n([\s\S]*?)(?=\n##\s+|$)/);
  if (!match) return null;

  const paragraphs = match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);

  return paragraphs.length ? paragraphs : null;
}

function coerceIdentity(identity: StaticSection | null): IdentityContent {
  return {
    ...DEFAULT_IDENTITY,
    ...(identity ?? {}),
  } as IdentityContent;
}

function nonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

async function fetchGitHubProfile(username: string): Promise<GitHubProfile | null> {
  if (!username) return null;
  if (_githubProfilePromise) return _githubProfilePromise;

  _githubProfilePromise = fetch(`https://api.github.com/users/${encodeURIComponent(username)}`)
    .then((res) => (res.ok ? res.json() as Promise<GitHubProfile> : null))
    .catch(() => null);

  return _githubProfilePromise;
}

async function fetchGitHubSocialAccounts(username: string): Promise<GitHubSocialAccount[]> {
  if (!username) return [];
  if (_githubSocialAccountsPromise) return _githubSocialAccountsPromise;

  _githubSocialAccountsPromise = fetch(`https://api.github.com/users/${encodeURIComponent(username)}/social_accounts`)
    .then((res) => (res.ok ? res.json() as Promise<GitHubSocialAccount[]> : []))
    .catch(() => []);

  return _githubSocialAccountsPromise;
}

function resolveLinkedInUrl(accounts: GitHubSocialAccount[]): string | undefined {
  const linkedInAccount = accounts.find((account) => {
    const provider = nonEmptyString(account.provider)?.toLowerCase();
    const url = nonEmptyString(account.url)?.toLowerCase();
    return provider === "linkedin" || Boolean(url?.includes("linkedin.com"));
  });

  return nonEmptyString(linkedInAccount?.url);
}

async function loadIdentity(): Promise<IdentityContent> {
  if (_promise) {
    const identity = await _promise.then(coerceIdentity);
    const profile = await fetchGitHubProfile(identity.githubUsername);
    const socialAccounts = await fetchGitHubSocialAccounts(identity.githubUsername);
    const login = nonEmptyString(profile?.login);

    return {
      ...identity,
      displayName: nonEmptyString(profile?.name) ?? login ?? DEFAULT_IDENTITY.displayName,
      username: login ? `@${login}` : identity.username,
      avatarSrc: nonEmptyString(profile?.avatar_url) ?? identity.avatarSrc,
      githubUrl: nonEmptyString(profile?.html_url) ?? identity.githubUrl,
      linkedinUrl: resolveLinkedInUrl(socialAccounts) ?? DEFAULT_IDENTITY.linkedinUrl,
      contactEmail: nonEmptyString(profile?.email) ?? identity.contactEmail,
      role: nonEmptyString(profile?.bio) ?? identity.role,
    };
  }

  const markdownUrl = import.meta.env.DEV ? `${LOCAL_TEST_BASE}/Tylordev.md` : BASE_MARKDOWN_URL;
  _promise = fetchText(markdownUrl).then((markdown) =>
    markdown ? parseIdentityMarkdown(markdown) : null
  );

  return loadIdentity();
}

async function loadAboutBio(locale: Locale): Promise<string[] | null> {
  const fileName = ABOUT_BIO_MARKDOWN_URLS[locale];
  const markdownUrl = import.meta.env.DEV
    ? `${LOCAL_TEST_BASE}/${fileName}`
    : `${WIKI_RAW_BASE}/${fileName}`;

  const markdown = await fetchText(markdownUrl);
  return markdown ? parseAboutBioMarkdown(markdown) : null;
}

function cloneSection<T>(section: T): T {
  return JSON.parse(JSON.stringify(section)) as T;
}

function deepMerge<T>(base: T, patch: unknown): T {
  if (Array.isArray(base)) {
    if (!Array.isArray(patch)) return base;

    const shouldMergeItems =
      base.every((item) => item && typeof item === "object" && !Array.isArray(item)) &&
      patch.every((item) => item && typeof item === "object" && !Array.isArray(item));

    if (!shouldMergeItems) return patch as T;

    const mergedItems = base.map((item, index) =>
      index in patch ? deepMerge(item, patch[index]) : item
    );
    return [...mergedItems, ...patch.slice(base.length)] as T;
  }

  if (base && typeof base === "object" && patch && typeof patch === "object" && !Array.isArray(patch)) {
    const output: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    Object.entries(patch as Record<string, unknown>).forEach(([key, value]) => {
      output[key] = key in output ? deepMerge(output[key], value) : value;
    });
    return output as T;
  }

  return (patch ?? base) as T;
}

function enrichWithIdentity(
  pageName: string,
  page: StaticSection,
  identity: IdentityContent
): StaticSection {
  switch (pageName) {
    case "About": {
      return deepMerge(page, {
        profile: {
          username: identity.username,
          displayName: identity.displayName,
          role: identity.role,
          avatarSrc: identity.avatarSrc,
          githubUrl: identity.githubUrl,
          linkedinUrl: identity.linkedinUrl,
        },
      });
    }
    case "Contact": {
      return deepMerge(page, {
        contactMeta: {
          email: identity.contactEmail,
        },
      });
    }
    case "Footer": {
      return deepMerge(page, {
        links: {
          github: identity.githubUrl,
          linkedIn: identity.linkedinUrl,
        },
      });
    }
    case "Home": {
      return deepMerge(page, {
        about: {
          githubUrl: identity.githubUrl,
          linkedinUrl: identity.linkedinUrl,
        },
      });
    }
    default:
      return page;
  }
}

export async function fetchRemotePage<T>(lang: string, pageName: string): Promise<T | null> {
  const locale = (lang in SITE_COPY_BY_LOCALE ? lang : "en-us") as Locale;
  const normalizedPageName = normalizePageName(pageName);
  const page = SITE_COPY_BY_LOCALE[locale][normalizedPageName];
  if (!page) return null;

  const identity = await loadIdentity();
  const localPage = cloneSection(page);
  if (normalizedPageName === "About") {
    const paragraphs = await loadAboutBio(locale);
    if (paragraphs) {
      localPage.paragraphs = paragraphs;
    }
  }

  return enrichWithIdentity(normalizedPageName, localPage, identity) as T;
}

export function invalidateStaticCache() {
  _cache = {};
  _promise = null;
  _githubProfilePromise = null;
  _githubSocialAccountsPromise = null;
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    invalidateStaticCache();
  });
}

/** Export the content object as a downloadable JSON file for legacy admin flows. */
export function exportStaticJson(
  data: Record<string, Record<string, unknown>>,
  filename = "static-data.json"
) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
