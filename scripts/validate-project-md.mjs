import fs from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GITHUB_USER = "TylorDev";

const RAW_PROJECT_HEADING = "## RawProject shape in Markdown";
const TRANSLATION_PATCH_HEADING = "## RawProject translation patch in Markdown";

const VALID_FLEX_DIRECTIONS = new Set(["row", "row-reverse"]);

// Fields the parser actually reads — anything else is extra noise.
// Reference: src/lib/projects/projectMarkdownParser.ts

const ALLOWED_TOP_LEVEL_SCALARS = new Set(["slug", "publishedAt"]);

const ALLOWED_SHARED_FIELDS = new Set([
  "slug",
  "title",
  "name",
  "subtitle",
  "coverImageSrc",
  "backgroundImage",
  "status",
  "type",
  "technologies",
  "buttons",
]);

const ALLOWED_SHARED_BUTTON_FIELDS = new Set(["icon", "url", "translations"]);
const ALLOWED_SHARED_BUTTON_TRANSLATION_FIELDS = new Set(["locale", "text"]);

const ALLOWED_SECTION_FIELDS = new Set([
  "flexDirection",
  "coverImage",
  "translations",
]);

const ALLOWED_SECTION_TRANSLATION_FIELDS = new Set([
  "locale",
  "summary",
  "readMore",
  "modalContent",
  "close",
]);

const ALLOWED_PATCH_TOP_LEVEL_KEYS = new Set([
  "locale",
  "translation",
  "buttons",
  "sections",
]);

const ALLOWED_PATCH_TRANSLATION_FIELDS = new Set(["subtitle"]);

const ALLOWED_PATCH_SECTION_FIELDS = new Set([
  "summary",
  "readMore",
  "modalContent",
  "close",
]);

// Base-file top-level blocks the parser looks for.
const ALLOWED_BASE_TOP_LEVEL_BLOCKS = new Set([
  "shared",
  "translations",
  "sections",
]);

// ---------------------------------------------------------------------------
// Report helpers
// ---------------------------------------------------------------------------

function createReport() {
  return new Map();
}

function addError(report, group, message) {
  if (!report.has(group)) report.set(group, []);
  report.get(group).push(message);
}

function displayPath(filePath) {
  return filePath.replace(/\\/g, "/");
}

function lineRef(shapeStartLine, localIndex) {
  if (localIndex < 0) return "";
  return ` (line ${shapeStartLine + localIndex + 1})`;
}

// ---------------------------------------------------------------------------
// File I/O
// ---------------------------------------------------------------------------

