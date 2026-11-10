# Hébergement sur Vercel (plan gratuit Hobby)

Décision du 10 novembre 2026 : l’API NestJS et l’application web Next.js seront hébergées sur Vercel, plan gratuit. Limites vérifiées le même jour dans la [documentation Vercel](https://vercel.com/docs/functions/limitations) : 300 s au plus par requête, 4,5 Mo au plus par requête ou réponse, aucun processus permanent, tâches planifiées (cron) [une fois par jour au plus](https://vercel.com/docs/cron-jobs/usage-and-pricing), usage personnel et non commercial seulement.

## Modules gelés

Sur Vercel, la variable `VERCEL` est présente : l’API gèle alors quatre modules (`api/src/platform.ts`). Leur boucle de fond ne démarre pas, leurs actions sont refusées avec « paused on this hosting plan » et les clients web et Flutter masquent leurs boutons grâce à la requête `platformCapabilities`. Les données existantes restent lisibles.

| Module | Pourquoi il est gelé | Vérifié avant le gel |
| --- | --- | --- |
| Rappels (T20) | Boucle toutes les 15 s ; un cron Vercel gratuit ne passe qu’une fois par jour, à ±59 min. | `smoke:reminders` |
| Traitements en arrière-plan (T30) | Boucle toutes les secondes. | `background-job-smoke.mjs` |
| Sources de données (T32) | Boucle toutes les secondes. | `smoke:data-sources` |
| Gros fichiers (T44) | Morceaux de 6 Mio au-delà des 4,5 Mo ; stockage S3 et nettoyage périodique. | `smoke:large-files` (20 Mio) |

Les pièces jointes passent dans la requête en base64 (un tiers de plus) : sur Vercel, une entrée garde au plus 3 Mio de fichiers au lieu de 8, et un fichier reste limité à 2 Mio.

Pour dégeler un module, définir `BRAINY_FROZEN_MODULES` dans l’API avec la liste à garder gelée (`""` pour aucun) ; `BRAINY_MAX_ENTRY_ATTACHMENT_BYTES` règle la limite des pièces jointes. Un module dégelé sur Vercel ne fonctionnera pas pour autant tant que sa boucle n’a pas de processus pour tourner. La fumée `npm run smoke:platform-freeze` vérifie le gel contre une API lancée avec `VERCEL=1`.

## À prévoir pour la mise en ligne

- MongoDB : Vercel n’héberge pas MongoDB ; une offre gratuite externe (MongoDB Atlas M0, 512 Mo) convient.
- Sauvegardes et exports volumineux : une réponse dépassant 4,5 Mo échoue ; à surveiller sur un gros espace.
- La configuration de déploiement (projets Vercel, variables d’environnement) reste à préparer au moment de la mise en ligne.
