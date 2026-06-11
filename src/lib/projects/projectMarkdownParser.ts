import type { RawButton, RawProject, RawSection, RawTranslation } from "../types";
import {
  CLOSE_BY_LOCALE,
  RAW_SHAPE_HEADING,
  READ_MORE_BY_LOCALE,
  TRANSLATION_PATCH_HEADING,
} from "./projectConstants";
import type { ProjectTranslationPatch } from "./projectTypes";

const fieldLine = /^\s*(?:-\s*)?[A-Za-z][A-Za-z0-9 /]*:\s*/;

function normalizeLines(markdown: string): string[] {
  const lines: string[] = [];
  for (const rawLine of markdown.replace(/\r\n/g, "\n").split("\n")) {
    if (!rawLine.trim()) {
      lines.push("");
      continue;
    }
    if (fieldLine.test(rawLine) || lines.length === 0 || lines[lines.length - 1] === "") {
      lines.push(rawLine);
      continue;
    }
    lines[lines.length - 1] = `${lines[lines.length - 1]} ${rawLine.trim()}`;
  }
  return lines;
}

function getShape(markdown: string, heading: string): string | null {
  const start = markdown.indexOf(heading);
  if (start === -1) return null;

  const rest = markdown.slice(start + heading.length);
  const nextHeading = rest.search(/\n##\s+/);
  return nextHeading === -1 ? rest : rest.slice(0, nextHeading);
}

function scalar(lines: string[], key: string): string | undefined {
  const prefix = `${key}:`;
  const found = lines.find((line) => line.trim().startsWith(prefix));
  return found?.trim().slice(prefix.length).trim();
}

function bullet(lines: string[], key: string): string | undefined {
  const prefix = `- ${key}:`;
  const found = lines.find((line) => line.trim().startsWith(prefix));
  return found?.trim().slice(prefix.length).trim();
}

function extractMarkdownImageSrc(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return trimmed;

  const imgMatch = trimmed.match(/<img\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1[^>]*>/i);
  return imgMatch?.[2]?.trim() || trimmed;
}

function blockBetween(lines: string[], startKey: string, endKeys: string[]): string[] {
  const start = lines.findIndex((line) => line.trim() === `${startKey}:`);
  if (start === -1) return [];

  const end = lines.findIndex(
    (line, index) => index > start && endKeys.some((key) => line.trim() === `${key}:`)
  );
  return lines.slice(start + 1, end === -1 ? undefined : end);
}

function hasUsefulContent(lines: string[]): boolean {
  return lines.some((line) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    return !trimmed.endsWith(":");
  });
}

function defaultReadMore(locale: string): string {
  return READ_MORE_BY_LOCALE[locale] ?? READ_MORE_BY_LOCALE["en-us"];
}

function defaultClose(locale: string): string {
  return CLOSE_BY_LOCALE[locale] ?? CLOSE_BY_LOCALE["en-us"];
}

function parseButtonTranslations(lines: string[], start: number, end: number): RawTranslation[] {
  const translations: RawTranslation[] = [];
  let current: RawTranslation | null = null;

  for (let i = start; i < end; i += 1) {
    const line = lines[i].trim();
    if (line.startsWith("- locale:")) {
      if (current?.locale) translations.push(current);
      current = { locale: line.slice("- locale:".length).trim() };
      continue;
    }
    if (line.startsWith("- text:") && current) {
      current.text = line.slice("- text:".length).trim();
    }
  }

  if (current?.locale) translations.push(current);
  return translations;
}

function parseButtons(sharedLines: string[]): RawButton[] {
  const start = sharedLines.findIndex((line) => line.trim() === "- buttons:");
  if (start === -1) return [];

  const buttonLines = sharedLines.slice(start + 1);
  const iconIndexes = buttonLines
    .map((line, index) => (line.trim().startsWith("- icon:") ? index : -1))
    .filter((index) => index >= 0);

  return iconIndexes
    .map((index, position) => {
      const end = iconIndexes[position + 1] ?? buttonLines.length;
      const chunk = buttonLines.slice(index, end);
      const translationsStart = chunk.findIndex((line) => line.trim() === "- translations:");

      return {
        icon: bullet(chunk, "icon"),
        url: bullet(chunk, "url"),
        translations:
          translationsStart === -1
            ? []
            : parseButtonTranslations(chunk, translationsStart + 1, chunk.length),
      };
    })
    .filter((button) => button.icon || button.url || button.translations.length > 0);
}

function parseTranslations(lines: string[]): RawTranslation[] {
  const localeIndexes = lines
    .map((line, index) => (line.trim().startsWith("- locale:") ? index : -1))
    .filter((index) => index >= 0);

  return localeIndexes
    .map((index, position) => {
      const chunk = lines.slice(index, localeIndexes[position + 1] ?? lines.length);
      return {
        locale: bullet(chunk, "locale") ?? "",
        subtitle: bullet(chunk, "subtitle") ?? "",
      };
    })
    .filter((translation) => translation.locale && translation.subtitle);
}

