import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const old = execFileSync('git', ['show', '5bc19fc:ROADMAP_BRAINY.md'], { cwd: root, encoding: 'utf8' });
const destination = join(root, 'docs', 'tasks');
mkdirSync(destination, { recursive: true });
const lines = old.replace(/\r\n/g, '\n').split('\n');
const consumed = new Set();
const tasks = [];
let stage = 'A';
for (let i = 0; i < lines.length; i++) {
  const stageMatch = lines[i].match(/^### Étape ([A-Z]) /);
  if (stageMatch) stage = stageMatch[1];
  const match = lines[i].match(/^\*\*(T\d{2}) — ([^*]+)\*\* · (Dépendances? .+)$/);
  if (!match) continue;
  const block = [];
  for (let j = i; j < lines.length && lines[j].trim(); j++) {
    block.push(lines[j]);
    consumed.add(j);
  }
  const number = Number(match[1].slice(1));
  const status = number <= 19 ? 'traitée selon le suivi historique' : number === 20 ? 'implémentation présente, validation externe en attente' : number <= 25 ? 'parcours utilisable avec limites documentées' : 'prévue';
  const path = join(destination, `${match[1]}.md`);
  if (!existsSync(path)) writeFileSync(path, `Statut : ${status}\n\n${block.join('\n')}\n`, 'utf8');
  tasks.push({ id: match[1], title: match[2], dependencies: match[3], status, stage });
}
if (tasks.length !== 33 || new Set(tasks.map((item) => item.id)).size !== 33) throw new Error(`Expected 33 unique tasks, found ${tasks.length}`);

const sections = ['1', '3', '4', '6', '7'];
const sectionStarts = [...old.matchAll(/^## (\d+)\. /gm)].map((item) => ({ number: item[1], start: item.index }));
const principles = sections.map((number) => {
  const at = sectionStarts.findIndex((item) => item.number === number);
  if (at < 0) throw new Error(`Missing roadmap section ${number}`);
  const begin = sectionStarts[at].start;
  const end = sectionStarts[at + 1]?.start ?? old.length;
  return old.slice(begin, end).trimEnd();
});
const principlesPath = join(destination, '_PRINCIPES.md');
if (!existsSync(principlesPath)) writeFileSync(principlesPath, `# Principes communs des tâches\n\n${principles.join('\n\n')}\n`, 'utf8');

const archivePath = join(destination, '_HISTORIQUE.md');
if (!existsSync(archivePath)) writeFileSync(archivePath, `# Archive des lignes hors définitions de tâches\n\nTexte conservé mot pour mot depuis le commit \`5bc19fc\`. Les liens ci-dessous sont du texte historique et leurs chemins étaient relatifs à la racine.\n\n~~~~markdown\n${lines.filter((_, index) => !consumed.has(index)).join('\n').trim()}\n~~~~\n`, 'utf8');

const stageNames = new Map([...old.matchAll(/^### Étape ([A-Z]) — (.+)$/gm)].map((item) => [item[1], item[2]]));
const index = ['# Brainy — index des tâches', '', 'Lire les [principes communs](docs/tasks/_PRINCIPES.md) pour la méthode et la définition de fini. Les états détaillés et le texte historique restent dans [le suivi conservé](docs/tasks/_HISTORIQUE.md).', ''];
let currentStage;
for (const task of tasks) {
  if (task.stage !== currentStage) {
    if (currentStage) index.push('');
    currentStage = task.stage;
    index.push(`## Étape ${currentStage} — ${stageNames.get(currentStage)}`, '', '| Tâche | Titre | Dépendances | Statut | Lien |', '| --- | --- | --- | --- | --- |');
  }
  index.push(`| ${task.id} | ${task.title} | ${task.dependencies} | ${task.status} | [${task.id}](docs/tasks/${task.id}.md) |`);
}
index.push('');
const roadmapPath = join(root, 'ROADMAP_BRAINY.md');
if (readFileSync(roadmapPath, 'utf8').includes('**T01 —')) writeFileSync(roadmapPath, `${index.join('\n')}\n`, 'utf8');
console.log(`Roadmap split: ${tasks.length} tasks; index and principles ready.`);
