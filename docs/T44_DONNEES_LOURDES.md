# T44 — Données lourdes par référence

Brainy **catalogue et référence** des fichiers volumineux (génomique, rasters, séries brutes, vidéos de terrain) ; il ne les analyse pas. Pour les traiter, passer par une intégration qui télécharge le fichier par son lien.

## Seuil et parcours

- Un champ **pièce jointe** garde deux modes. Jusqu'à **2 MiB** par fichier (et 8 MiB par entrée), la pièce reste dans l'entrée comme avant. **Au-delà de 2 MiB**, le fichier bascule automatiquement en mode référence : il est stocké dans un stockage objet compatible S3 et l'entrée ne garde que ses métadonnées et un identifiant. Limite par défaut : 2 GiB par fichier (`LARGE_FILE_MAX_BYTES`).
- L'envoi se fait dès le choix du fichier, par morceaux de **6 MiB**. Une coupure n'oblige pas à recommencer : en rechoisissant le même fichier (même nom et même taille), seuls les morceaux manquants sont renvoyés. L'entrée s'enregistre quand le fichier est complet.
- Aucun client ne charge le fichier entier en mémoire : le web lit des tranches `Blob.slice`, Flutter lit le fichier morceau par morceau ; l'API transmet chaque morceau au stockage sans l'agréger, et le téléchargement passe par un lien direct vers le stockage.

## Règles

- **Métadonnées gardées dans l'entrée :** nom, taille, type MIME, empreinte, identifiant de référence ; la date est celle de la fin d'envoi (`completedAt` du fichier).
- **Intégrité.** Chaque morceau porte son SHA-256 calculé par le client ; l'API le vérifie à la réception et le stockage le revérifie (`x-amz-content-sha256`). L'**empreinte du fichier** est le SHA-256 de la liste des empreintes des morceaux (une par ligne, en hexadécimal, dans l'ordre), calculée par le client et recalculée par l'API avant de terminer l'envoi. La vérification complète relit l'objet stocké par plages et recalcule chaque empreinte de morceau.
- **Accès.** Envoyer : propriétaire ou éditeur de la collection (T28), sur sa propre session d'envoi. Télécharger : toute personne qui peut lire l'entrée et ce champ (T28, partage de champs et sensibilité T43 compris), par un **lien signé valable 5 minutes**. Un autre compte n'a aucun moyen de lire le fichier.
- **Fichier manquant.** La vérification de collection interroge le stockage pour chaque référence (présence et taille) ; la vérification d'un fichier relit aussi son contenu. Statuts : disponible, manquant, altéré. Un fichier manquant reste référencé ; l'entrée n'est jamais supprimée.
- **Nettoyage.** Une session d'envoi inachevée depuis 48 h est abandonnée. Un fichier terminé qu'aucune entrée ne référence depuis 24 h est supprimé du stockage. Retirer ou remplacer une pièce volumineuse ne supprime le fichier qu'à ce nettoyage.
- **Copie entre collections (T14/T17).** La copie garde la même référence ; le fichier n'est supprimé que lorsqu'aucune entrée ne le référence plus.
- **Export.** La sauvegarde complète (T29) et l'export d'entrées (T30) listent chaque référence (identifiant, nom, taille, type, empreinte) sans le contenu, avec la marche à suivre pour récupérer les fichiers : lien signé depuis Brainy, ou clé d'objet dans le compartiment pour l'administrateur du stockage. Une restauration garde les métadonnées ; si le fichier n'existe pas dans le stockage cible, il apparaît comme manquant.

## Configuration

`S3_ENDPOINT` (adresse vue par l'API), `S3_PUBLIC_ENDPOINT` (adresse des liens signés vue par les clients), `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `LARGE_FILE_MAX_BYTES`. Les requêtes S3 sont signées par l'API (SigV4, style chemin) sans dépendance supplémentaire ; le compartiment est créé au premier usage s'il n'existe pas. Localement, `docker compose` démarre **VersityGW** v1.10.0 (passerelle S3 sur disque, `127.0.0.1:9000`) : les images communautaires MinIO ne sont plus téléchargeables. En production, pointer ces variables vers tout stockage compatible S3. Sur l'émulateur Android, régler `S3_PUBLIC_ENDPOINT` vers une adresse joignable (par exemple `http://10.0.2.2:9000`).

## API GraphQL

`startLargeFileUpload(collectionId, input)`, `uploadLargeFilePart(uploadId, partNumber, base64, sha256)`, `largeFileUpload(uploadId)` (morceaux reçus, pour reprendre), `completeLargeFileUpload(uploadId, sha256)`, `abortLargeFileUpload(uploadId)`, `largeFileDownloadLink(entryId, fieldId)`, `verifyLargeFile(entryId, fieldId)`, `checkLargeFiles(collectionId)`. Une valeur de pièce jointe envoie `largeFileId` au lieu de `attachmentBase64`.

## Vérification et limites

`api/scripts/large-file-smoke.mjs` (`npm run smoke:large-files`) s'exécute **sur l'hôte** (les liens signés visent l'adresse publique du stockage). Il couvre droits, empreinte et taille de chaque morceau, coupure puis reprise, empreinte du fichier, lien signé, lien modifié refusé, téléchargement relu par morceaux, fichier altéré et manquant, exports, abandon d'envoi et marquage pour nettoyage. Essai du 2026-11-08 (Docker local, Intel Core i5-8350U, 8 Gio) : **300 Mio** envoyés en 15 s (≈ 20 Mio/s), relus intégralement et vérifiés. Un essai, pas un engagement de service.

Limites : la vérification de toute une collection (`checkLargeFiles`) n'a pas encore d'écran (API seulement ; chaque pièce se vérifie depuis l'éditeur d'entrée) ; l'import d'entrées et la copie gardent la référence sans recopier les métadonnées de taille ; une référence copiée vers un autre compte n'ouvre jamais le fichier et apparaît comme manquante ; aucun antivirus ni aperçu n'est appliqué aux fichiers.
