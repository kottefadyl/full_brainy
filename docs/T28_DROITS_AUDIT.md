# Contrat technique — T28 : Droits, audit et collaboration

## 1. Principes et objectifs

T28 étend la propriété personnelle d'une collection à un modèle de collaboration sécurisé sans fuite de données et sans exposer le profil privé des utilisateurs.

### Rôles par collection :
1. **`OWNER` (Propriétaire)** :
   - Créateur de la collection ou propriétaire désigné.
   - Peut inviter, modifier les rôles ou révoquer des collaborateurs.
   - Peut supprimer ou renommer la collection, modifier ses formats et unités.
   - Plein accès en lecture et écriture.
2. **`EDITOR` (Éditeur)** :
   - Peut créer, modifier et supprimer des entrées de la collection.
   - Peut utiliser les vues, formules et analyses autorisées.
   - Ne peut pas supprimer la collection ni gérer les collaborateurs.
3. **`READER` (Lecteur)** :
   - Lecture seule des entrées et formats autorisés.
   - Ne peut effectuer aucune création, modification ou suppression.
   - Tout appel d'écriture rejeté par l'API avec refus d'accès (`ForbiddenException`).

### Masquage des champs sensibles :
- Un collaborateur peut avoir une liste de champs restreints `sharedFieldIds` (si vide, tous les champs sont accessibles).
- Les champs non autorisés sont exclus dès l'API lors de la lecture d'entrées et des calculs.

## 2. Journal d'audit (`AuditLog`)
Toute action sensible est consignée de manière immuable :
- `collectionId`: ID de la collection
- `userId`: ID de l'opérateur
- `action`: `CREATE_ENTRY`, `UPDATE_ENTRY`, `DELETE_ENTRY`, `SHARE_COLLECTION`, `UPDATE_MEMBER_ROLE`, `REVOKE_MEMBER`, `UPDATE_FORMAT`
- `occurredAt`: horodatage ISO
- `details`: résumé structuré de l'action

## 3. Confidentialité du profil
Le partage n'expose jamais les informations privées du profil (centres d'intérêt, profession, loisirs). Seul l'identifiant, le nom public et l'e-mail nécessaire à la collaboration sont échangés.
