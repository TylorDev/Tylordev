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

function markdownUrl(repoName: string, locale?: "es" | "pt"): string {
  if (import.meta.env.DEV) {
    return `${LOCAL_TEST_BASE}/${encodeURIComponent(localMarkdownFileName(repoName, locale))}`;
  }

  return wikiMarkdownUrl(
    repoName,
    locale ? `${repoName}${WIKI_LOCALE_SEPARATOR}${locale}.md` : `${repoName}.md`
  );
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
    const markdown = await fetchText(markdownUrl(name, locale), signal);
    if (markdown) return markdown;
  }

  return null;
}
