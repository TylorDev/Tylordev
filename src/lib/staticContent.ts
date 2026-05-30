/**
 * Static content fetched from the TylorDev/Tylordev GitHub wiki.
 *
 * Base English content lives in `Tylordev.md`; locale-specific files contain
 * only translated fields and are layered over the base content.
 */

const WIKI_RAW_BASE = "https://raw.githubusercontent.com/wiki/TylorDev/Tylordev";
const WIKI_LOCALE_SEPARATOR = "%E2%80%90";
const LOCAL_TEST_BASE = "/Test";
const BASE_MARKDOWN_URL = `${WIKI_RAW_BASE}/Tylordev.md`;
const LOCALE_MARKDOWN_URLS: Record<string, string> = {
  "es-mx": import.meta.env.DEV ? `${LOCAL_TEST_BASE}/Tylordev-es.md` : `${WIKI_RAW_BASE}/Tylordev${WIKI_LOCALE_SEPARATOR}es.md`,
  "pt-br": import.meta.env.DEV ? `${LOCAL_TEST_BASE}/Tylordev-pt.md` : `${WIKI_RAW_BASE}/Tylordev${WIKI_LOCALE_SEPARATOR}pt.md`,
};

type StaticSection = Record<string, unknown>;
type StaticContent = Record<string, StaticSection>;

const PAGE_ALIASES: Record<string, string> = {
  ProjectsContent: "projectsContent",
};

let _cache: Partial<Record<string, string | null>> = {};
let _promises: Partial<Record<string, Promise<string | null>>> = {};
let _contentCache: Partial<Record<string, StaticContent | null>> = {};

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

  const existingPromise = _promises[url];
  if (existingPromise) return existingPromise;

  const promise = fetch(url)
    .then((res) => (res.ok ? res.text() : null))
    .then((text) => {
      _cache[url] = text;
      return text;
    })
    .catch(() => {
      _cache[url] = null;
      return null;
    });

  _promises[url] = promise;
  return promise;
}

function normalizeLines(markdown: string): string[] {
  const fieldLine = /^\s*(?:-\s*)?[A-Za-z][A-Za-z0-9. /]*:\s*/;
  const lines: string[] = [];

  for (const rawLine of markdown.replace(/\r\n/g, "\n").split("\n")) {
    if (!rawLine.trim()) {
      lines.push("");
      continue;
    }
    if (fieldLine.test(rawLine) || rawLine.trim().startsWith("#") || lines.length === 0) {
      lines.push(rawLine);
      continue;
    }
    if (lines[lines.length - 1]?.trim().startsWith("- ")) {
      lines[lines.length - 1] = `${lines[lines.length - 1]} ${rawLine.trim()}`;
    } else {
      lines.push(rawLine);
    }
  }

  return lines;
}

function sectionBlocks(markdown: string): Record<string, string[]> {
  const blocks: Record<string, string[]> = {};
  let current: string | null = null;

  for (const line of normalizeLines(markdown)) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      current = normalizePageName(heading[1].trim());
      blocks[current] = [];
      continue;
    }
    if (current) blocks[current].push(line);
  }

  return blocks;
}

function setPath(target: StaticSection, path: string, value: unknown) {
  const parts = path.split(".");
  let cursor: Record<string, unknown> = target;

  parts.slice(0, -1).forEach((part) => {
    const existing = cursor[part];
    if (!existing || typeof existing !== "object" || Array.isArray(existing)) {
      cursor[part] = {};
    }
    cursor = cursor[part] as Record<string, unknown>;
  });

  cursor[parts[parts.length - 1]] = value;
}

function extractMarkdownImageSrc(value: string): string {
  const trimmed = value.trim();
  const imgMatch = trimmed.match(/<img\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1[^>]*>/i);
  return imgMatch?.[2]?.trim() || trimmed;
}

function isImageField(path: string): boolean {
  const key = path.split(".").at(-1)?.toLowerCase() ?? "";
  return key === "logosrc" || key === "imagesrc" || key.endsWith("src") || key.endsWith("image");
}

function parseKeyValueSection(pageName: string, lines: string[]): StaticSection {
  const section: StaticSection = {};
  const normalizedPageName = normalizePageName(pageName);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line || line.startsWith("#")) continue;

    if (line === "paragraphs:") {
      const paragraphs: string[] = [];
      for (let next = index + 1; next < lines.length; next += 1) {
        const paragraphLine = lines[next].trim();
        if (!paragraphLine) continue;
        if (!paragraphLine.startsWith("- ")) {
          index = next - 1;
          break;
        }
        paragraphs.push(paragraphLine.slice(2).trim());
        index = next;
      }
      setPath(section, "paragraphs", paragraphs);
      continue;
    }

    const match = line.match(/^([A-Za-z][A-Za-z0-9. /]*):\s*(.*)$/);
    if (!match) continue;
    const key = match[1].trim();
    const targetKey = normalizedPageName === "Contact" && key === "email" ? "contactEmail" : key;
    const value = match[2].trim();
    setPath(section, targetKey, isImageField(targetKey) ? extractMarkdownImageSrc(value) : value);
  }

  return section;
}

function mapHeader(section: StaticSection): StaticSection {
  return {
    logoSrc: section.logoSrc,
    logoAlt: section.logoAlt,
    menuLabel: section.menuLabel,
    navItems: section.nav,
    aria: section.aria,
  };
}

function mapHome(section: StaticSection): StaticSection {
  return {
    about: section.about,
    projects: section.projects,
  };
}

