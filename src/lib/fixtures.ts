import type {
  AboutPage,
  ContactPage,
  FooterPage,
  HeaderPage,
  HeroPage,
  Locale,
  RawArticle,
  RawProject,
} from "./types";

// Local logo asset served from /public — no external dependency.
const LOGO = "/logo.svg";

// Neutral placeholder images. Unsplash (free, no auth) — replace with your own assets.
const IMG = {
  about: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=600&q=80",
  history: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&q=80",
};

// Page-content fixtures: served locally for static UI copy (Header, Hero, About, Footer, Banner, Contact).
// Projects and articles are fetched from the live Railway API.
export const examplePages = {
  Header: {
    "en-us": {
      logoSrc: LOGO,
      logoAlt: "Logo",
      menuLabel: "Menu",
      navItems: {
        about: "About",
        projects: "Projects",
        research: "Writing",
        resources: "Resources",
        contact: "Contact",
      },
    } satisfies HeaderPage,
    "es-mx": {
      logoSrc: LOGO,
      logoAlt: "Logo",
      menuLabel: "Menú",
      navItems: {
        about: "Sobre mí",
        projects: "Proyectos",
        research: "Notas",
        resources: "Recursos",
        contact: "Contacto",
      },
    } satisfies HeaderPage,
    "pt-br": {
      logoSrc: LOGO,
      logoAlt: "Logo",
      menuLabel: "Menu",
      navItems: {
        about: "Sobre",
        projects: "Projetos",
        research: "Notas",
        resources: "Recursos",
        contact: "Contato",
      },
    } satisfies HeaderPage,
  },

  Footer: {
    "en-us": {
      logoSrc: LOGO,
      logoAlt: "Logo",
      links: {
        about: "About",
        projects: "Projects",
        blog: "Writing",
        github: "https://github.com/",
        linkedIn: "https://www.linkedin.com/",
        instagram: "https://www.instagram.com/",
      },
      footerText: "Independent studio. Built with React.",
      privacyPolicy: "hello@example.com",
      footerDynamicText: "v1.0",
    } satisfies FooterPage,
    "es-mx": {
      logoSrc: LOGO,
      logoAlt: "Logo",
      links: {
        about: "Sobre mí",
        projects: "Proyectos",
        blog: "Notas",
        github: "https://github.com/",
        linkedIn: "https://www.linkedin.com/",
        instagram: "https://www.instagram.com/",
      },
      footerText: "Estudio independiente. Hecho con React.",
      privacyPolicy: "hello@example.com",
      footerDynamicText: "v1.0",
    } satisfies FooterPage,
    "pt-br": {
      logoSrc: LOGO,
      logoAlt: "Logo",
      links: {
        about: "Sobre",
        projects: "Projetos",
        blog: "Notas",
        github: "https://github.com/",
        linkedIn: "https://www.linkedin.com/",
        instagram: "https://www.instagram.com/",
      },
      footerText: "Estúdio independente. Feito com React.",
      privacyPolicy: "hello@example.com",
      footerDynamicText: "v1.0",
    } satisfies FooterPage,
  },

  Hero: {
    "en-us": {
      hero: {
        subtitle: "Independent product engineer. I design and ship interfaces that feel fast.",
        title: "Build the web you actually want to use.",
        videoSrc: "",
        post: {
          title: "00/ Intro",
          content:
            "I work end-to-end on small teams: research, design, code, ship. Currently focused on streaming UIs, design systems, and tools that respect the user's time.",
          buttonText: "Get in touch",
        },
      },
    } satisfies HeroPage,
    "es-mx": {
      hero: {
        subtitle: "Ingeniero de producto independiente. Diseño y publico interfaces que se sienten rápidas.",
        title: "Construyamos la web que realmente querrías usar.",
        videoSrc: "",
        post: {
          title: "00/ Intro",
          content:
            "Trabajo de punta a punta en equipos chicos: research, diseño, código, deploy. Hoy enfocado en UIs en streaming, design systems y herramientas que respetan el tiempo del usuario.",
          buttonText: "Contactar",
        },
      },
    } satisfies HeroPage,
    "pt-br": {
      hero: {
        subtitle: "Engenheiro de produto independente. Desenho e publico interfaces que parecem rápidas.",
        title: "Vamos construir a web que você de fato quer usar.",
        videoSrc: "",
        post: {
          title: "00/ Intro",
          content:
            "Trabalho ponta a ponta em times pequenos: research, design, código, deploy. Foco atual em UIs em streaming, design systems e ferramentas que respeitam o tempo do usuário.",
          buttonText: "Falar comigo",
        },
      },
    } satisfies HeroPage,
  },

  About: {
    "en-us": {
      header: { section: "01/", title: "Profile" },
      profile: { name: "Hello.", role: "[Engineer · Designer]", username: "@studio", imageSrc: IMG.about },
      paragraphs: [
        "I'm an independent product engineer focused on small teams shipping ambitious software. I've spent the last few years building streaming dashboards, content tooling, and design systems for product-led companies.",
        "My approach: short feedback loops, ruthless scope, taste as a constraint. I prefer one well-built feature over five draft ones.",
        "I write modern TypeScript on the frontend (React, Vite, SCSS, sometimes Solid), and Node.js or Go on the backend. I care about latency, accessibility, and the long-tail polish that separates good products from forgettable ones.",
        "Currently open to selective freelance and contract work. If you're building something thoughtful, I'd like to hear about it.",
      ],
      History: {
        imageSrc: IMG.history,
        latest: [{ header: { section: "02/", title: "Recent work" }, headerTitle: "History" }],
      },
      blogHeader: { section: "03/", title: "Latest writing" },
      blog: { title: "WRITING", cornerLink: { icon: "GoArrowDownLeft" } },
    } satisfies AboutPage,
    "es-mx": {
      header: { section: "01/", title: "Perfil" },
      profile: { name: "Hola.", role: "[Ingeniero · Diseñador]", username: "@studio", imageSrc: IMG.about },
      paragraphs: [
        "Soy ingeniero de producto independiente, enfocado en equipos chicos que publican software ambicioso. Los últimos años los pasé construyendo dashboards en streaming, herramientas de contenido y design systems para empresas product-led.",
        "Mi enfoque: ciclos cortos de feedback, scope acotado y el gusto como restricción. Prefiero una feature bien hecha antes que cinco a medio terminar.",
        "Escribo TypeScript moderno en frontend (React, Vite, SCSS, a veces Solid) y Node.js o Go en backend. Me importa la latencia, la accesibilidad y el pulido del long-tail que separa el producto bueno del olvidable.",
        "Abierto a freelance y contratos selectos. Si estás construyendo algo cuidado, escribime.",
      ],
      History: {
        imageSrc: IMG.history,
        latest: [{ header: { section: "02/", title: "Trabajo reciente" }, headerTitle: "Historia" }],
      },
      blogHeader: { section: "03/", title: "Notas recientes" },
      blog: { title: "NOTAS", cornerLink: { icon: "GoArrowDownLeft" } },
    } satisfies AboutPage,
    "pt-br": {
      header: { section: "01/", title: "Perfil" },
      profile: { name: "Olá.", role: "[Engenheiro · Designer]", username: "@studio", imageSrc: IMG.about },
      paragraphs: [
        "Sou engenheiro de produto independente, focado em times pequenos publicando software ambicioso. Passei os últimos anos construindo dashboards em streaming, ferramentas de conteúdo e design systems para empresas product-led.",
        "Minha abordagem: ciclos curtos de feedback, escopo enxuto e gosto como restrição. Prefiro uma feature bem feita a cinco pela metade.",
        "Escrevo TypeScript moderno no frontend (React, Vite, SCSS, às vezes Solid) e Node.js ou Go no backend. Latência, acessibilidade e o polimento do long-tail importam.",
        "Aberto a freelance e contratos selecionados. Se você está construindo algo cuidadoso, me chame.",
      ],
      History: {
        imageSrc: IMG.history,
        latest: [{ header: { section: "02/", title: "Trabalho recente" }, headerTitle: "Histórico" }],
      },
      blogHeader: { section: "03/", title: "Notas recentes" },
      blog: { title: "NOTAS", cornerLink: { icon: "GoArrowDownLeft" } },
    } satisfies AboutPage,
  },

  Contact: {
    "en-us": {
      contactMeta: { title: "Get in touch", email: "hello@example.com" },
      formFields: {
        name: { label: "Name", placeholder: "Your name", errorMessage: "Name is required." },
        email: {
          label: "Email",
          placeholder: "you@example.com",
          errorMessage: { required: "Email is required.", invalid: "That doesn't look like a valid email." },
        },
        message: { label: "Message", placeholder: "Tell me a bit about your project…", errorMessage: "Message is required." },
        submitButton: "Send message",
      },
      thankYouMessage: "Thanks. I'll get back to you within 24 hours.",
    } satisfies ContactPage,
    "es-mx": {
      contactMeta: { title: "Contacto", email: "hello@example.com" },
      formFields: {
        name: { label: "Nombre", placeholder: "Tu nombre", errorMessage: "El nombre es obligatorio." },
        email: {
          label: "Email",
          placeholder: "tu@ejemplo.com",
          errorMessage: { required: "El email es obligatorio.", invalid: "Ese email no parece válido." },
        },
        message: { label: "Mensaje", placeholder: "Contame un poco sobre tu proyecto…", errorMessage: "El mensaje es obligatorio." },
        submitButton: "Enviar mensaje",
      },
      thankYouMessage: "¡Gracias! Te respondo en menos de 24 horas.",
    } satisfies ContactPage,
    "pt-br": {
      contactMeta: { title: "Contato", email: "hello@example.com" },
      formFields: {
        name: { label: "Nome", placeholder: "Seu nome", errorMessage: "O nome é obrigatório." },
        email: {
          label: "Email",
          placeholder: "voce@exemplo.com",
          errorMessage: { required: "O email é obrigatório.", invalid: "Esse email não parece válido." },
        },
        message: { label: "Mensagem", placeholder: "Conte um pouco sobre seu projeto…", errorMessage: "A mensagem é obrigatória." },
        submitButton: "Enviar mensagem",
      },
      thankYouMessage: "Obrigado! Respondo em até 24 horas.",
    } satisfies ContactPage,
  },

  projectsContent: {
    "en-us": { Projects: { header: { mainText: "Selected work/", tittle: "PROJECTS" } } },
    "es-mx": { Projects: { header: { mainText: "Trabajo seleccionado/", tittle: "PROYECTOS" } } },
    "pt-br": { Projects: { header: { mainText: "Trabalhos selecionados/", tittle: "PROJETOS" } } },
  },

  researchContent: {
    "en-us": { Research: { title: "Writing" } },
    "es-mx": { Research: { title: "Notas" } },
    "pt-br": { Research: { title: "Notas" } },
  },
} as const;

