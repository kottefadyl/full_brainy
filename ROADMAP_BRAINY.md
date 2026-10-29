# Brainy — index des tâches

Lire les [principes communs](docs/tasks/_PRINCIPES.md) pour la méthode et la définition de fini. Les états détaillés et le texte historique restent dans [le suivi conservé](docs/tasks/_HISTORIQUE.md).

## Étape A — consolider le noyau existant

| Tâche | Titre | Dépendances | Statut | Lien |
| --- | --- | --- | --- | --- |
| T01 | Inventaire fonctionnel et jeu de parcours de référence | Dépendances : aucune. | traitée selon le suivi historique | [T01](docs/tasks/T01.md) |
| T02 | Socle UX, design et langues | Dépendances : T01. | traitée selon le suivi historique | [T02](docs/tasks/T02.md) |
| T03 | Contrats de données et stratégie d'évolution | Dépendances : T01. | traitée selon le suivi historique | [T03](docs/tasks/T03.md) |
| T04 | Modifier un format de données sans casser ses entrées | Dépendances : T03. | traitée selon le suivi historique | [T04](docs/tasks/T04.md) |
| T05 | Valeurs typées et champs utiles à de nombreux domaines | Dépendances : T03, T04. | traitée selon le suivi historique | [T05](docs/tasks/T05.md) |
| T06 | Retrouver beaucoup d'entrées | Dépendances : T03, T05. | traitée selon le suivi historique | [T06](docs/tasks/T06.md) |
| T07 | Exportation et importation fiables | Dépendances : T04–T06. | traitée selon le suivi historique | [T07](docs/tasks/T07.md) |

## Étape B — unités, objets et objets-variables locaux

| Tâche | Titre | Dépendances | Statut | Lien |
| --- | --- | --- | --- | --- |
| T08 | Catalogue d'unités par collection | Dépendances : T03, T05. | traitée selon le suivi historique | [T08](docs/tasks/T08.md) |
| T09 | Définition d'objets dans une collection | Dépendances : T04, T05, T08. | traitée selon le suivi historique | [T09](docs/tasks/T09.md) |
| T10 | Créer, consulter et modifier des objets | Dépendances : T09, T06. | traitée selon le suivi historique | [T10](docs/tasks/T10.md) |
| T11 | Références d'objet locales dans les entrées | Dépendances : T10, T05. | traitée selon le suivi historique | [T11](docs/tasks/T11.md) |
| T12 | Objets-variables locaux | Dépendances : T11. | traitée selon le suivi historique | [T12](docs/tasks/T12.md) |
| T13 | Valeurs actuelles, instantanés et historique | Dépendances : T10–T12. | traitée selon le suivi historique | [T13](docs/tasks/T13.md) |

## Étape C — transfert et partage explicites entre collections

| Tâche | Titre | Dépendances | Statut | Lien |
| --- | --- | --- | --- | --- |
| T14 | Copier objets et dépendances vers une autre collection | Dépendances : T08–T13. | traitée selon le suivi historique | [T14](docs/tasks/T14.md) |
| T15 | Partager un objet lié entre deux collections | Dépendances : T14. | traitée selon le suivi historique | [T15](docs/tasks/T15.md) |
| T16 | Déplacer un objet | Dépendances : T14, T15. | traitée selon le suivi historique | [T16](docs/tasks/T16.md) |
| T17 | Partager et migrer un format de données | Dépendances : T04, T08, T14. | traitée selon le suivi historique | [T17](docs/tasks/T17.md) |

## Étape D — vues, temps et rappels

| Tâche | Titre | Dépendances | Statut | Lien |
| --- | --- | --- | --- | --- |
| T18 | Vues sauvegardées d'une même collection | Dépendances : T06, T11. | traitée selon le suivi historique | [T18](docs/tasks/T18.md) |
| T19 | Agenda et emploi du temps | Dépendances : T05, T18. | traitée selon le suivi historique | [T19](docs/tasks/T19.md) |
| T20 | Rappels fiables | Dépendances : T19, T03. | implémentation présente, validation externe en attente | [T20](docs/tasks/T20.md) |