function parseSectionTranslations(lines: string[]): RawTranslation[] {
  const localeIndexes = lines
    .map((line, index) => (line.trim().startsWith("- locale:") ? index : -1))
    .filter((index) => index >= 0);

  return localeIndexes
    .map((index, position) => {
      const chunk = lines.slice(index, localeIndexes[position + 1] ?? lines.length);
      const locale = bullet(chunk, "locale") ?? "";
      return {
        locale,
        summary: bullet(chunk, "summary") ?? "",
        readMore: bullet(chunk, "readMore") ?? defaultReadMore(locale),
        modalContent: bullet(chunk, "modalContent") ?? "",
        close: bullet(chunk, "close") ?? defaultClose(locale),
      };
    })
    .filter((translation) => translation.locale);
}

function parseSections(lines: string[]): RawSection[] {
  const sectionIndexes = lines
    .map((line, index) => (line.trim().startsWith("- flexDirection:") ? index : -1))
    .filter((index) => index >= 0);

  return sectionIndexes.map((index, position) => {
    const chunk = lines.slice(index, sectionIndexes[position + 1] ?? lines.length);
    const translationsStart = chunk.findIndex((line) => line.trim() === "- translations:");

    return {
      flexDirection: bullet(chunk, "flexDirection"),
      coverImage: extractMarkdownImageSrc(bullet(chunk, "coverImage")),
      translations:
        translationsStart === -1
          ? []
          : parseSectionTranslations(chunk.slice(translationsStart + 1)),
    };
  });
}

function parsePatchSections(lines: string[], locale: string): RawTranslation[] {
  let sectionIndexes = lines
    .map((line, index) => (line.trim().startsWith("- summary:") ? index : -1))
    .filter((index) => index >= 0);

  if (sectionIndexes.length === 0) {
    sectionIndexes = lines
      .map((line, index) => (line.trim().startsWith("- modalContent:") ? index : -1))
      .filter((index) => index >= 0);
  }

  return sectionIndexes.map((index, position) => {
    const chunk = lines.slice(index, sectionIndexes[position + 1] ?? lines.length);
    return {
      locale,
      summary: bullet(chunk, "summary") ?? "",
      readMore: bullet(chunk, "readMore") ?? defaultReadMore(locale),
      modalContent: bullet(chunk, "modalContent") ?? "",
      close: bullet(chunk, "close") ?? defaultClose(locale),
    };
  });
}

export function parseMarkdownProject(markdown: string): RawProject | null {
  const rawShape = getShape(markdown, RAW_SHAPE_HEADING);
  if (!rawShape) return null;

  const lines = normalizeLines(rawShape);
  if (!hasUsefulContent(lines)) return null;

  const sharedLines = blockBetween(lines, "shared", ["translations", "sections"]);
  const translationLines = blockBetween(lines, "translations", ["sections"]);
  const sectionLines = blockBetween(lines, "sections", []);
  const translations = parseTranslations(translationLines);
  const sharedSubtitle = bullet(sharedLines, "subtitle");

  return {
    slug: scalar(lines, "slug") ?? bullet(sharedLines, "slug") ?? "",
    publishedAt: scalar(lines, "publishedAt") === "null" ? null : scalar(lines, "publishedAt"),
    shared: {
      title: bullet(sharedLines, "title") ?? bullet(sharedLines, "name"),
      coverImageSrc: extractMarkdownImageSrc(bullet(sharedLines, "coverImageSrc")),
      backgroundImage: extractMarkdownImageSrc(bullet(sharedLines, "backgroundImage")),
      status: bullet(sharedLines, "status"),
      type: bullet(sharedLines, "type"),
      technologies: bullet(sharedLines, "technologies"),
      buttons: parseButtons(sharedLines),
    },
    translations:
      translations.length > 0
        ? translations
        : sharedSubtitle
          ? [{ locale: "en-us", subtitle: sharedSubtitle }]
          : [],
    sections: parseSections(sectionLines),
  };
}

export function parseMarkdownProjectTranslationPatch(
  markdown: string,
  expectedLocale?: string
): ProjectTranslationPatch | null {
  const rawShape = getShape(markdown, TRANSLATION_PATCH_HEADING);
  if (!rawShape) return null;

  const lines = normalizeLines(rawShape);
  if (!hasUsefulContent(lines)) return null;

  const locale = expectedLocale ?? scalar(lines, "locale") ?? "";
  if (!locale) return null;

  const translationLines = blockBetween(lines, "translation", ["buttons", "sections"]);
  const buttonLines = blockBetween(lines, "buttons", ["sections"]);
  const sectionLines = blockBetween(lines, "sections", []);
  const subtitle = bullet(translationLines, "subtitle");

  return {
    locale,
    translation: subtitle ? { locale, subtitle } : undefined,
    buttonTexts: buttonLines
      .map((line) => (line.trim().startsWith("- text:") ? line.trim().slice("- text:".length).trim() : ""))
      .filter(Boolean),
    sectionTranslations: parsePatchSections(sectionLines, locale),
  };
}
