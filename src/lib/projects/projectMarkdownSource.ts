import { GITHUB_USER, LOCAL_TEST_BASE, WIKI_LOCALE_SEPARATOR } from "./projectConstants";

export async function fetchText(url: string, signal?: AbortSignal): Promise<string | null> {
  try {
    const res = await fetch(url, { signal, cache: import.meta.env.DEV ? "no-store" : "default" });
    if (!res.ok) return null;
    return res.text();
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") throw err;
    return null;
  }
}

function wikiMarkdownUrl(repoName: string, fileName: string): string {
  return `https://raw.githubusercontent.com/wiki/${GITHUB_USER}/${repoName}/${encodeURIComponent(fileName)}`;
}

function localMarkdownFileName(repoName: string, locale?: "es" | "pt"): string {
  return locale ? `${repoName}-${locale}.md` : `${repoName}.md`;
}

function translationMarkdownFileNames(repoName: string, locale: "es" | "pt"): string[] {
  const lowercaseRepoName = repoName.toLowerCase();
  const candidates = [
    `${repoName}-${locale}.md`,
    `${lowercaseRepoName}-${locale}.md`,
    `${repoName} ${locale}.md`,
    `${lowercaseRepoName} ${locale}.md`,
  ];

  return candidates.filter((fileName, index) => candidates.indexOf(fileName) === index);
}

function markdownFileNames(repoName: string, locale?: "es" | "pt"): string[] {
  return locale ? translationMarkdownFileNames(repoName, locale) : [localMarkdownFileName(repoName)];
}

function markdownUrl(repoName: string, fileName: string): string {
  if (import.meta.env.DEV) {
    return `${LOCAL_TEST_BASE}/${encodeURIComponent(fileName)}`;
  }

  return wikiMarkdownUrl(repoName, fileName);
}

export function markdownNameCandidates(repoName: string, folderName: string): string[] {
  const seen = new Set<string>();
  return [repoName, folderName].filter((name) => {
    if (seen.has(name)) return false;
    seen.add(name);
    return true;
  });
}

export async function fetchFirstMarkdown(
  names: string[],
  signal: AbortSignal,
  locale?: "es" | "pt"
): Promise<string | null> {
  for (const name of names) {
    const fileNames = import.meta.env.DEV
      ? markdownFileNames(name, locale)
      : locale
        ? [
            `${name}${WIKI_LOCALE_SEPARATOR}${locale}.md`,
            ...translationMarkdownFileNames(name, locale),
          ]
        : markdownFileNames(name);

    for (const fileName of fileNames) {
      const markdown = await fetchText(markdownUrl(name, fileName), signal);
      if (markdown) return markdown;
    }
  }

  return null;
}
