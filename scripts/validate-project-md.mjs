import fs from "node:fs";
import path from "node:path";

const RAW_PROJECT_HEADING = "## RawProject shape in Markdown";
const TRANSLATION_PATCH_HEADING = "## RawProject translation patch in Markdown";
const VALID_FLEX_DIRECTIONS = new Set(["row", "row-reverse"]);

function usage() {
  console.error(
    [
      "Usage:",
      "  node scripts/validate-project-md.mjs <Project.md> <Project-es.md> <Project-pt.md>",
      "",
      "Example:",
      "  node scripts/validate-project-md.mjs public/Test/Elevate.md public/Test/Elevate-es.md public/Test/Elevate-pt.md",
    ].join("\n")
  );
}

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

function lineNumber(lines, index) {
  return index < 0 ? "unknown line" : `line ${index + 1}`;
}

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

function getShape(markdown, heading) {
  const start = markdown.indexOf(heading);
  if (start === -1) return null;

  const rest = markdown.slice(start + heading.length);
  const nextHeading = rest.search(/\n##\s+/);
  return nextHeading === -1 ? rest : rest.slice(0, nextHeading);
}

function topLevelKeyIndex(lines, key) {
  return lines.findIndex((line) => line === `${key}:`);
}

function looseKeyIndex(lines, key) {
  return lines.findIndex((line) => line.trim() === `${key}:`);
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

function topLevelScalarValue(lines, key) {
  const prefix = `${key}:`;
  const index = lines.findIndex((line) => line.startsWith(prefix));
  if (index === -1) return { index: -1, value: "" };
  return {
    index,
    value: lines[index].slice(prefix.length).trim(),
  };
}

function validateRequiredBullet(report, group, chunk, key, sectionNumber) {
  const found = bulletValue(chunk, key);
  if (!found.value) {
    addError(report, group, `Section ${sectionNumber} is missing "- ${key}:".`);
  }
  return found.value;
}

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

function validateBaseMarkdown(filePath, markdown, report) {
  const group = displayPath(filePath);
  const shape = getShape(markdown, RAW_PROJECT_HEADING);

  if (!shape) {
    addError(report, group, `Missing "${RAW_PROJECT_HEADING}".`);
    return 0;
  }

  const lines = shape.split("\n");
  const shared = blockBetween(lines, "shared", ["translations", "sections"]);
  const sections = blockBetween(lines, "sections", []);

  if (shared.start === -1) {
    addError(report, group, 'Missing top-level "shared:" block.');
  }

  if (sections.start === -1) {
    addError(report, group, 'Missing top-level "sections:" block.');
    return 0;
  }

  const sectionChunks = splitBaseSections(sections.lines);
  if (sectionChunks.length === 0) {
    addError(report, group, 'The "sections:" block must contain at least one section.');
    return 0;
  }

  sectionChunks.forEach((chunk, index) => {
    const sectionNumber = index + 1;
    const flexDirection = validateRequiredBullet(report, group, chunk, "flexDirection", sectionNumber);
    validateRequiredBullet(report, group, chunk, "coverImage", sectionNumber);

    if (flexDirection && !VALID_FLEX_DIRECTIONS.has(flexDirection)) {
      addError(
        report,
        group,
        `Section ${sectionNumber} has invalid flexDirection "${flexDirection}". Expected "row" or "row-reverse".`
      );
    }

    const translationsIndex = chunk.findIndex((line) => line.trim() === "- translations:");
    if (translationsIndex === -1) {
      addError(report, group, `Section ${sectionNumber} is missing "- translations:".`);
    }

    const locale = bulletValue(chunk, "locale").value;
    if (!locale) {
      addError(report, group, `Section ${sectionNumber} is missing "- locale: en-us".`);
    } else if (locale !== "en-us") {
      addError(report, group, `Section ${sectionNumber} locale must be "en-us", found "${locale}".`);
    }

    validateRequiredBullet(report, group, chunk, "summary", sectionNumber);
    validateRequiredBullet(report, group, chunk, "modalContent", sectionNumber);
  });

  return sectionChunks.length;
}

function validatePatchMarkdown(filePath, markdown, expectedLocale, expectedSectionCount, report) {
  const group = displayPath(filePath);
  const shape = getShape(markdown, TRANSLATION_PATCH_HEADING);

  if (!shape) {
    addError(report, group, `Missing "${TRANSLATION_PATCH_HEADING}".`);
    return;
  }

  const lines = shape.split("\n");
  const looseSections = looseKeyIndex(lines, "sections");
  const sections = blockBetween(lines, "sections", []);
  const translation = blockBetween(lines, "translation", ["buttons", "sections"]);
  const locale = topLevelScalarValue(lines, "locale").value;

  if (!locale) {
    addError(report, group, `Missing top-level "locale: ${expectedLocale}".`);
  } else if (locale !== expectedLocale) {
    addError(report, group, `Locale must be "${expectedLocale}", found "${locale}".`);
  }

  if (translation.start === -1) {
    addError(report, group, 'Missing top-level "translation:" block.');
  } else if (!bulletValue(translation.lines, "subtitle").value) {
    addError(report, group, 'The "translation:" block is missing "- subtitle:".');
  }

  if (sections.start === -1) {
    if (looseSections !== -1) {
      addError(
        report,
        group,
        `"sections:" must be a top-level block. Found an indented "sections:" at ${lineNumber(lines, looseSections)}.`
      );
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
    validateRequiredBullet(report, group, chunk, "summary", sectionNumber);
    validateRequiredBullet(report, group, chunk, "modalContent", sectionNumber);
  });
}

function validateFileNames(args, report) {
  if (args.length !== 3) {
    addError(report, "CLI arguments", `Expected exactly 3 markdown files, received ${args.length}.`);
    return null;
  }

  const [basePath, esPath, ptPath] = args;
  const baseName = path.basename(basePath);
  const esName = path.basename(esPath);
  const ptName = path.basename(ptPath);
  const baseMatch = baseName.match(/^(.+)\.md$/);

  if (!baseMatch) {
    addError(report, "File names", `Base file must be named "Project.md", received "${baseName}".`);
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

  return { basePath, esPath, ptPath };
}

function printReport(report) {
  if (report.size === 0) {
    console.log("Project markdown validation passed.");
    return;
  }

  console.error("Project markdown validation failed:");
  for (const [group, errors] of report.entries()) {
    console.error(`\n${group}`);
    errors.forEach((error) => console.error(`  - ${error}`));
  }
}

function main() {
  const report = createReport();
  const files = validateFileNames(process.argv.slice(2), report);

  if (!files) {
    usage();
    printReport(report);
    process.exitCode = 1;
    return;
  }

  const baseMarkdown = readMarkdown(files.basePath, report);
  const esMarkdown = readMarkdown(files.esPath, report);
  const ptMarkdown = readMarkdown(files.ptPath, report);

  const baseSectionCount = baseMarkdown
    ? validateBaseMarkdown(files.basePath, baseMarkdown, report)
    : 0;

  if (esMarkdown) {
    validatePatchMarkdown(files.esPath, esMarkdown, "es-mx", baseSectionCount, report);
  }

  if (ptMarkdown) {
    validatePatchMarkdown(files.ptPath, ptMarkdown, "pt-br", baseSectionCount, report);
  }

  printReport(report);
  process.exitCode = report.size === 0 ? 0 : 1;
}

main();
