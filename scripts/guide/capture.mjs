// T51: captures the guide screenshots from the running web app (http://localhost:3001) with demo data,
// in French and English, into brainy_web_app/public/guide/<lang>/ and brainy/assets/guide/<lang>/.
// Needs Microsoft Edge and playwright-core: PLAYWRIGHT_CORE=<path to playwright-core> [GUIDE_LANGS=fr|en] node scripts/guide/capture.mjs [name…]
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const { chromium } = await import(process.env.PLAYWRIGHT_CORE ? pathToFileURL(join(process.env.PLAYWRIGHT_CORE, 'index.mjs')).href : 'playwright-core');
const only = new Set(process.argv.slice(2));
const base = process.env.WEB_URL ?? 'http://localhost:3001';
const browser = await chromium.launch({ executablePath: process.env.EDGE_PATH ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const day = (offset) => { const date = new Date(); date.setDate(date.getDate() + offset); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; };

for (const lang of (process.env.GUIDE_LANGS ?? 'fr,en').split(',')) {
  const fr = lang === 'fr';
  const T = (french, english) => (fr ? french : english);
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, locale: lang });
  const page = await context.newPage();
  await page.addInitScript(([language]) => { localStorage.setItem('brainy_language', language); localStorage.setItem('brainy_theme', 'light'); }, [lang]);
  await page.goto(base);
  const gql = (query, variables = {}) => page.evaluate(async ([query, variables]) => { const response = await fetch('/api/graphql', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ query, variables }) }); const body = await response.json(); if (body.errors) throw new Error(JSON.stringify(body.errors)); return body.data; }, [query, variables]);
  const email = `guide-shots-${lang}-${Date.now()}@example.test`;
  const name = T('Camille Martin', 'Sam Taylor');
  await gql('mutation($input:RegisterInput!){register(input:$input){token user{id}}}', { input: { name, email, password: 'temporary-test-password' } });
  await gql('mutation($input:ProfileInput!){updateProfile(input:$input){id}}', { input: { name, profession: '', job: '', fieldOfStudy: '', interests: [T('Cuisine', 'Cooking')], hobbies: [] } });
  await gql('mutation($input:LoginInput!){login(input:$input){token user{id}}}', { input: { email, password: 'temporary-test-password' } });
  await gql('mutation{setOnboardingCompleted(completed:true){id}}');
  const entry = (collectionId, formatId, values) => gql('mutation($id:String!,$input:SaveEntryInput!){createEntry(collectionId:$id,input:$input){id}}', { id: collectionId, input: { formatId, values } });

  // Demo data
  const home = (await gql('mutation($input:CreateCollectionInput!){createCollection(input:$input){id formats{id name fields{id kind}}}}', { input: { name: T('Maison', 'Home'), formats: [
    { name: T('Dépense', 'Expense'), color: '#FFF0F4', fields: [{ name: T('Titre', 'Title'), kind: 'TITLE' }, { name: T('Montant', 'Amount'), kind: 'NUMBER', unit: fr ? 'XAF' : 'EUR' }, { name: T('Catégorie', 'Category'), kind: 'SELECT', options: fr ? ['Courses', 'Maison', 'Transport', 'Loisirs'] : ['Groceries', 'Home', 'Transport', 'Leisure'] }, { name: 'Date', kind: 'DATE' }, { name: T('Payé', 'Paid'), kind: 'BOOLEAN' }] },
    { name: T('Note', 'Note'), color: '#EEF5FF', fields: [{ name: T('Titre', 'Title'), kind: 'TITLE' }, { name: T('Texte', 'Text'), kind: 'LONG_TEXT' }] },
  ] } })).createCollection;
  const [expense, note] = home.formats;
  const field = (format, kind) => format.fields.find((item) => item.kind === kind).id;
  const categories = fr ? ['Courses', 'Maison', 'Transport', 'Loisirs'] : ['Groceries', 'Home', 'Transport', 'Leisure'];
  const expenses = fr
    ? [['Pain et lait', 1500], ['Électricité', 12000], ['Taxi', 2500], ['Cinéma', 4000], ['Marché', 8500], ['Eau', 6000], ['Bus', 800], ['Livres', 7000], ['Riz', 9000], ['Essence', 15000]]
    : [['Bread and milk', 4.5], ['Electricity', 48], ['Taxi', 12], ['Cinema', 18], ['Market', 32], ['Water', 21], ['Bus', 2.5], ['Books', 25], ['Rice', 9], ['Fuel', 60]];
  const expenseIds = [];
  for (const [index, [title, amount]] of expenses.entries()) {
    expenseIds.push((await entry(home.id, expense.id, [{ fieldId: field(expense, 'TITLE'), value: title }, { fieldId: field(expense, 'NUMBER'), value: String(amount) }, { fieldId: field(expense, 'SELECT'), value: categories[index % 4] }, { fieldId: field(expense, 'DATE'), value: day(-index * 6) }, { fieldId: field(expense, 'BOOLEAN'), value: index % 3 ? 'true' : 'false' }])).createEntry.id);
  }
  await entry(home.id, note.id, [{ fieldId: field(note, 'TITLE'), value: T('Idées de menus', 'Menu ideas') }, { fieldId: field(note, 'LONG_TEXT'), value: T('Lundi : soupe. Mardi : riz sauce arachide.', 'Monday: soup. Tuesday: rice and peanut stew.') }]);
  await gql('mutation($id:String!,$input:SavedCollectionViewInput!){saveCollectionView(collectionId:$id,input:$input){id}}', { id: home.id, input: { name: T('Tableau des dépenses', 'Expense table'), layout: 'TABLE', formatIds: [expense.id], columnFieldIds: expense.fields.map((item) => item.id), sort: 'NEWEST', groupByFormat: false } });

  const tasks = (await gql(`mutation{createCollectionFromTemplate(templateId:"tasks",name:${JSON.stringify(T('Planning maison', 'Home planner'))},language:"${lang}"){id taskPlanner{formatId startFieldId endFieldId repeatFieldId intervalFieldId weekdaysFieldId} formats{id fields{id kind}}}}`)).createCollectionFromTemplate;
  const p = tasks.taskPlanner;
  const taskTitle = tasks.formats[0].fields.find((item) => item.kind === 'TITLE').id;
  const taskList = [
    [T('Arroser les plantes', 'Water the plants'), { [p.startFieldId]: day(-12), [p.repeatFieldId]: T('Chaque jour', 'Every day') }],
    [T('Faire 20 minutes de sport', 'Exercise for 20 minutes'), { [p.startFieldId]: day(-12), [p.repeatFieldId]: T('Certains jours de la semaine', 'Some weekdays'), [p.weekdaysFieldId]: JSON.stringify(fr ? ['Lundi', 'Mercredi', 'Vendredi'] : ['Monday', 'Wednesday', 'Friday']) }],
    [T('Changer la litière', 'Clean the litter box'), { [p.startFieldId]: day(-9), [p.repeatFieldId]: T('Tous les N jours', 'Every N days'), [p.intervalFieldId]: '3' }],
    [T('Peindre la clôture', 'Paint the fence'), { [p.startFieldId]: day(-1), [p.endFieldId]: day(3), [p.repeatFieldId]: T('Une seule fois', 'Once') }],
    [T('Rendre le livre', 'Return the library book'), { [p.endFieldId]: day(-2) }],
    [T('Payer le loyer', 'Pay the rent'), { [p.startFieldId]: `${day(0).slice(0, 7)}-05`, [p.repeatFieldId]: T('Chaque mois', 'Every month') }],
  ];
  const taskIds = [];
  for (const [title, extra] of taskList) taskIds.push((await entry(tasks.id, p.formatId, [{ fieldId: taskTitle, value: title }, ...Object.entries(extra).map(([fieldId, value]) => ({ fieldId, value }))])).createEntry.id);
  const tz = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
  for (let offset = -10; offset <= 0; offset++) {
    for (const id of taskIds.slice(0, 3)) {
      if (offset === 0 && id !== taskIds[0]) continue;
      if ((offset + id.length) % 5 === 0) continue;
      await gql('mutation($id:String!,$e:String!,$d:String!,$tz:String!){setTaskDayDone(collectionId:$id,entryId:$e,date:$d,done:true,timeZone:$tz){id}}', { id: tasks.id, e: id, d: day(offset), tz }).catch(() => undefined);
    }
  }

  const links = (await gql(`mutation{createCollectionFromTemplate(templateId:"links",name:${JSON.stringify(T('Liens conservés', 'Saved links'))},language:"${lang}"){id formats{id fields{id kind}}}}`)).createCollectionFromTemplate;
  const linkFormat = links.formats[0];
  for (const [title, url] of [[T('Seth Godin', 'Seth Godin'), 'https://youtube.com/shorts/fWB9blq0H34'], ['GitHub', 'https://github.com/'], [T('Exemple', 'Example'), 'https://example.com/']]) {
    await entry(links.id, linkFormat.id, [{ fieldId: field(linkFormat, 'TITLE'), value: title }, { fieldId: field(linkFormat, 'LINK'), value: url }]);
  }

  const book = (await gql(`mutation{createCollectionFromTemplate(templateId:"book",name:${JSON.stringify(T('Le Jardin des heures', 'The Garden of Hours'))},language:"${lang}"){id formats{id fields{id kind}} bookView{roles{formatId role}}}}`)).createCollectionFromTemplate;
  const role = (name) => book.formats.find((format) => format.id === book.bookView.roles.find((item) => item.role === name).formatId);
  const bookField = (name, kind, index = 0) => role(name).fields.filter((item) => item.kind === kind)[index].id;
  await entry(book.id, role('COVER').id, [{ fieldId: bookField('COVER', 'TITLE'), value: T('Le Jardin des heures', 'The Garden of Hours') }, { fieldId: bookField('COVER', 'TEXT', 1), value: name }]);
  const chapter = (await entry(book.id, role('CHAPTER').id, [{ fieldId: bookField('CHAPTER', 'TITLE'), value: T('Le retour', 'Coming back') }, { fieldId: bookField('CHAPTER', 'NUMBER'), value: '1' }, { fieldId: bookField('CHAPTER', 'LONG_TEXT'), value: T('Le matin, la maison dormait encore. **Élise** ouvrit la fenêtre et laissa entrer *l’odeur des tilleuls*.\n\nElle descendit au jardin. Rien n’avait changé, et pourtant tout semblait plus petit.\n\n> Il faut cultiver notre jardin.', 'In the morning the house was still asleep. **Elise** opened the window and let in *the smell of the lime trees*.\n\nShe went down to the garden. Nothing had changed, and yet everything looked smaller.\n\n> We must cultivate our garden.') }])).createEntry.id;
  void chapter;

  // Collaborator (T52, T53): a second person accepts the personal link, then writes in the shared Home collection.
  const partnerContext = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, locale: lang });
  const partner = await partnerContext.newPage();
  await partner.addInitScript(([language]) => { localStorage.setItem('brainy_language', language); localStorage.setItem('brainy_theme', 'light'); }, [lang]);
  await partner.goto(base);
  const partnerGql = (query, variables = {}) => partner.evaluate(async ([query, variables]) => { const response = await fetch('/api/graphql', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ query, variables }) }); const body = await response.json(); if (body.errors) throw new Error(JSON.stringify(body.errors)); return body.data; }, [query, variables]);
  const partnerEmail = `guide-shots-partner-${lang}-${Date.now()}@example.test`;
  const partnerId = (await partnerGql('mutation($input:RegisterInput!){register(input:$input){token user{id}}}', { input: { name: T('Awa Diallo', 'Alex Morgan'), email: partnerEmail, password: 'temporary-test-password' } })).register.user.id;
  await partnerGql('mutation($input:ProfileInput!){updateProfile(input:$input){id}}', { input: { name: T('Awa Diallo', 'Alex Morgan'), profession: '', job: '', fieldOfStudy: '', interests: [T('Voyages', 'Travel')], hobbies: [] } });
  await partnerGql('mutation($input:LoginInput!){login(input:$input){token user{id}}}', { input: { email: partnerEmail, password: 'temporary-test-password' } });
  await partnerGql('mutation{setOnboardingCompleted(completed:true){id}}');
  const { collaborationInviteToken: inviteToken } = await gql('query{collaborationInviteToken}');
  await partnerGql('mutation($t:String!){acceptCollaboration(token:$t){userId}}', { t: inviteToken });
  await gql('mutation($c:String!,$u:String,$r:CollectionRole!){addCollectionMember(collectionId:$c,memberUserId:$u,role:$r){id}}', { c: home.id, u: partnerId, r: 'EDITOR' });
  await partnerGql('mutation($id:String!,$input:SaveEntryInput!){createEntry(collectionId:$id,input:$input){id}}', { id: home.id, input: { formatId: expense.id, values: [{ fieldId: field(expense, 'TITLE'), value: T('Gaz de cuisine', 'Cooking gas') }, { fieldId: field(expense, 'NUMBER'), value: fr ? '6500' : '27' }, { fieldId: field(expense, 'SELECT'), value: categories[1] }, { fieldId: field(expense, 'DATE'), value: day(0) }] } });
  await partnerGql('mutation($id:String!,$input:SaveEntryInput!){updateEntry(id:$id,input:$input){id}}', { id: expenseIds[0], input: { values: [{ fieldId: field(expense, 'TITLE'), value: expenses[0][0] }, { fieldId: field(expense, 'NUMBER'), value: String(expenses[0][1]) }, { fieldId: field(expense, 'SELECT'), value: categories[0] }, { fieldId: field(expense, 'DATE'), value: day(0) }, { fieldId: field(expense, 'BOOLEAN'), value: 'true' }] } });

  // Screenshots
  const shots = [];
  const save = async (name, target) => {
    if (only.size && !only.has(name)) return;
    const web = join(root, 'brainy_web_app', 'public', 'guide', lang), app = join(root, 'brainy', 'assets', 'guide', lang);
    mkdirSync(web, { recursive: true }); mkdirSync(app, { recursive: true });
    await (target ?? page).screenshot({ path: join(web, `${name}.jpg`), type: 'jpeg', quality: 72 });
    copyFileSync(join(web, `${name}.jpg`), join(app, `${name}.jpg`));
    shots.push(name);
  };
  const open = async (collectionName) => { await page.getByRole('button', { name: collectionName, exact: true }).first().click(); await page.waitForTimeout(1500); };
  const closeDialog = async () => { await page.keyboard.press('Escape'); await page.waitForTimeout(400); };
  const viewSelect = () => page.locator('.saved-view-bar select');
  await page.reload();
  await page.waitForTimeout(2500);

  await open(T('Maison', 'Home'));
  await save('collection');
  await page.getByRole('button', { name: T('Saisie rapide', 'Quick entry') }).click();
  await page.waitForTimeout(800);
  await save('quick-entry');
  await closeDialog();
  await page.getByRole('button', { name: T('Nouvelle entrée', 'New entry') }).first().click();
  await page.waitForTimeout(800);
  await save('entry-form', page.locator('.modal').first());
  await closeDialog();
  await page.getByRole('tab', { name: T('Formats de données', 'Data formats') }).click();
  await page.waitForTimeout(800);
  await save('formats');
  await page.locator('.format-card').first().locator('.format-menu-trigger').click();
  await page.locator('.format-card-menu:popover-open').getByRole('button', { name: T('Modifier le format de données', 'Edit data format') }).click();
  await page.waitForTimeout(900);
  await save('format-editor', page.locator('.modal').first());
  await closeDialog();
  await page.getByRole('tab', { name: T('Outils', 'Tools') }).click();
  await page.waitForTimeout(800);
  const toolsToggle = page.locator('.collection-tools-toggle');
  if (await toolsToggle.count() && (await toolsToggle.getAttribute('aria-expanded')) !== 'true') { await toolsToggle.click(); await page.waitForTimeout(600); }
  await save('tools');
  await page.locator('[data-tool="sensitivity"]').click();
  await page.waitForTimeout(1200);
  await save('privacy');
  await closeDialog();
  if (await page.locator('.modal-backdrop').count()) await page.locator('.modal-backdrop button[aria-label*="Fermer"], .modal-backdrop button[aria-label*="Close"]').first().click().catch(() => undefined);
  await open(T('Maison', 'Home'));
  await page.getByRole('tab', { name: T('Entrées', 'Entries') }).click().catch(() => undefined);
  await viewSelect().selectOption({ label: T('Tableau des dépenses', 'Expense table') });
  await page.waitForTimeout(1200);
  await page.getByText(T('Mode tableur', 'Spreadsheet mode')).first().click().catch(() => undefined);
  await page.waitForTimeout(800);
  await page.locator('.saved-view-bar').scrollIntoViewIfNeeded();
  await save('table');
  await page.getByRole('button', { name: T('Calculs', 'Insights') }).first().click();
  await page.waitForTimeout(1500);
  await save('insights');
  await page.goto(base);
  await page.waitForTimeout(2000);

  await page.getByRole('button', { name: T('Nouvelle collection', 'New collection') }).first().click();
  await page.waitForTimeout(1000);
  await save('templates', page.locator('.modal').first());
  await closeDialog();

  await open(T('Planning maison', 'Home planner'));
  await viewSelect().selectOption({ label: T('Tâches du jour', 'Tasks by day') });
  await page.waitForTimeout(1800);
  await page.locator('.task-agenda').scrollIntoViewIfNeeded();
  await save('tasks-day', page.locator('.task-agenda'));
  await viewSelect().selectOption({ label: T('Calendrier des tâches', 'Task calendar') });
  await page.waitForTimeout(2000);
  await save('tasks-calendar', page.locator('.task-agenda'));

  await open(T('Liens conservés', 'Saved links'));
  await page.waitForTimeout(5000);
  await page.locator('.entry-grid').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);
  await save('links', page.locator('.entry-grid').first());

  await open(T('Le Jardin des heures', 'The Garden of Hours'));
  await page.getByRole('button', { name: T('Ouvrir le livre', 'Open the book') }).click();
  await page.waitForTimeout(2000);
  await page.locator('.book-chapter').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await save('book');

  await page.goto(base);
  await page.waitForTimeout(2000);
  await page.locator('.sidebar-more summary').click();
  await page.getByRole('button', { name: T('Collaborateurs', 'Collaborators') }).first().click();
  await page.waitForTimeout(1500);
  await save('collaborators');
  await page.locator('.collab-page .analysis-back').click();
  await open(T('Maison', 'Home'));
  await page.getByRole('button', { name: T('Partager', 'Share'), exact: true }).first().click();
  await page.waitForTimeout(1200);
  await save('share', page.locator('.modal').first());
  await closeDialog();
  await partner.reload();
  await partner.waitForTimeout(2500);
  await partner.getByRole('button', { name: new RegExp(`^${T('Maison', 'Home')} · `) }).first().click();
  await partner.waitForTimeout(2000);
  await save('shared-collection', partner);
  await partnerContext.close();
  console.log(lang, shots.join(', '));
  await context.close();
}
await browser.close();
