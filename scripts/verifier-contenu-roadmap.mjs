import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const report = readFileSync(join(root, 'docs', 'OPTIMISATION_CODEX.md'), 'utf8');
const commit = report.match(/Commit de référence\s*:\s*`([0-9a-f]+)`/)?.[1];
if (!commit) throw new Error('Missing baseline commit in docs/OPTIMISATION_CODEX.md');
const original = execFileSync('git', ['show', `${commit}:ROADMAP_BRAINY.md`], { cwd: root, encoding: 'utf8' });
const taskDirectory = join(root, 'docs', 'tasks');
const files = [join(root, 'ROADMAP_BRAINY.md'), ...readdirSync(taskDirectory).filter((name) => name.endsWith('.md')).map((name) => join(taskDirectory, name))];
const currentLines = new Set(files.flatMap((path) => readFileSync(path, 'utf8').replace(/\r\n/g, '\n').split('\n')).filter((line) => line.trim()));
const missing = [...new Set(original.replace(/\r\n/g, '\n').split('\n').filter((line) => line.trim()))].filter((line) => !currentLines.has(line));
if (missing.length) {
  console.error(`${missing.length} roadmap lines are missing (first 20):`);
  for (const line of missing.slice(0, 20)) console.error(`- ${line}`);
  process.exitCode = 1;
} else console.log('Roadmap content verified: no nonempty baseline line is missing.');
