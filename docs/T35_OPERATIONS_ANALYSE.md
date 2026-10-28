# T35 — contrat du registre d'opérations d'analyse extensibles

## 1. Principe et sécurité (règle 12 et ajustement A4)

L'analyse de plusieurs entrées repose sur un **registre d'opérations versionné** exécuté uniquement côté serveur (`api/src/collections/analysis_registry.ts`). Aucun code ni script fourni par l'utilisateur n'est évalué. Chaque opération déclare son contrat de compatibilité ; toute requête hors contrat (unités mélangées comme `EUR` et `km`, nature de valeur incompatible, champ date manquant pour une séquence, dénominateur absent ou nul, nombre d'observations inférieur au minimum requis) est **refusée explicitement** avec un message compréhensible.

## 2. Registre des opérations déclarées (version 1)

| Identifiant (`id`) | Version | Nature acceptée (`measureKind`) | Tri chronologique requis | Minimum d'observations (`minObservations`) | Unité de sortie (`outputKind`) | Valeurs absentes |
| --- | :---: | --- | :---: | :---: | --- | --- |
| `COUNT` | 1 | `EVENT`, `SNAPSHOT`, `RATE` | Non | 0 | Sans unité (`count`) | Incluses dans le compte d'entrées |
| `SUM` | 1 | `EVENT` | Non | 1 | Unité de la mesure | Ignorées (`SKIP`) |
| `AVERAGE` | 1 | `EVENT`, `SNAPSHOT`, `RATE` | Non | 1 | Unité de la mesure | Ignorées (`SKIP`) |
| `MIN` | 1 | `EVENT`, `SNAPSHOT`, `RATE` | Non | 1 | Unité de la mesure | Ignorées (`SKIP`) |
| `MAX` | 1 | `EVENT`, `SNAPSHOT`, `RATE` | Non | 1 | Unité de la mesure | Ignorées (`SKIP`) |
| `MEDIAN` | 1 | `EVENT`, `SNAPSHOT`, `RATE` | Non (tri par valeur) | 1 | Unité de la mesure | Ignorées (`SKIP`) |
| `PERCENTILE` | 1 | `EVENT`, `SNAPSHOT`, `RATE` | Non (tri par valeur) | 1 | Unité de la mesure | Ignorées (`SKIP`) |
| `VARIANCE` | 1 | `EVENT`, `SNAPSHOT`, `RATE` | Non | 2 | Unité² (`unit²`) | Ignorées (`SKIP`) |
| `STDDEV` | 1 | `EVENT`, `SNAPSHOT`, `RATE` | Non | 2 | Unité de la mesure | Ignorées (`SKIP`) |
| `RANGE` | 1 | `EVENT`, `SNAPSHOT`, `RATE` | Non | 1 | Unité de la mesure | Ignorées (`SKIP`) |
| `RATE_PER_N` | 1 | `EVENT`, `SNAPSHOT`, `RATE` | Non | 1 | `par N` (ex. `/1000`) | Ignorées (`SKIP`) |
| `CROSSTAB` | 1 | `EVENT`, `SNAPSHOT`, `RATE` | Non | 1 | Unité de la mesure | Ignorées (`SKIP`) |
| `CUMULATIVE` | 1 | `EVENT` | Oui (`date` puis `_id`) | 1 | Unité de la mesure | Ignorées (`SKIP`) |
| `MOVING_AVERAGE` | 1 | `EVENT`, `SNAPSHOT`, `RATE` | Oui (`date` puis `_id`) | 1 | Unité de la mesure | Ignorées (`SKIP`) |
| `SUCCESSIVE_DIFF` | 1 | `SNAPSHOT`, `EVENT` | Oui (`date` puis `_id`) | 2 | Unité de la mesure | Ignorées (`SKIP`) |
| `SUCCESSIVE_VARIATION` | 1 | `SNAPSHOT`, `EVENT`, `RATE` | Oui (`date` puis `_id`) | 2 | `%` | Ignorées (`SKIP`) |
| `LINEAR_TREND` | 1 | `EVENT`, `SNAPSHOT`, `RATE` | Oui (`date` puis `_id`) | 2 | Unité / période | Ignorées (`SKIP`) |

## 3. Paramètres étendus (`AnalysisInput`) et explicabilité (`AnalysisResult`)

- **Paramètres facultatifs d'`AnalysisInput`** :
  - `percentile` (`1` à `99`, défaut `95`) pour `PERCENTILE`.
  - `rateBase` (ex. `100`, `1000`, `100000`, défaut `1000`) et `denominatorValue` (nombre > 0) ou `denominatorFieldId` (champ numérique positif de l'entrée) pour `RATE_PER_N`.
  - `secondaryGroupBy` (`DAY`, `MONTH`, `CATEGORY`, `OBJECT`) et `secondaryGroupFieldId` pour `CROSSTAB` (produit des lignes `ligne × colonne` et renseigne `rowKey` / `columnKey`).
  - `windowSize` (`2` à `30`, défaut `3`) pour `MOVING_AVERAGE`.
  - `weightFieldId` (champ numérique ≥ 0 de l'entrée) pour pondérer `SUM`, `AVERAGE`, `RATE_PER_N`.
  - `counterResetFieldId` (champ booléen de l'entrée indiquant une remise à zéro déclarée du compteur) pour `SUCCESSIVE_DIFF`.
- **Règles sur les séquences (`SUCCESSIVE_DIFF`, `SUCCESSIVE_VARIATION`, `CUMULATIVE`, `MOVING_AVERAGE`, `LINEAR_TREND`)** :
  1. **Tri déterministe** : par valeur du champ date (`dateFieldId` obligatoire), puis par identifiant interne (`_id`) en cas d'égalité de date.
  2. **Trous et valeurs absentes** : une entrée dont la valeur numérique est absente est ignorée sans être assimilée à zéro ; le compteur `skippedMissingCount` indique combien d'entrées ont été écartées.
  3. **Remise à zéro d'un compteur (`SUCCESSIVE_DIFF`)** : entre deux relevés successifs $v_{i-1}$ et $v_i$, la consommation est $v_i - v_{i-1}$. Si $v_i < v_{i-1}$ : si l'entrée $i$ coche le champ `counterResetFieldId` (`true`), la consommation retenue après remise à zéro est $v_i$ ; sinon l'API refuse avec un message explicite signalant une baisse de compteur non déclarée.
  4. **Entrée corrigée** : toute modification d'entrée (`updateEntry`) est immédiatement prise en compte au calcul suivant ; aucun cache périmé n'est servi.
- **Explicabilité (`AnalysisResult`)** :
  - `operationVersion` : version de l'opération dans le registre (`1`).
  - `skippedMissingCount` : nombre d'entrées filtrées dont la mesure était absente.
  - `explanation` : texte synthétique indiquant l'opération, le tri, la fenêtre, le dénominateur, la pondération ou la pente/période (`slope`, `intercept`).
  - Chaque `AnalysisRow` conserve `group`, `label`, `value`, `count`, `sources`, `sourcesHasMore`, et ajoute `rowKey` / `columnKey` pour `CROSSTAB`.

## 4. Compatibilité et retour en arrière

Ce contrat étend `AnalysisInput` et `AnalysisResult` uniquement par des champs facultatifs ou rétrocompatibles. Les requêtes existantes de T22/T23 (`COUNT`, `SUM`, `AVERAGE`, `MIN`, `MAX`) conservent exactement leur comportement, leurs types et leurs résultats.

