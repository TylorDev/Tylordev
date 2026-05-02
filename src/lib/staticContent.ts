/**
 * Static content fetched from GitHub raw.
 * The file `static-data.json` lives at the root of the TylorDev/Tylordev repo.
 * Upload a new version manually to update content for all visitors.
 *
 * Format matches `examplePages` in fixtures.ts:
 * {
 *   "Header": { "en-us": {...}, "es-mx": {...}, "pt-br": {...} },
 *   "Hero":   { "en-us": {...}, ... },
 *   "About":  { ... },
 *   "Contact":{ ... },
 *   "Footer": { ... }
 * }
 * Any missing section or locale falls back to fixtures.ts.
 */

const STATIC_DATA_URL =
  "https://raw.githubusercontent.com/TylorDev/Tylordev/main/static-data.json";

// In-memory cache so we only fetch once per page load
let _cache: Record<string, Record<string, unknown>> | null | "loading" = null;
let _promise: Promise<Record<string, Record<string, unknown>> | null> | null = null;

async function loadRemoteData(): Promise<Record<string, Record<string, unknown>> | null> {
  if (_cache !== null && _cache !== "loading") return _cache;
  if (_promise) return _promise;

  _cache = "loading";
  _promise = fetch(STATIC_DATA_URL)
    .then((res) => {
      if (!res.ok) {
        // 404 = file not yet uploaded, treat as "no override"
        _cache = null;
        return null;
      }
      return res.json() as Promise<Record<string, Record<string, unknown>>>;
    })
    .then((data) => {
      // Handle empty file ({}) or null gracefully
      _cache = data && Object.keys(data).length > 0 ? data : null;
      return _cache;
    })
    .catch(() => {
      _cache = null;
      return null;
    });

  return _promise;
}

/**
 * Returns the content for a specific page + locale.
 * Merges: remote section → fixture fallback.
 * If the remote JSON doesn't have this section, returns null (caller uses fixture).
 */
export async function fetchRemotePage<T>(
  lang: string,
  pageName: string
): Promise<T | null> {
  const data = await loadRemoteData();
  if (!data) return null;

  const section = data[pageName] as Record<string, T> | undefined;
  if (!section) return null;

  // Prefer the requested locale, fall back to en-us
  return (section[lang] ?? section["en-us"] ?? null) as T | null;
}

/** Force re-fetch on next call (e.g. after uploading a new file) */
export function invalidateStaticCache() {
  _cache = null;
  _promise = null;
}

/** Export the content object as a downloadable JSON file */
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
