# Épreuve des 50 domaines et scénarios de référence 1.1

Ce document archive les estimations qualitatives des 50 domaines et les scénarios de référence R1 à R10 de Brainy 1.1 pour ne pas alourdir les fichiers lus à chaque session IA. Lire [ROADMAP_BRAINY.md](../ROADMAP_BRAINY.md) pour l'index des tâches et [les principes communs](tasks/_PRINCIPES.md) pour les règles 1 à 18.

## Scénarios de référence 1.1

Chaque scénario devient un jeu de données dans `docs/reference-fixtures-1-1.json` (à créer lors de sa première tâche) et un parcours manuel sur l'API, Next.js et Flutter, en anglais et en français, sans modifier les données d'un utilisateur réel.

| Id | Scénario | Ce qu'il prouve | Tâches |
| --- | --- | --- | --- |
| R1 | **Liens avec contexte** : partager un lien depuis un navigateur, ajouter une note, le retrouver un mois plus tard avec sa date. | Capture rapide, recherche, dédoublonnage. | T34, T25 |
| R2 | **Ventes d'eau quotidiennes** : saisir une vente en deux gestes ; totaux par jour, mois, année ; plages de 5 jours, 4 mois et 3 ans ; graphique. | Saisie rapide, agrégats, graphiques. | T34, T35, T23 |
| R3 | **Plan d'action de réunion** : tâches assignées à des personnes avec échéances et rappels. | Flux d'états, comptes, rappels. | T40, T20 |
| R4 | **Boutique** : produits, entrées et sorties de stock, ventes, finances simples, correction d'une erreur. | Objets, relations, registre, stock expliqué. | T26, T37, T42 |
| R5 | **Météo locale** : mesures horodatées d'une station, avec instrument, statut et moyennes par jour. | Type mesure, opérations d'analyse, géographie. | T36, T35, T38 |
| R6 | **Expériences de laboratoire** : échantillons, valeurs ± incertitude, fichiers volumineux. | Mesure, objets, données lourdes. | T36, T37, T44 |
| R7 | **Pharmacie (sans prétention réglementaire)** : stock par lot, dates de péremption, registre des mouvements, champs sensibles. | Registre, confidentialité, lots. | T26, T42, T43 |
| R8 | **Enquête de terrain** : formulaire public, quarantaine, classifications, positions, seuil d'agrégat. | Collecte tierce, codes, géographie, confidentialité. | T41, T39, T38, T43 |
| R9 | **Démographie hiérarchique** : populations par région et par ville, taux pour 1 000, classification à trois niveaux. | Hiérarchies, codes, taux. | T37, T39, T35 |
| R10 | **Consommation d'énergie du foyer** : relevés de compteur, consommation par mois, tendance. | Opérations sur séquences. | T35 |

## Origine : synthèse des manques sur 50 domaines

