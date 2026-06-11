import type { RawTranslation } from "../types";

export interface GithubRepo {
  name: string;
  description: string | null;
  homepage: string | null;
  topics: string[];
  pushed_at: string | null;
}

export interface ProjectAssetManifest {
  coverImageSrc?: string;
  bannerImage?: string;
  sectionImages: string[];
}

export interface LocalProjectWhitelistEntry {
  name: string;
  coverImageSrc?: string;
  bannerImage?: string;
  sectionImages?: string[];
}

export interface WhitelistedGithubRepo {
  repo: GithubRepo;
  folderName: string;
  assets: ProjectAssetManifest;
}

export interface ProjectTranslationPatch {
  locale: string;
  translation?: RawTranslation;
  buttonTexts: string[];
  sectionTranslations: RawTranslation[];
}
