# Plan d'Audit des Lacunes et Feuille de Route Corrective — Brainy

Ce document constitue le guide de référence exhaustif recensant **les lacunes, faiblesses architecturales et tâches imparfaitement exécutées** au sein du projet **Brainy** (`D:\projects\brainy`), ainsi que le plan d'élargissement et de perfectionnement du **moteur de formules** et des **graphiques & figures**.

Chaque chantier est décomposé en sous-tâches normalisées (ex: `T02/1`, `T21/1`, `T23/1`, `T25/1`, etc.) afin de permettre une exécution méthodique et modulaire par un développeur ou un agent IA (Claude AI).

---

## Sommaire

1. [Matrice des priorités et synthèse globale](#1-matrice-des-priorités-et-synthèse-globale)
2. [T21 — Élargissement & Perfectionnement du Moteur de Formules](#2-t21--élargissement--perfectionnement-du-moteur-de-formules)
3. [T23 — Élargissement & Perfectionnement des Graphiques et Figures](#3-t23--élargissement--perfectionnement-des-graphiques-et-figures)
4. [T22 — Optimisation des Agrégations Massives (Gros Volumes)](#4-t22--optimisation-des-agrégations-massives-gros-volumes)
5. [T25 & Suite de tests Flutter — Fiabilisation des tests et mocks](#5-t25--suite-de-tests-flutter--fiabilisation-des-tests-et-mocks)
6. [T02 — Socle UX, Design System, Thème sombre & Cohérence multiplateforme](#6-t02--socle-ux-design-system-thème-sombre--cohérence-multiplateforme)
7. [T20 — Système de rappels & Validation de distribution externe](#7-t20--système-de-rappels--validation-de-distribution-externe)
8. [T38 — Données géographiques & Vraie cartographie interactive](#8-t38--données-géographiques--vraie-cartographie-interactive)
9. [T39 — Nomenclatures, listes de codes & Arborescences](#9-t39--nomenclatures-listes-de-codes--arborescences)
10. [T43 — Sensibilité, k-anonymat & Confidentialité différentielle](#10-t43--sensibilité-k-anonymat--confidentialité-différentielle)
11. [ENV/1 — Correction du script de fumée fitness (port par défaut)](#11-env1--correction-du-script-de-fumée-fitness-port-par-défaut)
12. [Feuille de route séquentielle pour Claude AI](#12-feuille-de-route-séquentielle-pour-claude-ai)

---

## 1. Matrice des priorités et synthèse globale

| Identifiant | Domaine | Sévérité / Impact | Statut actuel | Objectif de perfectionnement |
| :--- | :--- | :---: | :--- | :--- |
| **T25 & Tests** | Tests Flutter & Qualité | 🔴 Critique | 3 tests compilation + 1 test widget KO | Rétablir 100 % de tests verts sur mobile/desktop. |
| **ENV/1** | Script API Backend | 🟡 Moyen | Port 4000 hardcodé dans `fitness-smoke.mjs` | Corriger la commande `npm run smoke:fitness`. |
| **T21** | Moteur de Formules | 🟠 Fort | Arithmétique binaire basique seule | Parseur complet : conditions, dates, texte, autocomplétion. |
| **T23** | Graphiques & Figures | 🟠 Fort | Courbe et barres basiques, sans zoom | Multi-courbes, double axe Y, infobulles riches, zoom tactile, export HD. |
| **T22** | Agrégats & Performance | 🟠 Fort | Plafond artificiel à 100k entrées | Pipelines MongoDB en streaming sans limitation de volume. |
| **T02** | UX / UI / Accessibilité | 🟡 Moyen | En pause dans `REPRISE_CODEX.md` | Jetons Web/Flutter unifiés, focus clavier, date picker localisé. |
| **T20** | Notifications & Rappels | 🟡 Moyen | Implémenté mais non testé en réel | Valider la réception e-mail SMTP et push FCM réels. |
| **T38** | SIG / Cartographie | 🟠 Modéré | Grille mathématique WGS84 abstraite | Vraies tuiles OpenStreetMap, zoom/pan et cache hors-ligne. |
| **T39** | Classifications | 🟠 Modéré | Listes plates locales limitées à 3 niveaux | Ingestion de référentiels normalisés (ISO, NAF, communes). |
| **T43** | Protection de la vie privée | 🟢 Faible | Masquage visuel et seuil statique | Règle formelle de k-anonymat et bruit laplacien contrôlé. |

---

## 2. T21 — Élargissement & Perfectionnement du Moteur de Formules

### Constat et lacunes actuelles
Le moteur de formules se limite à des opérations arithmétiques binaires élémentaires (`+`, `-`, `*`, `/`). Il est impossible d'écrire des conditions (ex: *« si le montant dépasse 100 €, appliquer 10 % de remise »*), d'extraire des composants de dates (mois, année, durée) ou de manipuler des chaînes de caractères. De plus, la saisie d'une formule se fait en texte brut sans aide visuelle ni autocomplétion.

### Sous-tâches de perfectionnement
* **`T21/1` : Catalogue étendu de fonctions conditionnelles et logiques**
  * Implémenter les opérateurs et fonctions logiques : `SI(condition; valeur_si_vrai; valeur_si_faux)`, `ET(cond1; cond2; ...)`, `OU(cond1; cond2; ...)`, `NON(cond)`.
  * Support des opérateurs de comparaison : `==`, `!=`, `<`, `<=`, `>`, `>=`.
  * Ajout des fonctions numériques avancées : `MIN(a; b; ...)`, `MAX(a; b; ...)`, `ARRONDI(valeur; decimales)`, `PLAFOND()`, `PLANCHER()`, `ABS()`, `MODULO()`.
* **`T21/2` : Fonctions sur les dates, heures et durées**
  * Calculs d'écarts : `DIFF_JOURS(date_fin; date_debut)`, `DIFF_HEURES()`, `DIFF_MOIS()`.
  * Manipulation temporelle : `AJOUTER_JOURS(date; n)`, `DEBUT_MOIS(date)`, `FIN_MOIS(date)`.
  * Extraction de composantes : `ANNEE(date)`, `MOIS(date)`, `JOUR(date)`, `JOUR_SEMAINE(date)`.
  * Conversion de durées : `DUREE_EN_MINUTES(d)`, `DUREE_EN_HEURES(d)`.
* **`T21/3` : Fonctions textuelles et manipulation de chaînes**
  * Fonctions de transformation : `MAJUSCULE(texte)`, `MINUSCULE(texte)`, `PROPRE(texte)` (casse titre).
  * Concaténation et extraction : `CONCATENER(t1; t2; ...)`, `SOUS_CHAINE(texte; debut; longueur)`, `LONGUEUR(texte)`, `TEXTE(nombre; "format")`.
* **`T21/4` : Accès étendu aux objets liés et variables imbriquées**
  * Permettre la navigation par point dans les propriétés des objets référencés : `produit.prix_unitaire`, `client.adresse.code_postal`.
  * Gérer les valeurs par défaut sécurisées en cas de référence nulle : `produit.poids ?? 0`.
* **`T21/5` : Validation statique, typage strict et dimensionnalité des unités**
  * Construire un graphe acyclique direct (DAG) des dépendances avant sauvegarde pour interdire les boucles infinies.
  * Valider la cohérence dimensionnelle physique : interdire l'addition d'unités incompatibles (ex: `prix_eur + distance_km`) et déduire automatiquement l'unité résultante lors des multiplications/divisions (ex: `distance_km / temps_h` donne `km/h`).
* **`T21/6` : Éditeur de formules interactif (Web & Flutter)**
  * Développer un composant d'édition avec coloration syntaxique des fonctions et des champs.
  * Autocomplétion intelligente lors de la frappe (`[` pour lister les champs disponibles, `.` pour explorer les propriétés d'un objet).
  * Encadré de prévisualisation en direct : évaluation immédiate du résultat sur la première entrée de la collection avec explication des étapes de calcul.

---

## 3. T23 — Élargissement & Perfectionnement des Graphiques et Figures

### Constat et lacunes actuelles
Les graphiques actuels sont codés en SVG basique côté Web et `CustomPainter` côté Flutter. Bien qu'extrêmement légers, ils souffrent de manques notables : seulement deux types de visualisations (courbe et barres), pas de possibilité de superposer plusieurs métriques sur deux échelles différentes (double axe Y), infobulles limitées à la balise `<title>` native du navigateur, absence de zoom interactif, et risque de saturation visuelle dès que le nombre de points dépasse 100.

### Sous-tâches de perfectionnement
* **`T23/1` : Nouveaux types de visualisations métier**
  * **Aires empilées (*Stacked Area Chart*)** : visualisation de la répartition et de l'évolution de sous-catégories dans le temps (ex: dépenses par catégorie de mois en mois).
  * **Nuage de points (*Scatter Plot*)** : analyse de corrélation bivariée entre deux champs numériques d'un même format (ex: corrélation entre température et consommation d'électricité).
  * **Jauges et indicateurs cibles (*Gauge / Bullet Chart*)** : affichage du pourcentage de réalisation par rapport à un objectif fixé.
  * **Diagramme en radar (*Radar Chart*)** : comparaison multidimensionnelle de caractéristiques d'un objet.
* **`T23/2` : Multi-séries temporelles et double axe vertical (Double axe Y)**
  * Permettre d'afficher jusqu'à 4 courbes simultanées sur le même graphique avec palette pastel distincte et légende activable/désactivable par clic.
  * Gérer deux échelles indépendantes à gauche et à droite pour croiser des grandeurs aux unités différentes (ex: *Température en °C* sur l'axe gauche et *Humidité en %* sur l'axe droit).
* **`T23/3` : Infobulles interactives riches (*Rich Floating Tooltips*)**
  * Remplacer la balise `<title>` native par une infobulle flottante fluide suivant le pointeur souris / le toucher.
  * Contenu de l'infobulle : libellé de l'axe X, valeur formatée avec son unité physique, nombre d'entrées agrégées, et variation relative (%) par rapport au point précédent.
* **`T23/4` : Zoom interactif et navigation temporelle fluide**
  * Côté Web : sélection d'une fenêtre temporelle au clic-glissé pour zoomer sur une période précise (avec bouton de réinitialisation *« Tout afficher »*).
  * Côté Flutter : support du pincement pour zoomer (*pinch-to-zoom*) et du glissement panoramique (*pan*) horizontal le long de la ligne temporelle.
* **`T23/5` : Échantillonnage dynamique pour séries volumineuses (*Downsampling LTTB*)**
  * Intégrer l'algorithme *Largest Triangle Three Buckets* (LTTB) : lorsqu'une série contient plus de 500 points, réduire dynamiquement le nombre de points affichés à la résolution de l'écran sans altérer les crêtes, creux et tendances visuelles.
  * Garantir une fluidité à 60 fps même avec 10 000 relevés chronologiques.
* **`T23/6` : Exportation haute fidélité (Images & Rapports)**
  * Proposer un menu d'exportation pour chaque graphique :
    - Export vectoriel SVG net pour intégration dans des présentations.
    - Export image PNG haute définition (x2 pour écrans Retina).
    - Export des données agrégées au format CSV.

---

## 4. T22 — Optimisation des Agrégations Massives (Gros Volumes)

### Constat et lacunes actuelles
Le calcul d'agrégats (sommes, moyennes par groupe) chargeait trop de documents en mémoire vive Node.js, ce qui a obligé lors du benchmark T31 à rejeter les analyses dépassant 100 000 entrées avec le message `Narrow the analysis to at most 100000 entries`.

### Sous-tâches correctives
* **`T22/1` : Pipeline d'agrégation MongoDB en streaming**
  * Réécrire les requêtes d'analyse dans `collections.service.ts` pour déléguer l'intégralité du calcul à l'agrégation native MongoDB (`$match`, `$project`, `$group`, `$facet`) sans rapatrier les documents bruts dans le processus Node.js.
  * Valider l'exécution d'un calcul d'agrégat sur **1 000 000 d'entrées** sous le seuil des 300 ms sans erreur de limite.
* **`T22/2` : Enrichissement des métriques de distribution statistique**
  * Ajouter aux côtés de la moyenne et du total : la médiane, l'écart-type, les quantiles (P25, P75, P95) et le mode.

---

## 5. T25 & Suite de tests Flutter — Fiabilisation des tests et mocks

### Constat et lacunes
3 classes de mock d'API dans les tests Flutter ne respectent plus la signature des vraies classes (`invalid_override`), et le test de widget `test/visual_flows_test.dart` (« T25 a saved URL is found through entry search at 320 px ») échoue avec `Bad state: No element`.

### Sous-tâches correctives
* **`T25/1` : Alignement des signatures dans les mocks de test**
  * Mettre à jour `_RecordingAuthApi`, `_ObjectAuthApi` (ajouter `{Duration timeout}`) et `CaptureApi.saveEntry` (ajouter `{String? clientMutationId, DateTime? expectedUpdatedAt}`).
* **`T25/2` : Correction du test de flux visuel T25**
  * Rectifier le sélecteur dans `test/visual_flows_test.dart` (ligne 590) pour cibler correctement le champ de recherche d'URL sur mobile (320 px).
* **`T25/3` : Nettoyage des avertissements d'analyse Dart**
  * Corriger les 24 avertissements de style (`curly_braces_in_flow_control_structures` et `use_null_aware_elements`).

---

## 6. T02 — Socle UX, Design System, Thème sombre & Cohérence multiplateforme

### Constat et lacunes
Chantier en pause dans `docs/REPRISE_CODEX.md`. Désalignement entre les jetons CSS du Web et les constantes Flutter, navigation clavier incomplète sur les panneaux d'outils et sélecteur de date non localisé.

### Sous-tâches correctives
* **`T02/1` : Harmonisation des jetons (Design Tokens) Web / Flutter**
  * Extraire une spécification unique et synchroniser `design-system.css` et `app_theme.dart` (clair et sombre charbon).
* **`T02/2` : Navigation au clavier et gestion du focus sur le Web**
  * Rendre 100 % des panneaux d'outils (`collection-tools-hub.tsx`, `workspace-tools-dialog.tsx`) navigables au clavier avec styles de focus WCAG 2.1 AA.
* **`T02/3` : Sélecteur de date localisé (FR / EN)**
  * Datepicker natif affichant les dates en français ou anglais selon la locale et persistant en ISO-8601 strict.
* **`T02/4` : Validation multi-plateforme**
  * Contrôle du responsive sans débordement sur 4 largeurs (320px, 390px, 768px, 1280px).

---

## 7. T20 — Système de rappels & Validation de distribution externe

### Constat et lacunes
Logique locale fonctionnelle mais jamais validée avec un serveur SMTP réel ni sur un terminal mobile recevant des pushs Firebase.

### Sous-tâches correctives
* **`T20/1` : Harnais de test SMTP et validation e-mail** (serveur de capture Mailpit/Ethereal).
* **`T20/2` : Validation Push FCM sur terminal Android réel** (réception en tâche de fond et écran verrouillé).
* **`T20/3` : Purge des tokens FCM obsolètes et politique de relance exponentielle**.

---

## 8. T38 — Données géographiques & Vraie cartographie interactive

### Constat et lacunes
Grille mathématique WGS84 abstraite sans fond de carte ni fonctionnalités SIG réelles.

### Sous-tâches correctives
* **`T38/1` : Intégration de tuiles OpenStreetMap interactives** (Leaflet sur le Web et `flutter_map` sur Flutter).
* **`T38/2` : Cache cartographique hors-ligne** (niveaux de zoom 1 à 14).
* **`T38/3` : Pointage interactif par clic et capture GPS de l'appareil**.

---

## 9. T39 — Nomenclatures, listes de codes & Arborescences

### Constat et lacunes
Listes locales limitées à 3 niveaux ne pouvant pas ingérer de vrais dictionnaires métiers normalisés.

### Sous-tâches correctives
* **`T39/1` : Moteur d'ingestion de référentiels standards** (formats CSV / JSON hiérarchique : ISO, NAF, communes).
* **`T39/2` : Gestion d'arborescences à profondeur arbitraire** (structure arborescente récursive).
* **`T39/3` : Sélecteur prédictif autocomplété performant sur 50 000 codes**.

---

## 10. T43 — Sensibilité, k-anonymat & Confidentialité différentielle

### Constat et lacunes
Masquage visuel basique sans garantie mathématique contre la ré-identification par corrélation croisée.

### Sous-tâches correctives
* **`T43/1` : Règle formelle de k-anonymat** ($k \ge 5$) avec généralisation automatique des tranches.
* **`T43/2` : Mécanisme de bruit laplacien contrôlé** sur les métriques sensibles.
* **`T43/3` : Journalisation d'audit des requêtes d'agrégats répétées de ciblage**.

---

## 11. ENV/1 — Correction du script de fumée fitness (port par défaut)

### Constat et lacunes
Port 4000 en dur dans `api/scripts/fitness-smoke.mjs` au lieu de 3000.

### Sous-tâche corrective
* **`ENV/1/1` : Normalisation du port d'écoute** avec `process.env.PORT ?? 3000`.

---

## 12. Feuille de route séquentielle pour Claude AI

Pour mener à bien ces perfectionnements avec une efficience maximale :

1. **Étape 1 — Tests verts & Stabilité immédiate** :
   * Exécuter `ENV/1/1` &rarr; `T25/1` &rarr; `T25/2` &rarr; `T25/3`.
   * *Objectif : `flutter test` et les tests API 100 % réussis.*
2. **Étape 2 — Perfectionnement du Cœur de Calcul (Formules & Volumes)** :
   * Exécuter `T21/1`, `T21/2`, `T21/3`, `T21/4`, `T21/5` (Parseur et fonctions étendues).
   * Exécuter `T22/1` et `T22/2` (Streaming MongoDB sur gros volumes).
   * Exécuter `T21/6` (Éditeur de formules avec coloration et autocomplétion).
3. **Étape 3 — Révolution Visuelle (Graphiques & Figures T23)** :
   * Exécuter `T23/1` (Nouveaux types de graphiques : aires empilées, scatter, jauges).
   * Exécuter `T23/2` (Double axe Y et multi-séries).
   * Exécuter `T23/3` (Infobulles riches au survol).
   * Exécuter `T23/4` (Zoom interactif et pan).
   * Exécuter `T23/5` (Échantillonnage LTTB pour fluidité 60 fps sur séries massives).
   * Exécuter `T23/6` (Exportation haute définition PNG/SVG/CSV).
4. **Étape 4 — Finition UX / UI (Clôture T02)** :
   * Exécuter `T02/1` à `T02/4` (Harmonisation des jetons et navigation clavier).
5. **Étape 5 — Composants Métier Spécialisés** :
   * Exécuter `T38` (Cartes interactives OSM) &rarr; `T39` (Nomenclatures) &rarr; `T43` (Confidentialité $k$-anonymat) &rarr; `T20` (Validation SMTP/FCM réelle).

---

## 13. Décisions produit du 9 novembre 2026

Ces décisions priment sur les objectifs ci-dessus.

* **`T22/1`, 300 ms sur 1 000 000 d'entrées :** abandonné tant qu'aucun usage réel ne l'exige. Les calculs prennent 18 à 33 s et l'objectif imposerait des agrégats précalculés.
* **`T23/2`, double axe Y :** abandonné. Les courbes multiples restent à faire.
* **`T43/2`, bruit laplacien :** reporté. `T43/3` et `T43/1` livrés le 10 novembre 2026 ([T43](tasks/T43.md)).
* **État au 10 novembre 2026 :** `T23/6` livré sur le web et Flutter (pas de SVG sur Flutter) ; `T23/1` livré : aires empilées, jauge, nuage de points et radar ([T23](tasks/T23.md)).