## Étape E — calculs, statistiques et graphiques

| Tâche | Titre | Dépendances | Statut | Lien |
| --- | --- | --- | --- | --- |
| T21 | Moteur de formules typées et sûr | Dépendances : T05, T08, T12, T13. | parcours utilisable avec limites documentées | [T21](docs/tasks/T21.md) |
| T22 | Agrégats et analyses commerciales/statistiques | Dépendances : T21, T06, T18. | parcours utilisable avec limites documentées | [T22](docs/tasks/T22.md) |
| T23 | Graphiques lisibles | Dépendances : T22. | terminée | [T23](docs/tasks/T23.md) |

Validation du 2026-10-25 : la fumée API T21–T23 passe, dont 10 005 entrées, deux pages distinctes de sources et le poids par produit avec son nom et son unité. T23 a été rejoué dans un navigateur et par tests de widgets Flutter à 320 et 1 000 px. Détails dans les fiches de tâche.

## Étape F — modèles concrets, sans types de collection rigides

| Tâche | Titre | Dépendances | Statut | Lien |
| --- | --- | --- | --- | --- |
| T24 | Modèles de départ et parcours progressif | Dépendances du socle : T02, T05. Extensions après leurs capacités : T19, T21–T23, T26 et T27. | terminée | [T24](docs/tasks/T24.md) |
| T25 | Écriture de livre et collecte de liens | Dépendances : T03, T05, T06, T18, T24. | terminée | [T25](docs/tasks/T25.md) |

Validation du 2026-10-25 : la fumée API couvre les modèles Livre et les liens entre entrées. T24 a été rejoué sur le web et Flutter, y compris la création manuelle. T25 passe pour les liens entre entrées, la recherche, l'export ciblé et l'ouverture/copie d'URL depuis Flutter. Détails dans les fiches de tâche.
| T26 | Boutique et mouvements de stock | Dépendances : T08–T13, T21–T24. | terminée le 2026-10-27 | [T26](docs/tasks/T26.md) |
| T27 | Mesures, recherche, tableaux de bord et prévisions de domaine | Dépendances : T08, T21–T24. | terminée le 2026-10-27 | [T27](docs/tasks/T27.md) |

Validation du 2026-10-27 : `docker compose exec -T api npm run smoke:stock-forecast` couvre T26 et T27 (aperçu, idempotence, transfert, retour, rapport sourcé, modèles de mesures et prévision distincte des faits). Détails dans les fiches T26 et T27.

## Étape G — organisation, gros volumes et exploitation (1.0)

| Tâche | Titre | Dépendances | Statut | Lien |
| --- | --- | --- | --- | --- |
| T28 | Droits, audit et collaboration | Dépendances : T15, T17, T03. | terminée le 2026-10-28 | [T28](docs/tasks/T28.md) |
| T29 | Sauvegarde, reprise et synchronisation | Dépendances : T07, T26–T28. | terminée le 2026-10-28 | [T29](docs/tasks/T29.md) |
| T30 | Chargement massif et traitements asynchrones | Dépendances : T06, T07, T22, T26–T28. | terminée le 2026-10-29 | [T30](docs/tasks/T30.md) |
| T31 | Mesures de charge et architecture adaptée | Dépendances : T30. | terminée le 2026-10-29 | [T31](docs/tasks/T31.md) |
| T32 | Connecteurs et données industrielles | Dépendances : T28–T31, T36 (A6). | prévue | [T32](docs/tasks/T32.md) |
| T33 | Mise en relation entre personnes (axe séparé) | Dépendances : T28 et décision produit sur consentement. | prévue | [T33](docs/tasks/T33.md) |

## Étapes H à M — Brainy 1.1 : primitives universelles et paquets de domaine

