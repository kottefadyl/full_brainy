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

## Étape G — organisation, gros volumes et exploitation

| Tâche | Titre | Dépendances | Statut | Lien |
| --- | --- | --- | --- | --- |
| T28 | Droits, audit et collaboration | Dépendances : T15, T17, T03. | prévue | [T28](docs/tasks/T28.md) |
| T29 | Sauvegarde, reprise et synchronisation | Dépendances : T07, T26–T28. | prévue | [T29](docs/tasks/T29.md) |
| T30 | Chargement massif et traitements asynchrones | Dépendances : T06, T07, T22, T26–T28. | prévue | [T30](docs/tasks/T30.md) |
| T31 | Mesures de charge et architecture adaptée | Dépendances : T30. | prévue | [T31](docs/tasks/T31.md) |
| T32 | Connecteurs et données industrielles | Dépendances : T28–T31. | prévue | [T32](docs/tasks/T32.md) |
| T33 | Mise en relation entre personnes (axe séparé) | Dépendances : T28 et décision produit sur consentement. | prévue | [T33](docs/tasks/T33.md) |

