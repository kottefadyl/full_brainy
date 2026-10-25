# T01 — inventaire vérifié et parcours de référence

Date : 21 octobre 2026. Ce document décrit le dépôt au début de T01–T05 ; relire le code avant une future tâche. Les scénarios ci-dessous utilisent un compte de test isolé et ne touchent pas aux données réelles d'un utilisateur.

## Matrice de départ

| Capacité | API | Next.js web | Flutter mobile/ordinateur | État au départ |
| --- | --- | --- | --- | --- |
| Compte, connexion, profil privé | `api/src/auth/` | `app/brainy-app.tsx` | `auth_screen.dart`, `profile_screen.dart` | Existe |
| Collections et plusieurs formats de données | `api/src/collections/` | `CollectionEditor` | `_CollectionEditor` | Existe |
| Couleur pastel propre à chaque format | `setCollectionFormatColor` | sélecteur de couleur | sélecteur de couleur | Existe |
| Entrées datées, compactes et copiables | `Entry` | `EntryCard` | `_entryCard`, `entry_clipboard.dart` | Existe |
| Édition des champs d'un format déjà créé | aucune mutation | aucune | aucune | Absent au départ |
| Valeurs typées | `EntryValue.value` uniquement, chaîne | saisie selon sept types | saisie selon sept types | Partiel au départ |
| Pièces jointes gérées par Brainy | aucune | aucune | aucune | Absent |
| Pagination et recherche d'entrées | `collectionEntries` renvoie tout | charge tout | charge tout | Absent, T06 |
| Objets locaux, variables, calculs, vues et rappels | aucune | aucune | aucune | Absent, tâches futures |

Les clients lisent tous deux la même API GraphQL. Le web est Next.js dans `brainy_web_app/` ; Flutter dans `brainy/` cible mobile et ordinateur. Les chaînes visibles ont des versions anglaise et française dans `brainy_web_app/lib/brainy.ts` et `brainy/lib/app_strings.dart`. Les unités de nombre sont définies sur le champ. La palette a 24 couleurs ; chaque collection a au plus 24 formats et chaque format 1 à 30 champs.

## Jeux de démonstration sans données personnelles

Créer ces collections dans un compte de test, puis supprimer ce compte et ses données. Chaque jeu commence avec un format et une entrée ; il sert de parcours manuel sur navigateur de 320 px, navigateur large, téléphone Flutter et ordinateur Flutter.

| Collection | Format de données et champs | Première entrée | Vérification |
| --- | --- | --- | --- |
| Mon livre | Note : Titre, Texte, Date | « Chapitre 1 » ; idée de scène ; 2026-10-21 | créer, éditer, copier, relire le texte complet |
| Liens utiles | Lien : Titre, Lien, Texte | « Documentation » ; `https://example.com` ; commentaire | ouvrir et copier le lien |
| Agenda personnel | Tâche : Titre, Date, Heure, Texte | « Réviser » ; 2026-10-22 ; 09:30 ; « à faire » | vérifier date de création distincte de la date de la tâche ; il n'existe pas encore de rappel |
| Boutique | Mouvement : Titre, Nombre en EUR, Nombre en unités, Texte | « Vente » ; 12.50 ; 2 ; « Sortie » | la saisie n'est pas encore un registre de stock ni un calcul automatique |
| Mesures | Mesure : Titre, Nombre en kg, Date, Heure | « Échantillon A » ; 0.55 ; date et heure | unité et heure visibles ; aucun graphique à ce stade |

Pour les parcours automatisés, `api/scripts/collections-smoke.mjs` crée ses propres comptes temporaires, vérifie les droits et supprime ses enregistrements dans `finally`. Ne jamais utiliser une collection d'utilisateur comme fixture. Le parcours web existant est dans `api/scripts/web-smoke.mjs` ; les tests Flutter sont dans `brainy/test/`.

## Écarts constatés

- Les anciennes collections sont migrées à la lecture vers un format « General ». Leur `formatId` est attribué aux entrées sans format.
- Les anciennes valeurs sont des chaînes ; le contrat v2 conserve `value` pendant la migration et ajoute des propriétés typées facultatives.
- Le nombre d'entrées affiché exige aujourd'hui de toutes les télécharger : la pagination est T06.
- Aucun stockage de fichier ni permission de partage entre comptes n'est présent. Une URL de champ `LINK` reste un lien, pas une pièce jointe.
