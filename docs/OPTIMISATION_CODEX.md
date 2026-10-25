# Optimisation documentaire de Codex sur Brainy

Commit de référence : `5bc19fc` (`main`, avant la branche `chore/optimisation-codex`). Ce commit conserve le texte d'origine des documents. Les trois applications sont des dépôts Git distincts et ne font pas partie du commit racine.

## Tailles avant

Mesure : octets du fichier et lignes séparées par `LF`, y compris la dernière ligne vide éventuelle. `ROADMAP_BRAINY_1_1.md` n'existe pas.

| Fichier | Octets | Lignes |
| --- | ---: | ---: |
| `AGENTS.md` | 10 463 | 55 |
| `README.md` | 8 474 | 68 |
| `COLLECTIONS_DIRECTION.md` | 15 996 | 119 |
| `ROADMAP_BRAINY.md` | 49 865 | 274 |
| `docs/reference-fixtures.json` | 1 472 | 8 |
| `docs/T01_INVENTAIRE.md` | 4 069 | 41 |
| `docs/T01_T10_PHILOSOPHIE_AUDIT.md` | 3 730 | 25 |
| `docs/T02_UX_LANGUES.md` | 2 851 | 27 |
| `docs/T03_CONTRAT_DONNEES.md` | 6 907 | 62 |
| `docs/T20_RAPPELS.md` | 4 293 | 21 |

Le journal `docs/REPRISE_CODEX.md` a été créé à l'étape 0 (695 octets, 13 lignes) et n'appartient pas à l'état de référence.

## Redondances observées

- `AGENTS.md` et `README.md` répètent l'objectif, l'architecture, le profil et les règles de collection, format de données et entrée. Garder les règles métier dans `AGENTS.md` et l'installation et l'utilisation dans `README.md`.
- La section « État des idées futures » d'`AGENTS.md` reprend la philosophie détaillée dans `COLLECTIONS_DIRECTION.md`. Garder dans le guide un résumé de l'état livré, la règle de propriété locale des objets et un lien.
- `ROADMAP_BRAINY.md` mêle principes généraux, descriptions des tâches, journal d'avancement et portes de livraison. Distribuer ces textes sans supprimer les lignes de la version de référence.
- Les documents `docs/T01_INVENTAIRE.md`, `docs/T02_UX_LANGUES.md` et `docs/T03_CONTRAT_DONNEES.md` détaillent des tâches que la roadmap résume. Conserver ces contrats comme références et pointer vers eux depuis les tâches.

## Tailles après

À mesurer à l'étape 8.

## Contradictions et décisions

À compléter au contrôle final, sans modifier les règles métier.

## Réglages Codex confirmés le 25 octobre 2026

La [référence officielle de configuration](https://learn.chatgpt.com/docs/config-file/config-reference) confirme que `.codex/config.toml` peut contenir des réglages propres à un projet **de confiance**. Elle documente `model_reasoning_effort`, `model_auto_compact_token_limit` (seuil absolu en jetons), `agents.max_concurrent_threads_per_session` et `project_doc_max_bytes`. Les [règles de priorité](https://learn.chatgpt.com/docs/config-file/config-basic) placent les options du projet sous les options passées explicitement à la session.

Proposition à valider par le propriétaire, **non appliquée** : dans `.codex/config.toml`, utiliser `model_reasoning_effort = "medium"` et `[agents] max_concurrent_threads_per_session = 1` ou `2` si plusieurs agents sont utiles. Pour viser un compactage vers 60–70 % de la fenêtre, calculer d'abord le nombre de jetons du modèle réellement utilisé puis définir `model_auto_compact_token_limit` avec cette valeur absolue ; ne pas supposer une taille de contexte universelle. Garder les exclusions de fichiers générés dans `.gitignore` et dans les recherches ciblées ; aucun réglage Codex de « fichiers ignorés » n'a été confirmé pour cet usage.

Aucun modèle, seuil de compactage ni réglage global de Codex n'a été changé. Le choix par tâche entre raisonnement bas, moyen et élevé reste une consigne de travail dans `AGENTS.md`, car un défaut de projet unique ne varie pas automatiquement selon le type de tâche.
