# T32 — Connecteurs et sources de données

Contrat de la première tranche livrée. Elle ne promet aucune garantie industrielle : ni temps réel, ni débit garanti, ni conformité à une norme. Pour les besoins spécialisés (temps réel strict, réglementation, calcul scientifique), ajouter un module de domaine ou une intégration qui écrit par ce contrat, sans changer la signification du noyau.

## Parcours

1. Dans une collection, le propriétaire crée une **source de données** : un nom, un format de données cible et une correspondance « colonne → champ ». Il choisit la colonne **identifiant de l'enregistrement** (obligatoire), et en option la colonne **date du fait**, la colonne **qualité**, la colonne **statut de mesure** et, par champ, une colonne **unité**.
2. Une personne qui peut modifier la collection envoie un fichier CSV (ou du JSON) ; un système externe peut envoyer des livraisons avec une **clé d'envoi** révocable, affichée une seule fois.
3. Chaque livraison devient une **exécution** traitée en arrière-plan par lots de 200 lignes. Elle affiche reçues, créées, mises à jour, inchangées, ignorées car plus anciennes, rejetées, durée et débit (lignes/s), et l'écart maximal entre date du fait et réception.
4. Les lignes rejetées sont listées avec un code, un message et la ligne d'origine. Après correction de la source ou du format de données, l'utilisateur relance **seulement les lignes rejetées** ; il peut aussi télécharger ces lignes en CSV.

## Règles

- **Portée.** Une source appartient à une collection et n'écrit que dans le format choisi de cette collection. Gérer la source et la clé : propriétaire. Envoyer un fichier, lire exécutions et rejets : propriétaire ou éditeur (T28). Une clé n'a aucun droit de lecture ; elle ne crée que des livraisons pour sa source. Chaque livraison est inscrite au journal d'audit.
- **Formats acceptés.** Format de données ordinaire ou modèle d'objets ; refus des registres (T42) et des flux d'états (T40). Champs pris en charge : titre, texte, texte long, caractère, lien, date, date et heure, heure, durée, nombre, mesure, oui/non, choix unique, code. Pièces jointes, références d'objet, choix multiples et géographie ne sont pas importables par une source.
- **Dédoublonnage.** La clé est `(source, identifiant de l'enregistrement)`, garantie par l'index unique existant des entrées importées. Rejouer une livraison, reprendre une exécution interrompue ou relancer des rejets ne crée jamais de doublon.
- **Mises à jour fréquentes.** Politique `UPDATE` (par défaut) : une nouvelle version d'un enregistrement remplace les valeurs mappées, conserve les autres champs et pousse l'ancienne version dans l'historique des révisions (20 dernières). Une ligne identique est comptée « inchangée ». Si la date du fait reçue est antérieure à celle déjà enregistrée, la ligne est « plus ancienne » et n'écrase rien. Une cellule vide n'efface jamais une valeur enregistrée. Politique `KEEP_FIRST` : la première version reste.
- **Temps.** La date du fait (`sourceObservedAt`) est distincte de la réception (`sourceReceivedAt`) ; pour un champ mesure, la date du fait alimente aussi `observedAt` (T36). Les dates sont en ISO 8601 ; une date et heure sans fuseau est refusée.
- **Unités.** L'unité appartient au champ. Si une colonne unité est déclarée, sa valeur doit être exactement le symbole du champ ; sinon la ligne est rejetée (`UNIT_MISMATCH`). Aucune conversion n'est déduite d'un nom.
- **Nombres.** Séparateur décimal choisi par source (point ou virgule) ; le stockage est normalisé avec un point. Oui/non accepte `true/false`, `1/0`, `yes/no`, `oui/non`.
- **Évolution des formats.** Les colonnes en trop sont ignorées et comptées. Une colonne mappée absente de l'en-tête rejette la livraison entière (`MISSING_COLUMN`). Un champ mappé supprimé ou devenu non pris en charge fait échouer l'exécution avec `MAPPING_STALE` ; l'utilisateur corrige la correspondance puis relance.
- **Codes de rejet.** `MISSING_RECORD_ID`, `DUPLICATE_IN_DELIVERY`, `EMPTY_ROW`, `INVALID_OBSERVED_AT`, `UNIT_MISMATCH`, `INVALID_VALUE`, `LOCKED_ENTRY` (mouvement de stock validé ou déplacement en cours), `COLUMN_COUNT`.
- **Limites.** 10 000 lignes et 4 Mo par livraison ; 120 livraisons par heure et par clé ; 1 000 rejets détaillés conservés par exécution (le total reste exact) ; exécutions expirées après 30 jours ; 20 sources par collection. Les valeurs volumineuses relèvent de T44.

## API GraphQL

`createDataSource`, `updateDataSource`, `deleteDataSource`, `rotateDataSourceKey`, `revokeDataSourceKey`, `dataSources(collectionId)`, `uploadDataSourceDelivery(sourceId, deliveryId, content, contentType)`, `pushDataSourceDelivery(key, deliveryId, content, contentType)` (public, clé), `dataSourceRuns(sourceId)`, `dataSourceRun(runId)` (avec rejets), `cancelDataSourceRun`, `resumeDataSourceRun`, `retryDataSourceRejections(runId)`. `deliveryId` rend l'envoi idempotent : même identifiant et même contenu renvoient l'exécution existante ; contenu différent : refus.

Exemple d'envoi par un système externe :

```sh
curl -s https://<api>/graphql -H 'content-type: application/json' \
  -d '{"query":"mutation($k:String!,$d:String!,$c:String!){pushDataSourceDelivery(key:$k,deliveryId:$d,content:$c,contentType:\"text/csv\"){id state}}","variables":{"k":"<clé>","d":"2026-11-08T10","c":"id,temp\nS1,21.5\n"}}'
```

## Mesure du volume

`api/scripts/data-source-smoke.mjs` (`npm run smoke:data-sources`) couvre règles, droits, idempotence, mises à jour, versions plus anciennes, réparation, `MAPPING_STALE`, annulation/reprise sans doublon et révocation de clé. Avec `DATA_SOURCE_ROWS=100000`, il mesure l'alimentation d'une collection par livraisons de 10 000 lignes.

Essai du 2026-11-08 (Docker local, Intel Core i5-8350U, 8 cœurs logiques, 8 Gio, API et MongoDB sur la même machine) : 100 000 lignes en 124 s, soit environ 810 lignes/s, sans rejet ni doublon. Ce chiffre décrit un essai, pas un engagement de service.

Constat : une égalité simple sur `importKey`/`sourceId` ne permet pas à MongoDB d'utiliser l'index unique partiel ; la requête parcourait toutes les entrées de la collection (57 lignes/s à 10 000 lignes). Les filtres T32 ajoutent `$type: 'string'`. `importEntriesBatch` (T30/T07) utilise encore l'ancienne forme : à corriger dans une tâche dédiée.
