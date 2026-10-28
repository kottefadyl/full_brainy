# T03 — contrat de données et évolution compatible

Date : 21 octobre 2026. Ce document fixe la transition du noyau existant et les contraintes des concepts futurs. Le code reste l'autorité sur les noms GraphQL livrés. Les types futurs ci-dessous sont **conceptuels**, pas des fonctions disponibles.

## Identités et propriété

- `Collection._id`, `Entry._id` : identifiants MongoDB immuables ; `ownerId` imposé dans chaque requête API.
- `CollectionFormat.id`, `CollectionField.id` : UUID immuables. Changer un nom ou l'ordre ne change pas ces identifiants.
- `CollectionFormat.version` : numéro croissant, ancien format sans valeur = version 1. `Entry.formatVersion` enregistre la version utilisée à l'écriture ; ancien enregistrement sans valeur reste lisible grâce à `value` et aux identifiants de champs.
- Un objet futur, sa définition, ses unités et objets-variables auront `collectionId` et `ownerId` explicites. Un lien vers une autre collection demandera un `ShareGrant` ou `Transfer` vérifié par l'API ; aucune recherche globale par nom.

## Valeur d'entrée v2

`EntryValue.value: String!` reste présent pour les anciens clients. Les champs facultatifs typés de v2 sont `numberValue` (chaîne décimale canonique, sans perte monétaire par conversion flottante), `booleanValue`, `selectedValues`, `durationSeconds`, `dateValue` et `dateTimeValue` (ISO 8601 en UTC). L'unité d'un nombre vient toujours de `CollectionField.unit` ; une valeur historique ne doit pas changer d'unité sans migration contrôlée. La recherche et les calculs futurs liront les propriétés typées et convertiront les anciennes chaînes lors d'un traitement de migration idempotent.

Exemple de document d'entrée :

```json
{"collectionId":"COLLECTION_ID","ownerId":"USER_ID","formatId":"FORMAT_UUID","formatVersion":2,"values":[{"fieldId":"PRICE_UUID","value":"12.50","numberValue":"12.50"},{"fieldId":"SOLD_UUID","value":"true","booleanValue":true}]}
```

Types ajoutés : `BOOLEAN` accepte `true`/`false` ; `SELECT` exige une option exacte ; `MULTI_SELECT` envoie un tableau JSON de choix dans `value` et stocke aussi `selectedValues` ; `DATETIME` exige un décalage ou `Z`, normalisé en UTC ; `DURATION` est saisi en `heures:minutes` et conserve `durationSeconds` ; `LONG_TEXT` accepte jusqu'à 50 000 caractères. Les sept types existants restent valides. Les options de choix sont définies sur le champ, de 2 à 30 valeurs uniques.

`ATTACHMENT` conserve le nom du fichier dans `value` pour la liste et les anciens clients, avec le type MIME, la taille et les octets dans la même valeur MongoDB. Il n'est pas simulé par une URL. `SaveEntryInput` accepte `attachmentBase64` uniquement lors d'un nouveau fichier ; sur une modification sans nouvel encodage, l'API conserve les octets du fichier déjà enregistré avec ce nom. `entryAttachment(entryId, fieldId)` exige le compte propriétaire et renvoie les octets encodés pour téléchargement. Maximum : 2 MiB par fichier et 8 MiB de pièces jointes par entrée, sous la limite de document MongoDB ; ces limites imposent un stockage externe ou GridFS avant les gros volumes de T30. Supprimer l'entrée supprime ses octets ; une pièce jointe n'est pas partagée entre entrées.

## Modification de format livrée par T04

```graphql
query Impact($collectionId: String!, $formatId: String!) {
  collectionFormatImpact(collectionId: $collectionId, formatId: $formatId) {
    entryCount populatedFieldIds
  }
}

mutation Update($collectionId: String!, $formatId: String!, $input: UpdateCollectionFormatInput!) {
  updateCollectionFormat(collectionId: $collectionId, formatId: $formatId, input: $input) {
    id formats { id name version fields { id name kind unit options } }
  }
}
```

