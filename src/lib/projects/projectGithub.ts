import { GITHUB_USER, LOCAL_PROJECTS_INDEX_URL } from "./projectConstants";
import type { GithubRepo, LocalProjectWhitelistEntry, ProjectAssetManifest, WhitelistedGithubRepo } from "./projectTypes";

function normalizeGithubRepo(repo: Partial<GithubRepo>, name: string): GithubRepo {
  return {
    name,
    description: typeof repo.description === "string" ? repo.description : null,
    homepage: typeof repo.homepage === "string" ? repo.homepage : null,
    topics: Array.isArray(repo.topics) ? repo.topics.filter((topic) => typeof topic === "string") : [],
    pushed_at: typeof repo.pushed_at === "string" ? repo.pushed_at : null,
  };
}

function normalizeRepoNameKey(name: string): string {
  return name.trim().toLowerCase();
}

function githubRepoApiUrl(repoName: string): string {
  const path = `/repos/${GITHUB_USER}/${encodeURIComponent(repoName)}`;
  return import.meta.env.DEV ? `/__dev/github-api${path}` : `https://api.github.com${path}`;
}

function normalizeProjectAssets(entry: LocalProjectWhitelistEntry): ProjectAssetManifest {
  return {
    coverImageSrc: typeof entry.coverImageSrc === "string" ? entry.coverImageSrc : undefined,
    bannerImage: typeof entry.bannerImage === "string" ? entry.bannerImage : undefined,
    sectionImages: Array.isArray(entry.sectionImages)
      ? entry.sectionImages.filter((image) => typeof image === "string")
      : [],
  };
}

async function loadLocalProjectWhitelist(signal: AbortSignal): Promise<LocalProjectWhitelistEntry[]> {
  try {
    const indexRes = await fetch(LOCAL_PROJECTS_INDEX_URL, {
      signal,
      cache: import.meta.env.DEV ? "no-store" : "default",
    });

    if (!indexRes.ok) return [];

    const entries = (await indexRes.json()) as LocalProjectWhitelistEntry[];
    return entries.filter((entry) => typeof entry.name === "string" && entry.name.trim() === entry.name);
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") throw err;
    return [];
  }
}

export async function loadWhitelistedGithubRepos(signal: AbortSignal): Promise<WhitelistedGithubRepo[]> {
  const whitelist = await loadLocalProjectWhitelist(signal);
  if (whitelist.length === 0) return [];

  const repos = await Promise.all(
    whitelist.map(async (entry): Promise<WhitelistedGithubRepo | null> => {
      try {
        const repoRes = await fetch(githubRepoApiUrl(entry.name), {
          signal,
          cache: "default",
        });
        if (!repoRes.ok) return null;

        const repo = (await repoRes.json()) as Partial<GithubRepo>;
        if (typeof repo.name !== "string") return null;
        if (normalizeRepoNameKey(repo.name) !== normalizeRepoNameKey(entry.name)) return null;

        return {
          repo: normalizeGithubRepo(repo, repo.name),
          folderName: entry.name,
          assets: normalizeProjectAssets(entry),
        };
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") throw err;
        return null;
      }
    })
  );

  return repos.filter((entry): entry is WhitelistedGithubRepo => entry !== null);
}
