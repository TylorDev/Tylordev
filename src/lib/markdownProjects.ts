import type { RawProject } from "./types";
import { REMOTE_FETCH_TIMEOUT_MS } from "./projects/projectConstants";
import {
  applyGithubMetadata,
  applyLocalProjectAssets,
  applyTranslationPatch,
  createBaseGithubProject,
  slugifyRepoName,
} from "./projects/projectEnrichment";
import { loadWhitelistedGithubRepos } from "./projects/projectGithub";
import {
  parseMarkdownProject,
  parseMarkdownProjectTranslationPatch,
} from "./projects/projectMarkdownParser";
import {
  fetchFirstMarkdown,
  markdownNameCandidates,
} from "./projects/projectMarkdownSource";
import type { ProjectTranslationPatch } from "./projects/projectTypes";

let remoteProjectsPromise: Promise<RawProject[]> | null = null;

function createTimeoutSignal(timeoutMs: number): AbortSignal {
  const ctrl = new AbortController();
  globalThis.setTimeout(() => ctrl.abort(), timeoutMs);
  return ctrl.signal;
}

async function loadRemoteMarkdownProjects(): Promise<RawProject[]> {
  try {
    const signal = createTimeoutSignal(REMOTE_FETCH_TIMEOUT_MS);
    const whitelistedRepos = await loadWhitelistedGithubRepos(signal);

    const projects = await Promise.all(
      whitelistedRepos
        .filter(({ repo }) => repo.name)
        .map(async ({ repo, folderName, assets }) => {
          const markdownCandidates = markdownNameCandidates(repo.name, folderName);
          const markdown = await fetchFirstMarkdown(markdownCandidates, signal);
          const project = markdown ? parseMarkdownProject(markdown) : null;

          const patches: (ProjectTranslationPatch | null)[] = project
            ? await Promise.all([
                fetchFirstMarkdown(markdownCandidates, signal, "es").then((patchMarkdown) =>
                  patchMarkdown ? parseMarkdownProjectTranslationPatch(patchMarkdown, "es-mx") : null
                ),
                fetchFirstMarkdown(markdownCandidates, signal, "pt").then((patchMarkdown) =>
                  patchMarkdown ? parseMarkdownProjectTranslationPatch(patchMarkdown, "pt-br") : null
                ),
              ])
            : [];
          const validPatches = patches.filter((patch): patch is ProjectTranslationPatch => patch !== null);

          const mergedProject = validPatches.reduce(
            (nextProject, patch) => applyTranslationPatch(nextProject, patch),
            project ? { ...project, slug: slugifyRepoName(repo.name) } : createBaseGithubProject(repo, assets)
          );

          return applyLocalProjectAssets(applyGithubMetadata(mergedProject, repo), assets);
        })
    );

    return projects.filter((project): project is RawProject => project !== null);
  } catch (err) {
    return [];
  }
}

export { parseMarkdownProject, parseMarkdownProjectTranslationPatch };

export function fetchRemoteMarkdownProjects(): Promise<RawProject[]> {
  if (!remoteProjectsPromise) {
    remoteProjectsPromise = loadRemoteMarkdownProjects();
  }
  return remoteProjectsPromise;
}

export function invalidateRemoteMarkdownProjectsCache() {
  remoteProjectsPromise = null;
}