Le prototype 1.0 couvre environ **66 %** des besoins essentiels sur 50 domaines (ces pourcentages sont des estimations qualitatives de priorisation et ne doivent jamais apparaître dans l'application). La projection après T35, T36, T37, T38 et T41 atteint environ **76 %** (niveau 1 : 96 %, niveau 2 : 92 %, niveau 3 : 78 %, niveau 4 : 72 %, niveau 5 : 40 %).

| Manque | Domaines touchés | Tâches 1.1 |
| --- | --- | --- |
| Capture et saisie trop lentes pour l'usage quotidien | Liens, ventes, habitudes | T34 |
| Analyse limitée à somme, compte, moyenne, min, max | Mesures, statistiques, énergie, sport | T35 |
| Mesure traitée comme un simple nombre (pas d'incertitude, de qualité, de révision) | Météo, laboratoire, environnement, indicateurs | T36 |
| Relations limitées aux références simples (pas de hiérarchie ni de composition) | Recettes, nomenclatures, géographie administrative, école | T37 |
| Aucune dimension géographique | Agriculture, logistique, environnement, épidémiologie, SIG | T38 |
| Pas de vocabulaires contrôlés ni de classifications | Démographie, santé, migrations, statistiques | T39 |
| Pas de flux d'états, d'assignation à des comptes | Tâches, projets, locatif, ONG | T40 |
| Collecte uniquement par le propriétaire du compte | Enquêtes, terrain, capteurs | T41 |
| Pas de preuve ni d'audit | Pharmacie, comptabilité simple, traçabilité | T42 |
| Pas de contrôle fin de la confidentialité | Santé, migrations, positions | T43 |
| Pièces jointes limitées à 2 MiB | Laboratoire, génomique, imagerie | T44 |
| Chaque domaine à construire à la main | Tous | T45 |

### Niveau 1 : saisie simple (moyenne 92 %)

| # | Domaine | 1.0 | Principal manque | Tâche 1.1 |
| --- | --- | --- | --- | --- |
| 1 | Bloc-notes, journal | 95 | Texte enrichi, rétroliens | — |
| 2 | Liens et signets | 95 | Capture rapide, dédoublonnage | T34 |
| 3 | Liste de courses | 95 | Vue à cocher, saisie rapide | T34 |
| 4 | Recettes | 92 | Mise à l'échelle des quantités | T37 |
| 5 | Collections (livres, films) | 95 | Vue galerie | — |
| 6 | Contacts | 90 | Types téléphone et e-mail, doublons | — |
| 7 | Liste de lecture, veille | 95 | États, rappels | T40 |
| 8 | Suivi d'habitudes | 90 | Séries de jours | T35 |
| 9 | Écriture d'un livre | 90 | Ordre manuel, liens entre notes | T37 |
| 10 | Journal de voyage | 85 | Carte, position | T38 |

### Niveau 2 : entrées datées et totaux (moyenne 87 %)

| # | Domaine | 1.0 | Principal manque | Tâche 1.1 |
| --- | --- | --- | --- | --- |
| 11 | Ventes quotidiennes d'un petit commerce | 95 | Saisie rapide, totaux par période | T34, T35 |
| 12 | Budget personnel | 90 | Agrégats par catégorie | T35, T39 |
| 13 | Plans d'action de réunion | 85 | Assignation à de vrais comptes | T40 |
| 14 | Agenda | 80 | Récurrence, calendriers externes | — |
| 15 | Suivi sportif | 90 | Tendances | T35 |
| 16 | Consommation d'énergie ou d'eau | 85 | Différence entre relevés successifs | T35 |
| 17 | Poids, santé personnelle | 90 | Tendances, confidentialité par champ | T35, T43 |
| 18 | Suivi de projet | 80 | Vue Kanban, dépendances | T37, T40 |
| 19 | Notes d'élèves | 85 | Moyennes pondérées, élèves comme objets | T35, T37 |
| 20 | Potager, élevage | 85 | Cycles, rappels saisonniers | T40 |

### Niveau 3 : objets, stocks, métiers (moyenne 68 %)

| # | Domaine | 1.0 | Principal manque | Tâche 1.1 |
| --- | --- | --- | --- | --- |
| 21 | Boutique : stock et finances | 80 | Mouvements prouvables | T42 |
| 22 | Pharmacie (stock, ventes) | 55 | Lots, péremption, registres, audit | T42, T43 |
| 23 | Restaurant | 65 | Recette composée d'ingrédients, coûts | T37 |
| 24 | Inventaire de matériel | 90 | Maintenance, assignation | T40 |
| 25 | Gestion locative | 75 | Baux, paiements récurrents, quittances | T40 |
| 26 | Gestion scolaire | 55 | Relations multiples, rôles | T37, T40 |
| 27 | Exploitation agricole | 75 | Parcelles, intrants, cartographie | T37, T38 |
| 28 | Production (nomenclatures) | 60 | Composition multi-niveaux, ordres de fabrication | T37, T40 |
| 29 | Logistique, tournées | 50 | Géolocalisation, états en temps réel | T38, T40 |
| 30 | Association, ONG | 75 | Membres, cotisations, reçus, rôles | T39, T40 |

### Niveau 4 : mesures, science, statistiques (moyenne 56 %)

| # | Domaine | 1.0 | Principal manque | Tâche 1.1 |
| --- | --- | --- | --- | --- |
| 31 | Météo locale | 90 | Agrégats, import de capteurs | T35, T36 |
| 32 | Expériences de laboratoire | 80 | Incertitudes, fichiers volumineux | T36, T44 |
| 33 | Qualité de l'eau, environnement | 80 | Seuils réglementaires, géolocalisation | T36, T38 |
| 34 | Enquêtes, sondages | 55 | Formulaires publics, pondération, anonymat | T41, T35 |
| 35 | Essais cliniques | 35 | Traçabilité réglementaire, signatures | T42 (partiel) |
| 36 | Surveillance épidémiologique | 45 | Taux, géographie, dénominateurs | T35, T38, T43 |
| 37 | Démographie, recensement | 40 | Hiérarchies géographiques, pondérations, volumes | T39, T35, T44 |
| 38 | Climat (séries longues) | 40 | Données maillées, volumes | T44 (catalogue) |
| 39 | Migrations, flux de population | 35 | Matrices origine-destination, seuils de confidentialité | T35, T39, T43 |
| 40 | Indicateurs macroéconomiques | 60 | Révisions de séries, sources officielles | T36, T32 |

### Niveau 5 : volume, temps réel, réglementation (moyenne 26 %)

| # | Domaine | 1.0 | Principal manque | Tâche 1.1 |
| --- | --- | --- | --- | --- |
| 41 | Capteurs IoT temps réel | 25 | Flux continus, ingestion massive | T32 (intégration) |
| 42 | Marchés financiers | 15 | Latence, backtests | hors périmètre |
| 43 | Comptabilité légale | 20 | Partie double, certification | T42 (partiel) |
| 44 | Dossiers patients | 30 | Normes de santé, consentement, responsabilité | hors périmètre |
| 45 | Génomique | 10 | Formats spécialisés, pipelines | T44 (catalogue) |
| 46 | Télédétection, imagerie | 15 | Rasters volumineux | T44 (catalogue) |
| 47 | Cartographie (SIG) | 45 | Géométries, requêtes spatiales | T38 (partiel) |
| 48 | Réseaux et graphes de relations | 40 | Parcours de graphe | T37 (partiel) |
| 49 | Analyse de corpus de textes | 40 | Annotation, traitement du langage | — |
| 50 | Modélisation, simulation, IA | 15 | Hors des primitives de Brainy | hors périmètre |