type PageName = keyof typeof examplePages;

export function getPageFixture<T>(lang: Locale, name: string): T | null {
  const dict = examplePages[name as PageName];
  if (!dict) return null;
  const byLang = (dict as Record<string, unknown>)[lang] ?? (dict as Record<string, unknown>)["en-us"];
  return (byLang as T) ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Example projects + articles. Used as fallback when the API is unreachable
// or returns an empty list, so the portfolio never renders an empty state.
// Shape matches the API contract (RawProject / RawArticle), so the same
// mapProject / mapArticle pipeline handles both real and example data.
// ─────────────────────────────────────────────────────────────────────────────

const PROJECT_IMG = {
  streamCover: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
  streamBg: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
  streamSection: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
  atlasCover: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
  atlasBg: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1600&q=80",
  atlasSection: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
  northCover: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80",
  northBg: "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=1600&q=80",
  northSection: "https://images.unsplash.com/photo-1545665277-5937489579f2?w=1200&q=80",
};

const ARTICLE_IMG = {
  streamingCover: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200&q=80",
  streamingBanner: "https://images.unsplash.com/photo-1581090700227-1e8e3b71d6f4?w=1600&q=80",
  smallTeamsCover: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
  smallTeamsBanner: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1600&q=80",
  tsCover: "https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?w=1200&q=80",
  tsBanner: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1600&q=80",
};

export const exampleProjects: RawProject[] = [
  {
    slug: "stream-os",
    publishedAt: "2026-03-18T00:00:00.000Z",
    shared: {
      coverImageSrc: PROJECT_IMG.streamCover,
      backgroundImage: PROJECT_IMG.streamBg,
      status: "Live",
      type: "Web App",
      technologies: "React, TypeScript",
      buttons: [
        {
          url: "https://example.com/stream-os",
          translations: [
            { locale: "en-us", text: "See preview" },
            { locale: "es-mx", text: "Ver vista previa" },
            { locale: "pt-br", text: "Ver prévia" },
          ],
        },
        {
          url: "https://github.com/example/stream-os",
          translations: [
            { locale: "en-us", text: "View source" },
            { locale: "es-mx", text: "Ver código fuente" },
            { locale: "pt-br", text: "Ver código fonte" },
          ],
        },
      ],
    },
    translations: [
      {
        locale: "en-us",
        title: "Stream OS",
        status: "Live",
        type: "Web App",
        tags: "#react #typescript #realtime",
        message: "Built for teams that ship every day.",
        subtitle: "A real-time analytics dashboard with sub-100ms updates.",
      },
      {
        locale: "es-mx",
        title: "Stream OS",
        status: "Activo",
        type: "Aplicación Web",
        tags: "#react #typescript #realtime",
        message: "Hecho para equipos que publican cada día.",
        subtitle: "Dashboard de analytics en tiempo real con actualizaciones sub-100ms.",
      },
      {
        locale: "pt-br",
        title: "Stream OS",
        status: "Ativo",
        type: "Aplicativo Web",
        tags: "#react #typescript #realtime",
        message: "Feito para times que publicam todo dia.",
        subtitle: "Dashboard de analytics em tempo real com atualizações sub-100ms.",
      },
    ],
    sections: [
      {
        flexDirection: "row",
        coverImage: PROJECT_IMG.streamSection,
        translations: [
          {
            locale: "en-us",
            summary:
              "A streaming UI that handles 10k events per second without blocking the main thread.",
            readMore: "Read more",
            modalContent:
              "Stream OS uses a worker-based ingest pipeline plus virtualized lists to keep frame budgets under 8ms even under burst load. The data layer is a small reactive store with structural sharing, which lets components subscribe to slices without re-rendering the whole tree.",
            close: "X",
          },
          {
            locale: "es-mx",
            summary:
              "Una UI en streaming que maneja 10k eventos por segundo sin bloquear el hilo principal.",
            readMore: "Leer más",
            modalContent:
              "Stream OS usa un pipeline de ingesta basado en workers y listas virtualizadas para mantener el presupuesto de frame bajo 8ms incluso con bursts. La capa de datos es un store reactivo chico con structural sharing, lo que permite suscribirse a slices sin re-renderizar todo el árbol.",
            close: "X",
          },
          {
            locale: "pt-br",
            summary:
              "Uma UI em streaming que processa 10k eventos por segundo sem travar a thread principal.",
            readMore: "Ler mais",
            modalContent:
              "Stream OS usa um pipeline de ingestão em workers e listas virtualizadas para manter o frame budget abaixo de 8ms mesmo em bursts. A camada de dados é uma store reativa pequena com structural sharing, permitindo assinar slices sem rerender da árvore inteira.",
            close: "X",
          },
        ],
      },
    ],
  },
  {
    slug: "atlas-cms",
    publishedAt: "2026-02-04T00:00:00.000Z",
    shared: {
      coverImageSrc: PROJECT_IMG.atlasCover,
      backgroundImage: PROJECT_IMG.atlasBg,
      status: "Beta",
      type: "Full-stack",
      technologies: "Node.js, PostgreSQL",
      buttons: [
        {
          url: "https://example.com/atlas-cms",
          translations: [
            { locale: "en-us", text: "See preview" },
            { locale: "es-mx", text: "Ver vista previa" },
            { locale: "pt-br", text: "Ver prévia" },
          ],
        },
      ],
    },
    translations: [
      {
        locale: "en-us",
        title: "Atlas CMS",
        status: "Beta",
        type: "Full-stack",
        tags: "#node #postgres #editor",
        message: "Headless CMS for content teams that hate clicking.",
        subtitle: "Keyboard-first authoring with collaborative editing baked in.",
      },
      {
        locale: "es-mx",
        title: "Atlas CMS",
        status: "Beta",
        type: "Full-stack",
        tags: "#node #postgres #editor",
        message: "CMS headless para equipos de contenido que odian clickear.",
        subtitle: "Edición keyboard-first con colaboración en vivo integrada.",
      },
      {
        locale: "pt-br",
        title: "Atlas CMS",
        status: "Beta",
        type: "Full-stack",
        tags: "#node #postgres #editor",
        message: "CMS headless para times de conteúdo que odeiam clicar.",
        subtitle: "Edição keyboard-first com colaboração ao vivo integrada.",
      },
    ],
    sections: [
      {
        flexDirection: "row-reverse",
        coverImage: PROJECT_IMG.atlasSection,
        translations: [
          {
            locale: "en-us",
            summary:
              "A document model based on CRDTs lets multiple editors work on the same draft without merge conflicts.",
            readMore: "Read more",
            modalContent:
              "Atlas stores documents as Yjs CRDTs persisted to Postgres via JSONB plus a small append-only update log. The editor itself is built on TipTap with a custom command palette that surfaces every action by keyboard. Latency between two editors typing on the same document is under 60ms over a typical home connection.",
            close: "X",
          },
          {
            locale: "es-mx",
            summary:
              "Un modelo de documento basado en CRDTs permite que varios editores trabajen el mismo draft sin conflictos.",
            readMore: "Leer más",
            modalContent:
              "Atlas guarda documentos como CRDTs de Yjs persistidos en Postgres con JSONB y un log de updates append-only. El editor es TipTap con un command palette propio que expone toda acción por teclado. La latencia entre dos editores tipeando el mismo doc queda bajo 60ms en una conexión hogareña típica.",
            close: "X",
          },
          {
            locale: "pt-br",
            summary:
              "Um modelo de documento baseado em CRDTs permite que vários editores trabalhem no mesmo rascunho sem conflitos.",
            readMore: "Ler mais",
            modalContent:
              "Atlas guarda documentos como CRDTs Yjs persistidos no Postgres via JSONB mais um log append-only. O editor é TipTap com um command palette próprio que expõe toda ação pelo teclado. A latência entre dois editores digitando no mesmo doc fica abaixo de 60ms em uma conexão doméstica típica.",
            close: "X",
          },
        ],
      },
    ],
  },
  {
    slug: "north-design",
    publishedAt: "2025-11-22T00:00:00.000Z",
    shared: {
      coverImageSrc: PROJECT_IMG.northCover,
      backgroundImage: PROJECT_IMG.northBg,
      status: "Released",
      type: "Design System",
      technologies: "CSS3, React",
      buttons: [
        {
          url: "https://example.com/north-design",
          translations: [
            { locale: "en-us", text: "Open docs" },
            { locale: "es-mx", text: "Abrir docs" },
            { locale: "pt-br", text: "Abrir docs" },
          ],
        },
        {
          url: "https://github.com/example/north-design",
          translations: [
            { locale: "en-us", text: "View source" },
            { locale: "es-mx", text: "Ver código fuente" },
            { locale: "pt-br", text: "Ver código fonte" },
          ],
        },
      ],
    },
    translations: [
      {
        locale: "en-us",
        title: "North",
        status: "Released",
        type: "Design System",
        tags: "#components #tokens #a11y",
        message: "A small design system that earns its keep.",
        subtitle: "60 components, 0 dependencies, full keyboard + screen-reader support.",
      },
      {
        locale: "es-mx",
        title: "North",
        status: "Publicado",
        type: "Design System",
        tags: "#components #tokens #a11y",
        message: "Un design system chico que se gana su lugar.",
        subtitle: "60 componentes, 0 dependencias, soporte completo de teclado y lector de pantalla.",
      },
      {
        locale: "pt-br",
        title: "North",
        status: "Publicado",
        type: "Design System",
        tags: "#components #tokens #a11y",
        message: "Um design system enxuto que justifica seu lugar.",
        subtitle: "60 componentes, 0 dependências, suporte completo a teclado e leitor de tela.",
      },
    ],
    sections: [
      {
        flexDirection: "row",
        coverImage: PROJECT_IMG.northSection,
        translations: [
          {
            locale: "en-us",
            summary:
              "Tokens drive everything — colors, spacing, motion. Switching themes is a single CSS variable change.",
            readMore: "Read more",
            modalContent:
              "North ships as plain CSS plus a tiny set of headless React primitives. Every visual decision is a token, and every token is documented with a usage guideline. The result is a system that designers can read top-to-bottom in an afternoon and engineers can adopt one component at a time.",
            close: "X",
          },
          {
            locale: "es-mx",
            summary:
              "Los tokens manejan todo — colores, spacing, animación. Cambiar de tema es una sola variable CSS.",
            readMore: "Leer más",
            modalContent:
              "North se distribuye como CSS plano más un set chico de primitivas React headless. Toda decisión visual es un token, y todo token está documentado con una guía de uso. El resultado es un sistema que los diseñadores leen de punta a punta en una tarde y los ingenieros adoptan componente por componente.",
            close: "X",
          },
          {
            locale: "pt-br",
            summary:
              "Tokens controlam tudo — cores, spacing, animação. Trocar tema é uma única variável CSS.",
            readMore: "Ler mais",
            modalContent:
              "North é distribuído como CSS puro mais um conjunto pequeno de primitivas React headless. Toda decisão visual é um token, e todo token tem uma diretriz de uso documentada. O resultado é um sistema que designers leem de ponta a ponta em uma tarde e engenheiros adotam um componente por vez.",
            close: "X",
          },
        ],
      },
    ],
  },
];

export const exampleArticles: RawArticle[] = [
  {
    slug: "streaming-uis",
    publishedAt: "2026-04-02T00:00:00.000Z",
    shared: {
      coverImageSrc: ARTICLE_IMG.streamingCover,
      bannerImage: ARTICLE_IMG.streamingBanner,
      researchStyle: { borderTop: "", borderBottom: "" },
    },
    translations: [
      {
        locale: "en-us",
        category: "Engineering",
        title: "On building UIs that stream",
        contentTitle: "Frame budgets, back-pressure, and the small habits that keep latency under control.",
        content:
          "Streaming UIs aren't about WebSockets — they're about keeping the main thread free. Once you start measuring frame budgets in milliseconds, every render becomes a negotiation.",
      },
      {
        locale: "es-mx",
        category: "Ingeniería",
        title: "Sobre construir UIs en streaming",
        contentTitle: "Presupuestos de frame, back-pressure y los hábitos chicos que mantienen la latencia bajo control.",
        content:
          "Las UIs en streaming no son sobre WebSockets — son sobre mantener el hilo principal libre. Una vez que empezás a medir frame budgets en milisegundos, cada render se vuelve una negociación.",
      },
      {
        locale: "pt-br",
        category: "Engenharia",
        title: "Sobre construir UIs em streaming",
        contentTitle: "Frame budgets, back-pressure e os pequenos hábitos que mantêm a latência sob controle.",
        content:
          "UIs em streaming não são sobre WebSockets — são sobre manter a thread principal livre. Quando você começa a medir frame budgets em milissegundos, cada render vira uma negociação.",
      },
    ],
    sections: [
      {
        image: ARTICLE_IMG.streamingBanner,
        translations: [
          {
            locale: "en-us",
            title: "Measure first, optimize never",
            paragraph:
              "Open the Performance tab and record 10 seconds of normal use. The frame chart will tell you where to spend your effort. Don't trust your gut — trust the trace.",
          },
          {
            locale: "es-mx",
            title: "Medí primero, optimizá nunca",
            paragraph:
              "Abrí la pestaña Performance y grabá 10 segundos de uso normal. El frame chart te va a decir dónde invertir esfuerzo. No confíes en la intuición — confiá en el trace.",
          },
          {
            locale: "pt-br",
            title: "Meça primeiro, otimize nunca",
            paragraph:
              "Abra a aba Performance e grave 10 segundos de uso normal. O frame chart vai mostrar onde investir esforço. Não confie no instinto — confie no trace.",
          },
        ],
      },
    ],
  },
  {
    slug: "small-team-tools",
    publishedAt: "2026-03-15T00:00:00.000Z",
    shared: {
      coverImageSrc: ARTICLE_IMG.smallTeamsCover,
      bannerImage: ARTICLE_IMG.smallTeamsBanner,
      researchStyle: { borderTop: "", borderBottom: "" },
    },
    translations: [
      {
        locale: "en-us",
        category: "Notes",
        title: "Tools that respect your time",
        contentTitle: "What I look for when picking software for a five-person team.",
        content:
          "Small teams can't afford tools that demand a full-time admin. The best ones get out of your way after a 20-minute setup and let you focus on the work.",
      },
      {
        locale: "es-mx",
        category: "Notas",
        title: "Herramientas que respetan tu tiempo",
        contentTitle: "Lo que busco al elegir software para un equipo de cinco personas.",
        content:
          "Los equipos chicos no pueden bancarse herramientas que requieren un admin full-time. Las mejores se hacen a un lado después de un setup de 20 minutos y te dejan enfocarte en el trabajo.",
      },
      {
        locale: "pt-br",
        category: "Notas",
        title: "Ferramentas que respeitam seu tempo",
        contentTitle: "O que procuro ao escolher software para um time de cinco pessoas.",
        content:
          "Times pequenos não podem bancar ferramentas que exigem um admin em tempo integral. As melhores saem do seu caminho depois de um setup de 20 minutos e deixam você focar no trabalho.",
      },
    ],
    sections: [
      {
        image: ARTICLE_IMG.smallTeamsCover,
        translations: [
          {
            locale: "en-us",
            title: "The 20-minute test",
            paragraph:
              "If you can't get to your first useful action in 20 minutes, the tool is too heavy for a small team. Time-to-value beats feature surface every time at this scale.",
          },
          {
            locale: "es-mx",
            title: "La prueba de los 20 minutos",
            paragraph:
              "Si no podés llegar a tu primera acción útil en 20 minutos, la herramienta es demasiado pesada para un equipo chico. A esta escala, time-to-value le gana siempre a la cantidad de features.",
          },
          {
            locale: "pt-br",
            title: "O teste dos 20 minutos",
            paragraph:
              "Se você não consegue chegar à sua primeira ação útil em 20 minutos, a ferramenta é pesada demais para um time pequeno. Nessa escala, time-to-value ganha de superfície de features sempre.",
          },
        ],
      },
    ],
  },
  {
    slug: "ts-discriminated-unions",
    publishedAt: "2026-01-28T00:00:00.000Z",
    shared: {
      coverImageSrc: ARTICLE_IMG.tsCover,
      bannerImage: ARTICLE_IMG.tsBanner,
      researchStyle: { borderTop: "", borderBottom: "" },
    },
    translations: [
      {
        locale: "en-us",
        category: "TypeScript",
        title: "Discriminated unions are the API",
        contentTitle: "How modeling state with a tagged union catches bugs before runtime.",
        content:
          "If your function can return either data or an error, model it as a tagged union. The compiler will force every caller to handle both cases — no more 'forgot the null check' bugs.",
      },
      {
        locale: "es-mx",
        category: "TypeScript",
        title: "Las uniones discriminadas son la API",
        contentTitle: "Cómo modelar estado con una unión etiquetada atrapa bugs antes del runtime.",
        content:
          "Si tu función puede devolver data o error, modelalo como una unión etiquetada. El compilador va a forzar a cada caller a manejar ambos casos — se acabaron los bugs de 'me olvidé del null check'.",
      },
      {
        locale: "pt-br",
        category: "TypeScript",
        title: "Discriminated unions são a API",
        contentTitle: "Como modelar estado com uma união marcada pega bugs antes do runtime.",
        content:
          "Se sua função pode devolver data ou erro, modele como uma união marcada. O compilador vai forçar todo caller a tratar os dois casos — fim dos bugs de 'esqueci o null check'.",
      },
    ],
    sections: [
      {
        image: ARTICLE_IMG.tsBanner,
        translations: [
          {
            locale: "en-us",
            title: "Make illegal states unrepresentable",
            paragraph:
              "A loading state can't have data. A success state can't have an error. Model these as separate variants and the bug class disappears.",
          },
          {
            locale: "es-mx",
            title: "Hacer que los estados ilegales sean irrepresentables",
            paragraph:
              "Un estado de loading no puede tener data. Un estado de success no puede tener error. Modelá esto como variantes separadas y la clase de bug desaparece.",
          },
          {
            locale: "pt-br",
            title: "Torne estados ilegais irrepresentáveis",
            paragraph:
              "Um estado de loading não pode ter data. Um estado de success não pode ter erro. Modele isso como variantes separadas e a classe de bug desaparece.",
          },
        ],
      },
    ],
  },
];
