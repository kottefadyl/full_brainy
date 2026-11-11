import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const documents = ['AGENTS.md', 'README.md', 'COLLECTIONS_DIRECTION.md', 'ROADMAP_BRAINY.md'].map((name) => join(root, name));
function collect(folder) {
  for (const item of readdirSync(folder, { withFileTypes: true })) {
    const path = join(folder, item.name);
    if (item.isDirectory()) collect(path);
    else if (item.name.endsWith('.md')) documents.push(path);
  }
}
collect(join(root, 'docs'));
const errors = [];
for (const document of documents) {
  let inFence = false;
  for (const [index, line] of readFileSync(document, 'utf8').replace(/\r\n/g, '\n').split('\n').entries()) {
    if (/^\s*(```|~~~~)/.test(line)) { inFence = !inFence; continue; }
    if (inFence) continue;
    for (const match of line.matchAll(/!?\[[^\]]*\]\((<[^>]+>|[^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const raw = match[1].replace(/^<|>$/g, '');
      if (/^(?:[a-z][a-z\d+.-]*:|#|\/)/i.test(raw)) continue;
      let target;
      try { target = decodeURIComponent(raw.split(/[?#]/, 1)[0]); }
      catch { errors.push(`${document}:${index + 1} invalid URL encoding: ${raw}`); continue; }
      const resolved = resolve(dirname(document), target);
      if (!existsSync(resolved) || !statSync(resolved).isFile()) errors.push(`${document}:${index + 1} missing: ${raw}`);
    }
  }
}
const index = readFileSync(join(root, 'ROADMAP_BRAINY.md'), 'utf8');
const taskIds = [...index.matchAll(/^\| (T\d{2}) \|/gm)].map((match) => match[1]);
// T48 (saved link previews) was added on 2026-11-11; raise this count with each new task row.
if (taskIds.length !== 48 || new Set(taskIds).size !== 48) errors.push(`Roadmap index has ${taskIds.length} task rows, expected 48 unique rows`);
for (const id of taskIds) {
  const path = join(root, 'docs', 'tasks', `${id}.md`);
  if (!existsSync(path)) { errors.push(`${id} has no task file`); continue; }
  const body = readFileSync(path, 'utf8');
  if (!body.startsWith('Statut :') || !body.includes(`**${id} —`) || !body.includes('- **Terminé quand :**')) errors.push(`${id} lacks status, title or done criterion`);
}
if (errors.length) {
  for (const error of errors) console.error(error);
  process.exitCode = 1;
} else console.log(`Documentation verified: ${documents.length} Markdown files, ${taskIds.length} linked tasks.`);
