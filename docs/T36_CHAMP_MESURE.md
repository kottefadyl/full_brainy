# Contrat technique — T36 : Type de champ « mesure »

## 1. Principes et objectifs

Le type de champ `MEASURE` permet d'enregistrer une observation scientifique, technique ou météorologique sans réduire la mesure à un simple nombre (Règle 11).
Il distingue explicitement :
- **Valeur absente** (`ABSENT`) : le capteur ou l'observateur n'a pas pu mesurer (distinct de 0).
- **Zéro** : une valeur mesurée ou calculée valant exactement 0.
- **Valeur estimée** (`ESTIMATED`) : interpolation, approximation manuelle.
- **Valeur calculée** (`CALCULATED`) : résultat d'un algorithme ou formule.
- **Valeur mesurée** (`MEASURED`) : lecture directe d'un instrument.

## 2. Structure de données

### 2.1. Définition de champ (`CollectionField`)
- `kind`: `MEASURE`
- `unit`: unité standard ou locale (ex. `°C`, `hPa`, `mg/L`, `kg`).

### 2.2. Valeur de champ (`EntryValue`)
Chaque entrée stocke :
- `value`: valeur numérique canonique ou vide si `ABSENT`.
- `numberValue`: indexable pour tri/filtre lorsque non absente.
- `unitSnapshot`: snapshot de l'unité au moment de la mesure.
- `measureValue`:
  - `status`: `'MEASURED' | 'ESTIMATED' | 'CALCULATED' | 'ABSENT'` (par défaut `MEASURED`)
  - `uncertainty`: valeur numérique de l'incertitude (optionnelle)
  - `uncertaintyType`: `'ABSOLUTE' | 'RELATIVE'` (par défaut `ABSOLUTE`)
  - `quality`: libellé optionnel (ex. `A`, `B`, `Étalonné`, `Suspect`)
  - `instrument`: nom d'instrument ou ID d'objet T11 (optionnel)
  - `observedAt`: date/heure du fait observé (optionnel, ISO)
  - `recordedAt`: date/heure de saisie (ISO)
  - `revisedAt`: date/heure de dernière révision (optionnel, ISO)

### 2.3. Historique des révisions et relecture à une date
Lorsqu'une valeur de mesure est modifiée ou corrigée, l'historique des révisions (`revisions` dans `Entry`) consigne l'ancienne valeur avec son horodatage.
Une fonction de relecture permet d'extraire l'état d'une entrée tel qu'il était connu à une date `asOfDate`.

## 3. Conversion sans perte depuis `NUMBER`
Un champ `NUMBER` existant peut être converti en `MEASURE` sans perte :
- Les valeurs numériques existantes sont conservées.
- Le statut par défaut est `MEASURED`.
- L'unité existante est préservée.

## 4. Intégration aux analyses (T35)
- Les opérations déclarées de T35 acceptent les champs `MEASURE`.
- Les valeurs avec statut `ABSENT` sont ignorées par les calculs (comptées dans `skippedMissingCount`).
- Si un groupe contient au moins une valeur avec statut `ESTIMATED`, le résultat le signale explicitement dans `explanation`.
- L'incertitude est propagée de manière quadratique pour `SUM` et `AVERAGE` lorsque toutes les valeurs observées possèdent une incertitude absolue. Dans les autres cas, la mention « incertitude non propagée » est affichée.
