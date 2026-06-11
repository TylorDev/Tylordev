import type { RawButton, RawProject } from "../types";
import {
  GITHUB_USER,
  LIVE_PREVIEW_LABELS,
  SOURCE_CODE_LABELS,
  TOPIC_TO_TECH,
  TOPIC_TO_TYPE,
  TYPE_TOPIC_PRIORITY,
} from "./projectConstants";
import type { GithubRepo, ProjectAssetManifest, ProjectTranslationPatch } from "./projectTypes";

export function slugifyRepoName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function upsertTranslation<T extends { locale: string }>(list: T[] | undefined, translation: T): T[] {
  const existing = list ?? [];
  if (!existing.some((item) => item.locale === translation.locale)) {
    return [...existing, translation];
  }
  return existing.map((item) =>
    item.locale === translation.locale ? { ...item, ...translation } : item
  );
}

export function applyTranslationPatch(project: RawProject, patch: ProjectTranslationPatch): RawProject {
  return {
    ...project,
    shared: {
      ...project.shared,
      buttons: (project.shared.buttons ?? []).map((button, index) => {
        const text = patch.buttonTexts[index];
        if (!text) return button;
        return {
          ...button,
          translations: upsertTranslation(button.translations, {
            locale: patch.locale,
            text,
          }),
        };
      }),
    },
    translations: patch.translation
      ? upsertTranslation(project.translations, patch.translation)
      : project.translations,
    sections: (project.sections ?? []).map((section, index) => {
      const translation = patch.sectionTranslations[index];
      if (!translation) return section;
      return {
        ...section,
        translations: upsertTranslation(section.translations, translation),
      };
    }),
  };
}

function repoGithubUrl(repoName: string): string {
  return `https://github.com/${GITHUB_USER}/${repoName}`;
}

function normalizeButtonText(text: unknown): string {
  return typeof text === "string"
    ? text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    : "";
}

function isSourceCodeButton(button: RawButton): boolean {
  if (button.icon === "github") return true;
  return (button.translations ?? []).some((translation) => {
    return SOURCE_CODE_LABELS.includes(normalizeButtonText(translation.text));
  });
}

function isLivePreviewButton(button: RawButton): boolean {
  if (button.icon === "preview") return true;
  return (button.translations ?? []).some((translation) => {
    return LIVE_PREVIEW_LABELS.includes(normalizeButtonText(translation.text));
  });
}

function compactButtons(buttons: RawButton[], priorityButtons: RawButton[]): RawButton[] {
  const prioritized = new Set(priorityButtons);
  return [...priorityButtons, ...buttons.filter((button) => !prioritized.has(button))];
}

function ensureRemoteButtons(project: RawProject, repoName: string, website: string | null): RawProject {
  const repoUrl = repoGithubUrl(repoName);
  const buttons = project.shared.buttons ?? [];
  const sourceIndex = buttons.findIndex(isSourceCodeButton);
  const previewIndex = buttons.findIndex(isLivePreviewButton);

  const sourceButton =
    sourceIndex === -1
      ? {
          icon: "github",
          url: repoUrl,
          translations: [
            { locale: "en-us", text: "Source Code" },
            { locale: "es-mx", text: "Codigo fuente" },
            { locale: "pt-br", text: "Codigo fonte" },
          ],
        }
      : { ...buttons[sourceIndex], icon: "github", url: repoUrl };

  const livePreviewUrl = website?.trim();
  const previewButton =
    previewIndex === -1
      ? livePreviewUrl
        ? {
            icon: "preview",
            url: livePreviewUrl,
            translations: [
              { locale: "en-us", text: "Live Preview" },
              { locale: "es-mx", text: "Vista Previa" },
              { locale: "pt-br", text: "Pre-visualizacao" },
            ],
          }
        : undefined
      : {
          ...buttons[previewIndex],
          icon: "preview",
          url: livePreviewUrl || buttons[previewIndex].url,
        };

  const patchedButtons = buttons.map((button, index) => {
    if (index === sourceIndex) return sourceButton;
    if (previewButton && index === previewIndex) return previewButton;
    return button;
  });

  if (sourceIndex === -1) patchedButtons.push(sourceButton);
  if (previewButton && previewIndex === -1) patchedButtons.unshift(previewButton);

  const priorityButtons = previewButton ? [previewButton, sourceButton] : [sourceButton];

  return {
    ...project,
    shared: {
      ...project.shared,
      buttons: compactButtons(patchedButtons, priorityButtons),
    },
  };
}