Envoyer `expectedVersion` pour refuser une édition sur un état devenu ancien. Un champ existant garde son `id` ; un nouveau champ n'en fournit pas. Le serveur permet le changement de nom, l'ordre et l'ajout. Si un champ a des valeurs sauvegardées, son type, son unité et ses choix existants sont préservés ; il ne peut pas être retiré sans migration future. Un choix supplémentaire reste possible. Le client montre l'impact, mais le serveur revalide les règles et l'accès à chaque mutation.

## Migration, reprise et retour en arrière

1. Déployer les lectures compatibles en premier : version absente = 1, valeur typée absente = interprétation de `value` selon le champ. Les anciens clients continuent à lire `value` ; les nouveaux champs GraphQL sont facultatifs.
2. Déployer l'écriture v2. Les nouvelles entrées écrivent `value` et, pour les nouveaux types, les propriétés typées. Les anciens types restent lisibles sans réécriture immédiate.
3. Pour un futur remplissage historique, parcourir par curseur `(collectionId,_id)`, sauvegarder un point de reprise et ne mettre à jour que les propriétés typées absentes. Produire un rapport de valeurs invalides ; ne jamais deviner une unité ou écraser `value`.
4. Sauvegarder la base de test avant le remplissage ; vérifier les comptes, nombres d'entrées et échantillons avant/après. Le retour en arrière consiste à restaurer le code lecteur précédent en conservant `value` ; les champs v2 additionnels n'empêchent pas la lecture. Si une restauration de données est nécessaire, utiliser la sauvegarde testée, pas une suppression massive non vérifiée.

## Concepts futurs à valider avant implémentation

Un `Object` serait une entrée identifiable d'un format local ; `OBJECT_REF` stockerait son identifiant et sa collection source autorisée. `ObjectVariable` lierait un nom local à un type d'objet compatible, avec identifiants de propriétés stables. `UnitDefinition` porterait dimension et conversion explicite ; `Calculation` serait une expression typée versionnée ; `View` définirait filtre/tri/présentation sans copier les entrées ; `Automation` lierait un événement à une action contrôlée. `ShareGrant` ou `Transfer` décrirait source, cible, droits, version et révocation. Les suppressions d'objet ou de format nécessiteraient un aperçu des références et une migration ou un refus. Les erreurs GraphQL futures doivent distinguer validation, version périmée, accès refusé et conflit de dépendance.

## Compatibilité par version de client

### Extensions T37 et T29

`EntryRelation` est une arête locale stockée séparément : `collectionId`, `fromEntryId`, `toEntryId`, `kind`, `quantity`, `unit`, `snapshotValue`, `snapshotUnit`, `snapshotFieldId`, `deletedAt`. Les anciennes entrées et les liens libres restent lisibles sans migration. Le verrou de graphe porté par la collection sérialise les changements de relations ; un verrou abandonné expire après deux minutes. Les lectures refusent un cycle et une profondeur supérieure à 32 ; le parcours de 10 000 nœuds est testé.

`SaveEntryInput.clientMutationId` rend la création rejouable après réponse réseau incertaine. `SaveEntryInput.expectedUpdatedAt` protège la modification contre un état périmé ; l'ancien client peut continuer sans ces champs, tandis que les nouveaux clients les envoient. La sauvegarde d’espace T29 emploie des documents BSON versionnés et une somme SHA-256, vérifie le propriétaire et les collisions, puis restaure par lots rejouables. Les prévisions T27 sont calculées à la demande et ne possèdent pas de document persistant à sauvegarder ; leurs données sources, définitions et historique sont inclus dans l’espace.

### Compatibilité des clients

| Client | Lecture des anciennes entrées | Lecture des nouveaux types | Écriture |
| --- | --- | --- | --- |
| Ancien client | Oui, via `value` | Peut voir `value`, sans éditeur spécialisé ; ne peut créer un type inconnu | API valide toujours le format actuel et peut refuser une valeur incompatible |
| Client v2 | Oui, même sans propriétés typées | Oui, avec composants adaptés | Envoie les valeurs canoniques ; API écrit aussi les propriétés typées |
| Futur client objets/calculs | Oui | Oui | Contrôle en plus unités, versions, références et droits locaux |
