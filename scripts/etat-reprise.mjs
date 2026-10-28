import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const journal = readFileSync(join(root, 'docs', 'REPRISE_CODEX.md'), 'utf8').replace(/\r\n/g, '\n').split('\n');
for (const key of ['Prochaine action :', 'Agent actif :', 'Tâche verrouillée :', 'Fichiers réservés :', 'Étape en cours :', 'Décisions en attente']) {
  const line = journal.find((item) => item.startsWith(key));
  if (line) console.log(line);
}
console.log('État des 4 dépôts Git :');
for (const repo of ['.', 'api', 'brainy_web_app', 'brainy']) {
  const cwd = join(root, repo);
  if (!existsSync(join(cwd, '.git'))) continue;
  const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
  const branch = git('branch', '--show-current') || 'HEAD';
  const last = git('log', '--oneline', '-1');
  const dirty = git('status', '--short').split('\n').filter(Boolean).length;
  console.log(`  [${repo}] ${branch} | modifiés: ${dirty} | ${last}`);
}
