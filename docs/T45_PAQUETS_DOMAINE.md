# T45 — Paquets de domaine partageables (contrat)

## Format de paquet (version 1)

Un paquet est un fichier JSON (512 Kio au plus) :

```json
{
  "format": "brainy.domain-package",
  "schemaVersion": 1,
  "id": "brainy.expenses",
  "version": "1.0.0",
  "name": { "en": "Expenses", "fr": "Dépenses" },
  "description": "…", "notice": "…",
  "provenance": { "author": "…", "license": "CC-BY-4.0", "publishedAt": "2026-11-07", "signature": { "algorithm": "ed25519", "publicKey": "<SPKI DER base64>", "value": "<base64>" } },
  "content": { "units": [], "codeLists": [], "dataFormats": [], "exampleObjects": [], "views": [], "formulas": [], "stockRules": [] }
}
```

- Un texte est soit une chaîne, soit `{ "en": "…", "fr": "…" }`. Les textes sont matérialisés dans la langue choisie à l'installation ; ils deviennent ensuite des noms saisis, jamais retraduits.
- Les éléments portent une **clé** stable (`[A-Za-z0-9_.-]{1,64}`). Les références internes utilisent ces clés : `unit` = identifiant d'unité intégrée ou `local:<clé>`, `target` = clé d'un format de données modèle d'objets, `codeList`, colonnes de vue `format.champ`, nœuds de formule identiques à T21 (`fieldId`, `referenceFieldId`, `propertyFieldId`, `formulaId`, `fromFieldId`, `toFieldId`) mais remplis de clés.
- Validation stricte par liste blanche : toute clé inconnue est refusée. Les clés de type code exécutable (`script`, `exec`, `hooks`…) ou données d'utilisateur (`entries`, `attachments`, `members`…) produisent un refus explicite (règle 17). Les objets d'exemple n'acceptent que des valeurs textuelles, numériques, de choix, oui/non, lien ou date ; jamais de pièce jointe.
- `schemaVersion` différent de 1 ou type de champ inconnu : refus clair (« ce paquet utilise le format N ; cette version de Brainy lit le format 1 »).
- Signature facultative Ed25519 sur le JSON canonique (clés triées) du paquet sans `provenance.signature`. Statuts : aucune, valide (empreinte de clé affichée), invalide (installation refusée). Une signature prouve l'intégrité par rapport à la clé jointe, pas l'identité de l'auteur.

## Opérations (GraphQL)

- `domainPackagePilots(language)` : six paquets pilotes fournis par Brainy (Notes et liens, Dépenses, Ventes simples, Météo locale, Boutique, Suivi de mesures).
- `previewDomainPackage(packageJson, collectionId?, language)` : provenance, mode (`NEW_COLLECTION`, `INSTALL`, `UPDATE`), éléments ajoutés, dépendances, ajustements (couleur remplacée) et conflits bloquants (nom de format ou de liste déjà pris, limite de 24 formats ou 30 champs, même version déjà installée, version plus ancienne).
- `installDomainPackage(packageJson, collectionId?, collectionName?, language, expectedVersion)` : copie locale. Sans `collectionId`, crée une collection. En cas d'échec, les éléments ajoutés sont retirés (collection neuve supprimée).
- **Mise à jour** proposée lorsqu'un paquet de même `id` et de version supérieure est prévisualisé sur une collection où il est installé : seuls les ajouts (formats, champs, unités, listes, codes, vues, formules, règles de stock) sont appliqués. Rien n'est modifié ni supprimé localement ; les objets d'exemple ne sont pas réinstallés.
- `detachDomainPackage(installId)` : retire le lien avec le paquet ; formats, entrées et objets restent.
- `domainPackageInstalls(collectionId)` : paquets actifs de la collection.
- `exportDomainPackage(collectionId, input)` : structure seule (formats, unités locales, listes de codes, vues, formules, règles de stock). **Jamais** d'entrée, d'objet, de pièce jointe, de membre, de taux de change, de lien partagé ni de flux d'états ; les champs ou formules qui en dépendent sont omis avec un avertissement. Réservé au propriétaire.

## Limites

- Import par fichier ou par lien `https` récupéré par le client (le serveur ne télécharge rien ; le site distant doit autoriser CORS sur le web). Pas de place de marché.
- Les modèles T24 restent servis par `createCollectionFromTemplate` ; les six pilotes couvrent leurs domaines au format paquet (A8 partiel). Les flux d'états T40 et registres T42 ne sont pas encore exportables en format 1.
- L'installation n'est pas une transaction MongoDB : le retrait compensatoire couvre les échecs de validation, pas un arrêt brutal du serveur.
