# Hébergement sur Vercel (plan gratuit Hobby)

Décision du 10 novembre 2026 : l’API NestJS et l’application web Next.js sont hébergées sur Vercel, plan gratuit. Limites revérifiées le 12 novembre 2026 dans la documentation Vercel ([fonctions](https://vercel.com/docs/functions/limitations), [plan Hobby](https://vercel.com/docs/plans/hobby), [cron](https://vercel.com/docs/cron-jobs/usage-and-pricing), [NestJS](https://vercel.com/docs/frameworks/backend/nestjs)) : 300 s au plus par requête, 4,5 Mo au plus par requête ou réponse, 2 Go de mémoire, aucun processus permanent, système de fichiers en lecture seule, tâches planifiées une fois par jour au plus (à ±59 min), par mois 4 h de CPU actif, 1 million d’appels et 100 Go de transfert, **usage personnel et non commercial seulement**. NestJS et Next.js se déploient sans configuration.

## Modules gelés

Sur Vercel, la variable `VERCEL` est présente : l’API gèle alors des modules (`api/src/platform.ts`). Leur boucle de fond ne démarre pas, leurs actions sont refusées avec un message clair et les clients web et Flutter masquent leurs boutons grâce à la requête `platformCapabilities`. Les données existantes restent lisibles.

| Module | Pourquoi il est gelé | Vérifié |
| --- | --- | --- |
| Rappels (T20) | Boucle toutes les 15 s ; un cron Vercel gratuit ne passe qu’une fois par jour. **Dégelé automatiquement** quand `CRON_SECRET` (16 caractères ou plus) est défini : un planificateur externe gratuit appelle alors `GET /cron/reminders`. | `smoke:reminders` |
| Traitements en arrière-plan (T30) | Boucle toutes les secondes. | `background-job-smoke.mjs` |
| Sources de données (T32) | Boucle toutes les secondes. | `smoke:data-sources` |
| Gros fichiers (T44) | Morceaux de 6 Mio au-delà des 4,5 Mo ; stockage S3 payant hors Vercel et nettoyage périodique. | `smoke:large-files` |
| Images, vidéos, sons et PDF (`mediaFiles`) | Décision produit du 12 novembre 2026 : aucun média n’est enregistré dans la base (MongoDB Atlas gratuit : 512 Mo). Refusés : pièces jointes reconnues par leur type, leur nom **et leurs premiers octets** (`api/src/media-guard.ts`), nouvelle photo de profil, image des aperçus de liens (le texte reste), restauration d’une sauvegarde qui en contient. Les autres fichiers (texte, tableur, document) restent permis jusqu’à 2 Mio. | `smoke:platform-freeze` |

Les pièces jointes passent dans la requête en base64 (un tiers de plus) : sur Vercel, une entrée garde au plus 3 Mio de fichiers et un fichier 2 Mio. Le schéma GraphQL reste en mémoire sur Vercel (`autoSchemaFile: true`), le disque étant en lecture seule.

Pour changer la liste, définir `BRAINY_FROZEN_MODULES` (`""` pour aucun) — **à ne pas faire en production**, car toute liste remplace celle par défaut, y compris `mediaFiles`. La fumée `npm run smoke:platform-freeze` vérifie le gel contre une API lancée avec `VERCEL=1`.

## Mise en ligne : pousser sur GitHub suffit

Les dépôts sont séparés : `kottefadyl/api_brainy` (dossier `api/`) et `kottefadyl/brainy_web_next` (dossier `brainy_web_app/`). Chacun devient un projet Vercel qui se redéploie à chaque `git push` sur `main`. Les fichiers `vercel.json` fixent le cadre (`nestjs`, `nextjs`) et la région Paris (`cdg1`).

1. **Base de données** — créer un cluster gratuit **MongoDB Atlas M0**, de préférence AWS Paris (`eu-west-3`) près de la région Vercel. Créer un utilisateur, autoriser l’accès réseau `0.0.0.0/0` (Vercel n’a pas d’adresse fixe sur Hobby) et copier l’URI `mongodb+srv://…/brainy`.
2. **Projet API** — sur vercel.com : *Add New → Project*, importer `api_brainy`, laisser le cadre détecté (NestJS). Variables d’environnement :
   - `MONGODB_URI` : l’URI Atlas ;
   - `JWT_SECRET` : longue valeur aléatoire (ne jamais réutiliser celle du poste local) ;
   - `FIREBASE_PROJECT_ID` = `brainy-6d65c` et, pour les notifications, `FIREBASE_SERVICE_ACCOUNT_JSON` (contenu complet du fichier de clé) ;
   - `CRON_SECRET` : pour les rappels (voir `docs/notifications-setup.html`) ;
   - facultatif : `SMTP_*` pour les e-mails, `CORS_ORIGIN` seulement si un navigateur appelle l’API directement (le web passe par son propre serveur).
   Déployer, puis noter l’adresse, par exemple `https://api-brainy.vercel.app`.
3. **Projet web** — importer `brainy_web_next` (cadre Next.js). Variable : `GRAPHQL_API_URL` = adresse de l’API + `/graphql`. Facultatif : `NEXT_PUBLIC_FIREBASE_VAPID_KEY`. Déployer.
4. **Application Flutter** — construire avec les adresses de production : `flutter build apk --release --dart-define=API_URL=https://ADRESSE-API/graphql --dart-define=WEB_APP_URL=https://ADRESSE-WEB` (le second sert aux liens d’invitation des collaborateurs).
5. **Contrôle** — ouvrir le site, créer un compte, une collection et une entrée ; joindre une photo doit être refusé avec le message « Les images, vidéos, sons et fichiers PDF ne sont pas enregistrés sur cet hébergement ».

## À surveiller

- Sauvegardes et exports volumineux : une réponse de plus de 4,5 Mo échoue.
- Le planificateur des rappels chaque minute fait environ 43 000 appels par mois, dans les limites gratuites ; toutes les 5 minutes suffit si le CPU mensuel devient juste.
- Les migrations de démarrage (collaborateurs, liens conservés, anciens livres) relisent la base à chaque démarrage à froid : coût faible.
- Le plan Hobby interdit l’usage commercial : passer au plan Pro avant de vendre le service.