function mapAbout(section: StaticSection): StaticSection {
  const history = section.history as StaticSection | undefined;
  const blog = section.blog as StaticSection | undefined;

  return {
    header: section.header,
    profile: section.profile,
    paragraphs: section.paragraphs,
    History: history
      ? {
          imageSrc: history.imageSrc,
          latest: [
            {
              header: {
                section: history.section,
                title: history.title,
              },
              headerTitle: history.headerTitle,
            },
          ],
        }
      : undefined,
    blogHeader: section.blogHeader,
    blog: blog
      ? {
          title: blog.title,
          cornerLink: { icon: blog.cornerIcon },
        }
      : undefined,
  };
}

function mapContact(section: StaticSection): StaticSection {
  const name = section.name as StaticSection | undefined;
  const email = section.email as StaticSection | undefined;
  const message = section.message as StaticSection | undefined;

  return {
    contactMeta: { title: section.title, email: section.contactEmail },
    pageHeader: section.pageHeader,
    formFields: {
      name: {
        label: name?.label,
        placeholder: name?.placeholder,
        errorMessage: name?.error,
      },
      email: {
        label: email?.label,
        placeholder: email?.placeholder,
        errorMessage: {
          required: (email?.error as StaticSection | undefined)?.required,
          invalid: (email?.error as StaticSection | undefined)?.invalid,
        },
      },
      message: {
        label: message?.label,
        placeholder: message?.placeholder,
        errorMessage: message?.error,
      },
      submitButton: section.submitButton,
    },
    replyTime: section.replyTime,
    sendingLabel: section.sendingLabel,
    thankYouMessage: section.thankYouMessage,
  };
}

function mapFooter(section: StaticSection): StaticSection {
  return {
    logoSrc: section.logoSrc,
    logoAlt: section.logoAlt,
    links: section.link,
    headings: section.headings,
    footerText: section.footerText,
  };
}

function mapProjectsContent(section: StaticSection): StaticSection {
  return {
    Projects: {
      header: {
        mainText: section.mainText,
        tittle: section.title,
      },
      filters: section.filters,
      empty: section.empty,
    },
  };
}

function mapProjectDetailContent(section: StaticSection): StaticSection {
  return section;
}

function mapCommonUi(section: StaticSection): StaticSection {
  return section;
}

function pruneEmpty<T>(value: T): T | undefined {
  if (Array.isArray(value)) {
    const items = value
      .map((item) => pruneEmpty(item))
      .filter((item) => item !== undefined);
    return (items.length > 0 ? items : undefined) as T | undefined;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => [key, pruneEmpty(item)] as const)
      .filter(([, item]) => item !== undefined && item !== "");

    if (entries.length === 0) return undefined;
    return Object.fromEntries(entries) as T;
  }

  return value === "" || value === undefined ? undefined : value;
}

function mapSection(pageName: string, section: StaticSection): StaticSection | null {
  const mapped = (() => {
    switch (normalizePageName(pageName)) {
      case "Header":
        return mapHeader(section);
      case "Home":
        return mapHome(section);
      case "About":
        return mapAbout(section);
      case "Contact":
        return mapContact(section);
      case "Footer":
        return mapFooter(section);
      case "projectsContent":
        return mapProjectsContent(section);
      case "ProjectDetailContent":
        return mapProjectDetailContent(section);
      case "CommonUi":
        return mapCommonUi(section);
      default:
        return null;
    }
  })();

  return mapped ? pruneEmpty(mapped) ?? null : null;
}

function parseStaticMarkdown(markdown: string): StaticContent {
  return Object.fromEntries(
    Object.entries(sectionBlocks(markdown))
      .map(([pageName, lines]) => [pageName, mapSection(pageName, parseKeyValueSection(pageName, lines))])
      .filter((entry): entry is [string, StaticSection] => entry[1] !== null)
  );
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

async function loadMarkdownContent(lang: string): Promise<StaticContent | null> {
  if (!import.meta.env.DEV && Object.prototype.hasOwnProperty.call(_contentCache, lang)) {
    return _contentCache[lang] ?? null;
  }

  const baseMarkdownUrl = import.meta.env.DEV ? `${LOCAL_TEST_BASE}/Tylordev.md` : BASE_MARKDOWN_URL;
  const baseMarkdown = await fetchText(baseMarkdownUrl);
  if (!baseMarkdown) {
    _contentCache[lang] = null;
    return null;
  }

  const baseContent = parseStaticMarkdown(baseMarkdown);
  const translationUrl = LOCALE_MARKDOWN_URLS[lang];
  if (!translationUrl) {
    _contentCache[lang] = baseContent;
    return baseContent;
  }

  const translationMarkdown = await fetchText(translationUrl);
  const translationContent = translationMarkdown ? parseStaticMarkdown(translationMarkdown) : {};
  const mergedContent = deepMerge(baseContent, translationContent);
  _contentCache[lang] = mergedContent;
  return mergedContent;
}

export async function fetchRemotePage<T>(lang: string, pageName: string): Promise<T | null> {
  const data = await loadMarkdownContent(lang);
  if (!data) return null;

  return (data[normalizePageName(pageName)] ?? null) as T | null;
}

export function mergePageData<T>(fixture: T, remote: unknown): T {
  return remote ? deepMerge(fixture, remote) : fixture;
}

export function invalidateStaticCache() {
  _cache = {};
  _promises = {};
  _contentCache = {};
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