function applyRemoteRepoIdentity(project: RawProject, repoName: string, website: string | null): RawProject {
  const nextProject = ensureRemoteButtons(project, repoName, website);
  return {
    ...nextProject,
    shared: {
      ...nextProject.shared,
      title: repoName,
    },
  };
}

function applyRemoteRepoSubtitle(project: RawProject, description: string | null): RawProject {
  const subtitle = description?.trim();
  if (!subtitle) return project;

  return {
    ...project,
    translations: upsertTranslation(project.translations, {
      locale: "en-us",
      subtitle,
    }),
  };
}

function normalizeRepoTopics(topics: string[] | undefined): string[] {
  if (!topics || topics.length === 0) return [];

  const seen = new Set<string>();
  const normalized: string[] = [];

  topics.forEach((topic) => {
    const mapped = TOPIC_TO_TECH[topic.toLowerCase()];
    if (!mapped || seen.has(mapped)) return;
    seen.add(mapped);
    normalized.push(mapped);
  });

  return normalized;
}

function applyRemoteRepoTechnologies(project: RawProject, topics: string[] | undefined): RawProject {
  const technologies = normalizeRepoTopics(topics);
  if (technologies.length === 0) return project;

  return {
    ...project,
    shared: {
      ...project.shared,
      technologies: technologies.join(", "),
    },
  };
}

function detectRepoType(topics: string[] | undefined): string | undefined {
  if (!topics || topics.length === 0) return undefined;

  const normalizedTopics = new Set(topics.map((topic) => topic.toLowerCase()));
  const matchedTopic = TYPE_TOPIC_PRIORITY.find((topic) => normalizedTopics.has(topic));
  return matchedTopic ? TOPIC_TO_TYPE[matchedTopic] : undefined;
}

function applyRemoteRepoType(project: RawProject, topics: string[] | undefined): RawProject {
  if (project.shared.type?.trim()) return project;

  const type = detectRepoType(topics);
  if (!type) return project;

  return {
    ...project,
    shared: {
      ...project.shared,
      type,
    },
  };
}

function applyRemoteRepoPublishedAt(project: RawProject, pushedAt: string | null): RawProject {
  if (!pushedAt) return project;
  return {
    ...project,
    publishedAt: pushedAt,
  };
}

export function createBaseGithubProject(repo: GithubRepo, assets: ProjectAssetManifest): RawProject {
  const sectionImages = assets.sectionImages;

  return {
    slug: slugifyRepoName(repo.name),
    publishedAt: repo.pushed_at,
    shared: {
      title: repo.name,
      coverImageSrc: assets.coverImageSrc,
      backgroundImage: assets.bannerImage,
    },
    translations: repo.description
      ? [
          {
            locale: "en-us",
            subtitle: repo.description,
          },
        ]
      : [],
    sections: sectionImages.map((coverImage, index) => ({
      flexDirection: index % 2 === 0 ? "row" : "row-reverse",
      coverImage,
      translations: [],
    })),
  };
}

export function applyGithubMetadata(project: RawProject, repo: GithubRepo): RawProject {
  return applyRemoteRepoIdentity(
    applyRemoteRepoPublishedAt(
      applyRemoteRepoType(
        applyRemoteRepoTechnologies(
          applyRemoteRepoSubtitle(project, repo.description),
          repo.topics
        ),
        repo.topics
      ),
      repo.pushed_at
    ),
    repo.name,
    repo.homepage
  );
}

export function applyLocalProjectAssets(project: RawProject, assets: ProjectAssetManifest): RawProject {
  const coverImage = assets.coverImageSrc;
  const bannerImage = assets.bannerImage;
  const sectionImages = assets.sectionImages;

  return {
    ...project,
    shared: {
      ...project.shared,
      coverImageSrc: coverImage ?? project.shared.coverImageSrc,
      backgroundImage: bannerImage ?? project.shared.backgroundImage,
    },
    sections: (project.sections ?? []).map((section, index) => ({
      ...section,
      coverImage: sectionImages[index] ?? section.coverImage,
    })),
  };
}
