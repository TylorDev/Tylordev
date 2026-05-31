import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const GITHUB_USER = "TylorDev";
const GITHUB_REPOS_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`;
const WIKI_RAW_BASE = `https://raw.githubusercontent.com/wiki/${GITHUB_USER}`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_DIR = path.join(__dirname, "public", "Test");

if (!fs.existsSync(TEST_DIR)) {
  fs.mkdirSync(TEST_DIR, { recursive: true });
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Node.js' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        resolve(null);
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  console.log('Fetching repos...');
  const reposJson = await fetch(GITHUB_REPOS_URL);
  if (!reposJson) {
    console.error('Failed to fetch repos');
    return;
  }
  fs.writeFileSync(path.join(TEST_DIR, 'repos.json'), reposJson);

  const repos = JSON.parse(reposJson);
  for (const repo of repos) {
    if (!repo.name) continue;
    const name = repo.name;

    // Fetch base markdown
    const mdUrl = `${WIKI_RAW_BASE}/${name}/${encodeURIComponent(name)}.md`;
    const md = await fetch(mdUrl);
    if (md) {
      console.log(`Saved ${name}.md`);
      fs.writeFileSync(path.join(TEST_DIR, `${name}.md`), md);
    }

    // Fetch Spanish markdown
    const esUrl = `${WIKI_RAW_BASE}/${name}/${encodeURIComponent(name)}%E2%80%90es.md`;
    const esMd = await fetch(esUrl);
    if (esMd) {
      console.log(`Saved ${name}-es.md`);
      fs.writeFileSync(path.join(TEST_DIR, `${name}-es.md`), esMd);
    }

    // Fetch Portuguese markdown
    const ptUrl = `${WIKI_RAW_BASE}/${name}/${encodeURIComponent(name)}%E2%80%90pt.md`;
    const ptMd = await fetch(ptUrl);
    if (ptMd) {
      console.log(`Saved ${name}-pt.md`);
      fs.writeFileSync(path.join(TEST_DIR, `${name}-pt.md`), ptMd);
    }
  }

  // Fetch staticContent.ts bases
  const staticBases = [
    { url: `${WIKI_RAW_BASE}/Tylordev/Tylordev.md`, name: 'Tylordev.md' },
    { url: `${WIKI_RAW_BASE}/Tylordev/Tylordev%E2%80%90es.md`, name: 'Tylordev-es.md' },
    { url: `${WIKI_RAW_BASE}/Tylordev/Tylordev%E2%80%90pt.md`, name: 'Tylordev-pt.md' }
  ];

  for (const file of staticBases) {
    const md = await fetch(file.url);
    if (md) {
      console.log(`Saved ${file.name}`);
      fs.writeFileSync(path.join(TEST_DIR, file.name), md);
    }
  }

  console.log('Done!');
}

run().catch(console.error);