function normalizeMarkdown(markdown) {
  return markdown.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function readMarkdown(filePath, report) {
  try {
    return normalizeMarkdown(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    addError(report, displayPath(filePath), `Cannot read file: ${error.message}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Shape extraction
// ---------------------------------------------------------------------------

/**
 * Returns { text, startLine } where startLine is the 0-based line index
 * within the full file where the heading occurs.
 */
function getShape(markdown, heading) {
  const start = markdown.indexOf(heading);
  if (start === -1) return null;

  const linesBefore = markdown.slice(0, start).split("\n").length - 1;

  const rest = markdown.slice(start + heading.length);
  const nextHeading = rest.search(/\n##\s+/);
  const text = nextHeading === -1 ? rest : rest.slice(0, nextHeading);

  return { text, startLine: linesBefore };
}

// ---------------------------------------------------------------------------
// Line-level helpers
// ---------------------------------------------------------------------------

/** Extract the key from a line like `  - key: value` or `key: value`. */
function extractKey(line) {
  const m = line.match(/^(\s*)(?:-\s+)?([A-Za-z][A-Za-z0-9 /]*):\s*/);
  return m ? { indent: m[1].length, bullet: line.trimStart().startsWith("-"), key: m[2].trim() } : null;
}

function topLevelKeyIndex(lines, key) {
  return lines.findIndex((line) => line === `${key}:`);
}

function blockBetween(lines, startKey, endKeys) {
  const start = topLevelKeyIndex(lines, startKey);
  if (start === -1) return { start, lines: [] };

  const end = lines.findIndex(
    (line, index) => index > start && endKeys.some((key) => line === `${key}:`)
  );

  return {
    start,
    lines: lines.slice(start + 1, end === -1 ? undefined : end),
  };
}

function bulletValue(lines, key) {
  const prefix = `- ${key}:`;
  const index = lines.findIndex((line) => line.trim().startsWith(prefix));
  if (index === -1) return { index: -1, value: "" };
  return {
    index,
    value: lines[index].trim().slice(prefix.length).trim(),
  };
}

// ---------------------------------------------------------------------------
// Section splitters
// ---------------------------------------------------------------------------

function splitBaseSections(sectionLines) {
  const starts = sectionLines
    .map((line, index) => (line.trim().startsWith("- flexDirection:") ? index : -1))
    .filter((index) => index >= 0);

  return starts.map((start, position) =>
    sectionLines.slice(start, starts[position + 1] ?? sectionLines.length)
  );
}

function splitPatchSections(sectionLines) {
  const starts = sectionLines
    .map((line, index) => (line.trim().startsWith("- summary:") ? index : -1))
    .filter((index) => index >= 0);

  return starts.map((start, position) =>
    sectionLines.slice(start, starts[position + 1] ?? sectionLines.length)
  );
}

// ---------------------------------------------------------------------------
// Extra-field detection
// ---------------------------------------------------------------------------

function detectExtraFields(lines, allowedSet, report, group, shapeStart, label) {
  lines.forEach((line, i) => {
    const parsed = extractKey(line);
    if (!parsed) return;
    if (!allowedSet.has(parsed.key)) {
      addError(
        report,
        group,
        `${label}: unknown field "${parsed.key}"${lineRef(shapeStart, i)}.`
      );
    }
  });
}

// ---------------------------------------------------------------------------
// Indentation checks
// ---------------------------------------------------------------------------

function checkTopLevelIndent(lines, key, report, group, shapeStart) {
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === `${key}:`) {
      if (lines[i] !== `${key}:`) {
        addError(
          report,
          group,
          `"${key}:" must be top-level (no indentation)${lineRef(shapeStart, i)}.`
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Validate BASE markdown (RawProject shape)
// ---------------------------------------------------------------------------

function validateBaseMarkdown(filePath, markdown, report) {
  const group = displayPath(filePath);
  const shape = getShape(markdown, RAW_PROJECT_HEADING);

  if (!shape) {
    addError(report, group, `Missing "${RAW_PROJECT_HEADING}".`);
    return 0;
  }

  const lines = shape.text.split("\n");
  const shapeStart = shape.startLine;

  // --- Top-level block indentation -----------------------------------------
  for (const block of ["shared", "sections", "translations"]) {
    checkTopLevelIndent(lines, block, report, group, shapeStart);
  }

  // --- Detect unknown top-level blocks -------------------------------------
  lines.forEach((line, i) => {
    // A top-level block is a line like `word:` at column 0 with no bullet.
    if (/^[a-zA-Z][a-zA-Z0-9]*:\s*$/.test(line)) {
      const key = line.slice(0, -1).trim();
      if (
        !ALLOWED_BASE_TOP_LEVEL_BLOCKS.has(key) &&
        !ALLOWED_TOP_LEVEL_SCALARS.has(key)
      ) {
        addError(
          report,
          group,
          `Unknown top-level block "${key}:"${lineRef(shapeStart, i)}.`
        );
      }
    }
  });

  // --- Top-level scalars (slug, publishedAt) — allowed at root level --------
  // (No extra validation needed; just not flagged as unknown above.)

  // --- shared block --------------------------------------------------------
  const shared = blockBetween(lines, "shared", ["translations", "sections"]);

  if (shared.start === -1) {
    addError(report, group, 'Missing top-level "shared:" block.');
  } else {
    // Check shared-level fields for extras.
    const sharedOffset = shapeStart + shared.start + 1;
    const sharedFieldLines = shared.lines.filter((l) => {
      const trimmed = l.trim();
      // Only look at bullet fields, skip sub-blocks like `- buttons:` children
      // and nested translation/button lines.
      return trimmed.startsWith("- ") && /^- [A-Za-z]/.test(trimmed);
    });

    // Walk shared lines to find top-level bullet fields (not nested inside buttons).
    let insideButtons = false;
    for (let i = 0; i < shared.lines.length; i++) {
      const line = shared.lines[i];
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed === "- buttons:") {
        insideButtons = true;
        continue;
      }

      // Detect when we leave the buttons sub-block (a bullet at shared indentation level)
      if (insideButtons) {
        // Inside buttons, fields use deeper indentation. A top-level `- field:` exits buttons.
        const parsed = extractKey(line);
        if (parsed && parsed.bullet && parsed.indent === 0) {
          insideButtons = false;
        } else {
          // Validate button fields in a separate pass below.
          continue;
        }
      }

      // Validate shared bullet field.
      const parsed = extractKey(line);
      if (parsed && parsed.bullet) {
        if (!ALLOWED_SHARED_FIELDS.has(parsed.key)) {
          addError(
            report,
            group,
            `shared: unknown field "${parsed.key}"${lineRef(shapeStart, shared.start + 1 + i)}.`
          );
        }
      }
    }

    // Validate button sub-blocks within shared.
    validateSharedButtons(shared.lines, report, group, shapeStart + shared.start + 1);
  }

  // --- sections block ------------------------------------------------------
  const sections = blockBetween(lines, "sections", []);

  if (sections.start === -1) {
    addError(report, group, 'Missing top-level "sections:" block.');
    return 0;
  }

  const sectionChunks = splitBaseSections(sections.lines);
  if (sectionChunks.length === 0) {
    addError(report, group, 'The "sections:" block must contain at least one section.');
    return 0;
  }

  const sectionsOffset = shapeStart + sections.start + 1;

  sectionChunks.forEach((chunk, sectionIndex) => {
    const sectionNumber = sectionIndex + 1;

    // -- flexDirection
    const flexDir = bulletValue(chunk, "flexDirection");
    if (!flexDir.value) {
      addError(report, group, `Section ${sectionNumber} is missing "- flexDirection:".`);
    } else if (!VALID_FLEX_DIRECTIONS.has(flexDir.value)) {
      addError(
        report,
        group,
        `Section ${sectionNumber} has invalid flexDirection "${flexDir.value}". Expected "row" or "row-reverse".`
      );
    }

    // -- coverImage
    const cover = bulletValue(chunk, "coverImage");
    if (!cover.value) {
      addError(report, group, `Section ${sectionNumber} is missing "- coverImage:".`);
    }

    // -- translations sub-block
    const translationsIndex = chunk.findIndex((line) => line.trim() === "- translations:");
    if (translationsIndex === -1) {
      addError(report, group, `Section ${sectionNumber} is missing "- translations:".`);
    } else {
      const translationLines = chunk.slice(translationsIndex + 1);
      validateSectionTranslations(
        translationLines,
        sectionNumber,
        report,
        group,
        sectionsOffset,
        true // isBase — require en-us
      );
    }

    // -- Extra fields in section
    let insideTranslations = false;
    for (const line of chunk) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed === "- translations:") {
        insideTranslations = true;
        continue;
      }
      if (insideTranslations) continue; // translations children handled separately

      const parsed = extractKey(line);
      if (parsed && parsed.bullet) {
        if (!ALLOWED_SECTION_FIELDS.has(parsed.key)) {
          addError(
            report,
            group,
            `Section ${sectionNumber}: unknown field "${parsed.key}".`
          );
        }
      }
    }
  });

  return sectionChunks.length;
}

// ---------------------------------------------------------------------------
// Validate shared > buttons
// ---------------------------------------------------------------------------

function validateSharedButtons(sharedLines, report, group, offset) {
  const buttonsStart = sharedLines.findIndex((line) => line.trim() === "- buttons:");
  if (buttonsStart === -1) return; // buttons are optional

  // Collect lines belonging to the buttons sub-block.
  const buttonsEnd = sharedLines.findIndex((line, index) => {
    if (index <= buttonsStart) return false;
    const parsed = extractKey(line);
    // A top-level bullet (indent 0) means we left the buttons block.
    return parsed && parsed.bullet && parsed.indent === 0;
  });

  const buttonLines = sharedLines.slice(
    buttonsStart + 1,
    buttonsEnd === -1 ? undefined : buttonsEnd
  );

  // Split by `- icon:` to find each button.
  const iconStarts = buttonLines
    .map((line, i) => (line.trim().startsWith("- icon:") ? i : -1))
    .filter((i) => i >= 0);

  iconStarts.forEach((start, pos) => {
    const chunk = buttonLines.slice(start, iconStarts[pos + 1] ?? buttonLines.length);
    let insideTranslations = false;

    for (const line of chunk) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed === "- translations:") {
        insideTranslations = true;
        continue;
      }

      const parsed = extractKey(line);
      if (!parsed) continue;

      if (insideTranslations) {
        if (!ALLOWED_SHARED_BUTTON_TRANSLATION_FIELDS.has(parsed.key)) {
          addError(
            report,
            group,
            `shared > buttons > translations: unknown field "${parsed.key}".`
          );
        }
      } else {
        if (parsed.bullet && !ALLOWED_SHARED_BUTTON_FIELDS.has(parsed.key)) {
          addError(
            report,
            group,
            `shared > buttons: unknown field "${parsed.key}".`
          );
        }
      }
    }
  });
}

// ---------------------------------------------------------------------------
// Validate section translations
// ---------------------------------------------------------------------------

function validateSectionTranslations(
  translationLines,
  sectionNumber,
  report,
  group,
  offset,
  requireEnUs
) {
  // Split by locale
  const localeStarts = translationLines
    .map((line, i) => (line.trim().startsWith("- locale:") ? i : -1))
    .filter((i) => i >= 0);

  if (localeStarts.length === 0 && requireEnUs) {
    addError(report, group, `Section ${sectionNumber} translations: missing "- locale: en-us".`);
    return;
  }

  let foundEnUs = false;

  localeStarts.forEach((start, pos) => {
    const chunk = translationLines.slice(start, localeStarts[pos + 1] ?? translationLines.length);
    const locale = bulletValue(chunk, "locale").value;

    if (requireEnUs && locale === "en-us") foundEnUs = true;

    if (!bulletValue(chunk, "summary").value) {
      addError(
        report,
        group,
        `Section ${sectionNumber} translation "${locale || "unknown"}": missing "- summary:".`
      );
    }

    if (!bulletValue(chunk, "modalContent").value) {
      addError(
        report,
        group,
        `Section ${sectionNumber} translation "${locale || "unknown"}": missing "- modalContent:".`
      );
    }

    // Extra fields
    for (const line of chunk) {
      const parsed = extractKey(line);
      if (!parsed) continue;
      if (parsed.bullet && !ALLOWED_SECTION_TRANSLATION_FIELDS.has(parsed.key)) {
        addError(
          report,
          group,
          `Section ${sectionNumber} translation "${locale || "unknown"}": unknown field "${parsed.key}".`
        );
      }
    }
  });

  if (requireEnUs && !foundEnUs) {
    addError(
      report,
      group,
      `Section ${sectionNumber} translations: must include "- locale: en-us".`
    );
  }
}

// ---------------------------------------------------------------------------
// Validate PATCH markdown (translation patch)
// ---------------------------------------------------------------------------

function validatePatchMarkdown(filePath, markdown, expectedLocale, expectedSectionCount, report) {
  const group = displayPath(filePath);
  const shape = getShape(markdown, TRANSLATION_PATCH_HEADING);

  if (!shape) {
    addError(report, group, `Missing "${TRANSLATION_PATCH_HEADING}".`);
    return;
  }

  const lines = shape.text.split("\n");
  const shapeStart = shape.startLine;

  // --- locale must be top-level -------------------------------------------
  const localeLineIndex = lines.findIndex((line) => line.startsWith("locale:"));
  const localeValue =
    localeLineIndex >= 0
      ? lines[localeLineIndex].slice("locale:".length).trim()
      : "";

  if (!localeValue) {
    addError(report, group, `Missing top-level "locale: ${expectedLocale}".`);
  } else if (localeValue !== expectedLocale) {
    addError(
      report,
      group,
      `Locale must be "${expectedLocale}", found "${localeValue}"${lineRef(shapeStart, localeLineIndex)}.`
    );
  }

  // --- Check that `sections:` is truly top-level (not indented) -----------
  const sectionsLooseIndex = lines.findIndex((line) => line.trim() === "sections:");
  const sectionsStrictIndex = topLevelKeyIndex(lines, "sections");
  const sectionsIndented = sectionsLooseIndex >= 0 && sectionsStrictIndex === -1;

  if (sectionsIndented) {
    addError(
      report,
      group,
      `"sections:" must be top-level (no indentation)${lineRef(shapeStart, sectionsLooseIndex)}.`
    );
  }

  // --- Detect unknown top-level keys --------------------------------------
  lines.forEach((line, i) => {
    if (/^[a-zA-Z][a-zA-Z0-9]*:\s*$/.test(line)) {
      const key = line.slice(0, line.indexOf(":")).trim();
      if (!ALLOWED_PATCH_TOP_LEVEL_KEYS.has(key)) {
        addError(
          report,
          group,
          `Unknown top-level key "${key}:"${lineRef(shapeStart, i)}.`
        );
      }
    }
  });

  // --- translation block ---------------------------------------------------
  // When `sections:` is indented, blockBetween won't find it as an end-key.
  // Manually limit the translation block to stop before the indented `sections:`.
  const translationEndKeys = ["buttons", "sections"];
  let translation = blockBetween(lines, "translation", translationEndKeys);

  if (translation.start !== -1 && sectionsIndented) {
    // Trim translation lines to stop before the indented `sections:` line.
    const relativeLoose = sectionsLooseIndex - translation.start - 1;
    if (relativeLoose >= 0 && relativeLoose < translation.lines.length) {
      translation = { start: translation.start, lines: translation.lines.slice(0, relativeLoose) };
    }
  }

  if (translation.start === -1) {
    addError(report, group, 'Missing top-level "translation:" block.');
  } else {
    if (!bulletValue(translation.lines, "subtitle").value) {
      addError(report, group, 'The "translation:" block is missing "- subtitle:".');
    }

    // Extra fields in translation block
    for (const line of translation.lines) {
      const parsed = extractKey(line);
      if (!parsed) continue;
      if (parsed.bullet && !ALLOWED_PATCH_TRANSLATION_FIELDS.has(parsed.key)) {
        addError(
          report,
          group,
          `translation: unknown field "${parsed.key}".`
        );
      }
    }
  }

  // --- sections block ------------------------------------------------------
  const sections = blockBetween(lines, "sections", []);

  if (sections.start === -1) {
    if (sectionsLooseIndex >= 0) {
      // Already reported indentation error above.
    } else {
      addError(report, group, 'Missing top-level "sections:" block.');
    }
    return;
  }

  const sectionChunks = splitPatchSections(sections.lines);
  if (sectionChunks.length !== expectedSectionCount) {
    addError(
      report,
      group,
      `Translated section count must match base file. Expected ${expectedSectionCount}, found ${sectionChunks.length}.`
    );
  }

  sectionChunks.forEach((chunk, index) => {
    const sectionNumber = index + 1;

    if (!bulletValue(chunk, "summary").value) {
      addError(report, group, `Section ${sectionNumber} is missing "- summary:".`);
    }

    if (!bulletValue(chunk, "modalContent").value) {
      addError(report, group, `Section ${sectionNumber} is missing "- modalContent:".`);
    }

    // Extra fields
    for (const line of chunk) {
      const parsed = extractKey(line);
      if (!parsed) continue;
      if (parsed.bullet && !ALLOWED_PATCH_SECTION_FIELDS.has(parsed.key)) {
        addError(
          report,
          group,
          `Section ${sectionNumber}: unknown field "${parsed.key}".`
        );
      }
    }
  });
}

// ---------------------------------------------------------------------------
// File-name validation
// ---------------------------------------------------------------------------

function validateFileNames(basePath, esPath, ptPath, report) {
  const baseName = path.basename(basePath);
  const esName = path.basename(esPath);
  const ptName = path.basename(ptPath);
  const baseMatch = baseName.match(/^(.+)\.md$/);

  if (!baseMatch) {
    addError(report, "File names", `Base file must be named "ProjectName.md", received "${baseName}".`);
    return null;
  }

  const projectName = baseMatch[1];

  if (projectName.endsWith("-es") || projectName.endsWith("-pt")) {
    addError(report, "File names", `Base file cannot include a language suffix: "${baseName}".`);
  }

  const expectedEsName = `${projectName}-es.md`;
  const expectedPtName = `${projectName}-pt.md`;

  if (esName !== expectedEsName) {
    addError(report, "File names", `Spanish file must be "${expectedEsName}", received "${esName}".`);
  }

  if (ptName !== expectedPtName) {
    addError(report, "File names", `Portuguese file must be "${expectedPtName}", received "${ptName}".`);
  }

  return projectName;
}

// ---------------------------------------------------------------------------
// GitHub repo verification
// ---------------------------------------------------------------------------

async function verifyGithubRepo(projectName, report) {
  const url = `https://api.github.com/repos/${GITHUB_USER}/${projectName}`;
  const group = `GitHub: ${GITHUB_USER}/${projectName}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!response.ok) {
      addError(
        report,
        group,
        `Repository not found (HTTP ${response.status}). Expected ${url} to exist.`
      );
      return;
    }

    const data = await response.json();

    if (data.name !== projectName) {
      addError(
        report,
        group,
        `Repository name mismatch (case sensitive). Expected "${projectName}", GitHub returned "${data.name}".`
      );
    }
  } catch (error) {
    addError(report, group, `Failed to verify repository: ${error.message}`);
  }
}

// ---------------------------------------------------------------------------
// Report printing
// ---------------------------------------------------------------------------

function printReport(report) {
  if (report.size === 0) {
    console.log("✓ Project markdown validation passed.");
    return;
  }

  console.error("✗ Project markdown validation failed:\n");
  for (const [group, errors] of report.entries()) {
    console.error(`  ${group}`);
    errors.forEach((error) => console.error(`    - ${error}`));
    console.error("");
  }
}

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

function usage() {
  console.error(
    [
      "Usage:",
      "  node scripts/validate-project-md.mjs <Base.md> <Base-es.md> <Base-pt.md> [...]",
      "",
      "Arguments must be provided in trios (base, Spanish, Portuguese).",
      "Multiple trios can be validated in a single run.",
      "",
      "Examples:",
      "  node scripts/validate-project-md.mjs public/Test/Elevate.md public/Test/Elevate-es.md public/Test/Elevate-pt.md",
      "",
      "  node scripts/validate-project-md.mjs \\",
      "    public/Test/Elevate.md public/Test/Elevate-es.md public/Test/Elevate-pt.md \\",
      "    public/Test/Blight.md public/Test/Blight-es.md public/Test/Blight-pt.md",
    ].join("\n")
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const report = createReport();

  if (args.length === 0) {
    usage();
    process.exitCode = 1;
    return;
  }

  if (args.length % 3 !== 0) {
    addError(
      report,
      "CLI arguments",
      `Arguments must be a multiple of 3 (base, -es, -pt). Received ${args.length} argument${args.length === 1 ? "" : "s"}.`
    );
    printReport(report);
    usage();
    process.exitCode = 1;
    return;
  }

  const trioCount = args.length / 3;

  for (let t = 0; t < trioCount; t++) {
    const basePath = args[t * 3];
    const esPath = args[t * 3 + 1];
    const ptPath = args[t * 3 + 2];

    const projectName = validateFileNames(basePath, esPath, ptPath, report);
    if (!projectName) continue;

    // Read files
    const baseMarkdown = readMarkdown(basePath, report);
    const esMarkdown = readMarkdown(esPath, report);
    const ptMarkdown = readMarkdown(ptPath, report);

    // Validate base
    const baseSectionCount = baseMarkdown
      ? validateBaseMarkdown(basePath, baseMarkdown, report)
      : 0;

    // Validate patches
    if (esMarkdown) {
      validatePatchMarkdown(esPath, esMarkdown, "es-mx", baseSectionCount, report);
    }

    if (ptMarkdown) {
      validatePatchMarkdown(ptPath, ptMarkdown, "pt-br", baseSectionCount, report);
    }

    // Verify GitHub repo
    await verifyGithubRepo(projectName, report);
  }

  printReport(report);
  process.exitCode = report.size === 0 ? 0 : 1;
}

main();