Lire la section 8 des [principes communs](docs/tasks/_PRINCIPES.md) pour les règles 11 à 18, les ajustements A1–A10 et la règle de modularité, ainsi que [l'épreuve des 50 domaines et les scénarios R1–R10](docs/ANNEXE_50_DOMAINES.md).

| Tâche | Titre | Dépendances | Statut | Lien |
| --- | --- | --- | --- | --- |
| T34 | Capture rapide et saisie rapide (Étape H) | Dépendances : T06, T24, T25. | terminée le 2026-10-27 | [T34](docs/tasks/T34.md) |
| T35 | Opérations d'analyse extensibles (Étape I) | Dépendances : T21, T22, T18. | terminée le 2026-10-27 | [T35](docs/tasks/T35.md) |
| T36 | Type de champ « mesure » (Étape I) | Dépendances : T04, T05, T08, T13, T35. | terminée le 2026-10-28 | [T36](docs/tasks/T36.md) |
| T37 | Relations généralisées (Étape J) | Dépendances : T11, T12, T13, T14, T21. | terminée le 2026-10-28 | [T37](docs/tasks/T37.md) |
| T38 | Géographie (Étape J) | Dépendances : T05, T18, T22. | terminée le 2026-10-29 | [T38](docs/tasks/T38.md) |
| T39 | Listes de codes et classifications (Étape J) | Dépendances : T04, T05, T17, T37. | terminée le 2026-10-29 | [T39](docs/tasks/T39.md) |
| T40 | Flux d'états et validations (Étape K) | Dépendances : T19, T20, T28. | terminée le 2026-10-29 | [T40](docs/tasks/T40.md) |
| T41 | Collecte par des tiers sans compte (Étape K) | Dépendances : T03, T04, T05, T28, T30. | terminée le 2026-10-29 | [T41](docs/tasks/T41.md) |
| T42 | Registre non modifiable (Étape L) | Dépendances : T26, T28, T29. | prévue | [T42](docs/tasks/T42.md) |
| T43 | Niveaux de sensibilité et seuils d'agrégat (Étape L) | Dépendances : T15, T22, T28. | prévue | [T43](docs/tasks/T43.md) |
| T44 | Données lourdes par référence (Étape M) | Dépendances : T07, T30, T31. | prévue | [T44](docs/tasks/T44.md) |
| T45 | Paquets de domaine partageables (Étape M) | Dépendances : T14, T17, T24, T35–T39. | prévue | [T45](docs/tasks/T45.md) |

## Ordre d'exécution fusionné recommandé (après T27)

Les dépendances de **T34, T35, T36, T37, T38, T39** et **T28** sont déjà terminées. Pour maximiser la valeur produit, réduire le coût en jetons IA et permettre à 2 IA de travailler sans conflit :

1. **Vague 1 — Usage quotidien & primitives de données (sans attendre T32/T33)** :
   - **T34 (Capture & saisie rapide)** : gain immédiat au quotidien (scénarios R1, R2) ; isoler l'UI dans des composants dédiés et alléger `workspace_screen.dart` au passage.
   - **T35 (Opérations d'analyse extensibles)** → **T36 (Champ « mesure »)** : cœur scientifique et statistique (scénarios R2, R5, R6, R9, R10).
   - **T37 (Relations généralisées)** → **T39 (Classifications)** et **T38 (Géographie)** : hiérarchies, recettes/nomenclatures et cartes (scénarios R4, R5, R8, R9).
2. **Vague 2 — Gouvernance, synchronisation, preuves et collecte** :
   - **T28 (Droits & audit)** → débloque **T29 (Sauvegarde & synchro hors ligne)**, **T40 (Flux d'états)**, **T42 (Registre non modifiable)** et **T43 (Sensibilité & seuils d'agrégat)**.
   - **T30 (Traitements asynchrones)** → **T41 (Collecte par des tiers)**, **T31 (Mesures de charge)** et **T44 (Données lourdes S3)**.
3. **Vague 3 — Assemblage et ouvertures finales** :
   - **T45 (Paquets de domaine partageables)**, puis **T32 (Connecteurs industriels appuyés sur T36)** et enfin **T33 (Mise en relation sur consentement)**.


