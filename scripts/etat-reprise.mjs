import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const journal = readFileSync(join(root, 'docs', 'REPRISE_CODEX.md'), 'utf8').replace(/\r\n/g, '\n').split('\n');
const next = journal.find((line) => line.startsWith('Prochaine action :')) ?? 'Prochaine action : absente du journal';
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const status = git('status', '--short').split('\n').filter(Boolean);
console.log(next);
console.log(`Branche : ${git('branch', '--show-current')}`);
console.log('Derniers commits :');
for (const line of git('log', '--oneline', '-5').split('\n')) console.log(`  ${line}`);
console.log(`Fichiers non validés : ${status.length}`);
for (const line of status.slice(0, 7)) console.log(`  ${line}`);
if (status.length > 7) console.log(`  … ${status.length - 7} autres`);
for (const line of journal.filter((line) => /^(Étapes terminées|Étape en cours|Décisions en attente)/.test(line))) console.log(line);
