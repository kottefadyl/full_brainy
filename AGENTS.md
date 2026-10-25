# Brainy — guide produit et logique métier

Lire ce fichier avant de modifier Brainy. Il décrit le produit tel qu'il existe aujourd'hui et son objectif. Les idées de la dernière section sont des pistes de conception, pas des fonctions déjà livrées. En cas d'écart, vérifier le code et demander une décision produit avant de changer une règle métier.

## Objectif

Brainy aide une personne à noter, organiser et retrouver des informations personnelles sur mobile, ordinateur et web. L'utilisateur choisit lui-même la structure de ses données : il crée des collections, définit des **formats de données** avec leurs champs, puis écrit des entrées. L'expérience doit rester simple pour une personne débutante tout en laissant de la souplesse à une personne expérimentée.

Le terme visible dans l'interface est **« data format »** en anglais et **« format de données »** en français. Éviter « format » seul pour désigner cette entité. Les noms et contenus saisis par les utilisateurs sont conservés tels quels.

## Plateformes et architecture actuelle

- `brainy_web_app/` : application web Next.js, utilisable sur écran mobile ou ordinateur dans un navigateur.
- `brainy/` : application Flutter pour mobile et ordinateur. Flutter n'est pas la plateforme web de Brainy.
- `api/` : API GraphQL NestJS et base MongoDB. Les deux clients utilisent le même compte et les mêmes données.
- Toute fonction livrée aux utilisateurs doit être cohérente entre le web, le mobile et l'ordinateur, avec des textes d'interface en anglais et en français.

## Compte et profil

- L'utilisateur s'inscrit ou se connecte avec son adresse e-mail et son mot de passe, ou avec Google lorsque Firebase est configuré.
- À la première connexion sans profil complété, Brainy demande le nom, la profession, le poste actuel, le domaine d'études, les centres d'intérêt et les loisirs. Profession, poste et études sont facultatifs ; il faut au moins un centre d'intérêt ou un loisir. Le profil reste modifiable.
- Ces informations sont privées et préparées pour une éventuelle mise en relation entre utilisateurs. La mise en relation n'est pas encore disponible ; ne pas présenter le profil comme public.
- Les collections et entrées appartiennent au compte connecté. L'API contrôle cet accès.

## Collections, formats de données et entrées

1. Une **collection** possède un nom. Elle sert de conteneur aux formats de données et aux entrées. Son nom peut être modifié ; sa suppression retire aussi ses entrées.
2. Une collection possède de 1 à 24 **formats de données** nommés. Chaque format de données possède ses propres champs et une couleur pastel choisie obligatoirement dans la palette. Deux formats de données d'une même collection ne peuvent pas partager la même couleur. La couleur peut être changée plus tard.
3. Un format de données possède de 1 à 30 champs. Les noms de champs sont uniques au sein de ce format, sans distinction de casse. Types disponibles : titre, date, nombre, heure, lien web, caractère unique, texte, texte long, oui/non, choix unique ou multiple, date et heure, durée, pièce jointe et référence d'objet. Un champ nombre peut être sans unité, utiliser une unité proposée ou une unité personnalisée. L'unité appartient à la définition du champ. Les pièces jointes sont limitées à 2 MiB par fichier et 8 MiB par entrée.
4. Lors de la création d'une **entrée**, l'utilisateur choisit un format de données de la collection et renseigne au moins un de ses champs. L'entrée ne contient que des valeurs des champs de ce format. Le format de données d'une entrée existante ne change pas lors de sa modification.
5. L'entrée reprend le fond pastel de son format de données. La date de création doit être facile à repérer ; la date de modification apparaît si l'entrée a été modifiée. L'utilisateur peut modifier, supprimer et copier une entrée. La copie produit du texte lisible avec les champs renseignés et les unités des nombres.
6. Les entrées se présentent comme des lignes compactes et lisibles, y compris sur petit écran. Le contenu complet reste accessible par l'édition et la copie, même si une valeur longue est abrégée dans la liste.
7. Les anciennes collections sans formats de données sont rattachées à un format de données général afin de préserver leurs entrées.
8. Un format de données existant peut être renommé, recevoir de nouveaux champs ou changer l'ordre des champs. Un champ contenant des valeurs enregistrées ne peut pas être supprimé ni changer de type ou d'unité ; ses choix existants restent disponibles. L'API utilise une version de format pour refuser une modification sur un état périmé.
9. Une collection peut posséder des unités locales et des formats de données marqués comme modèles d’objets. Un objet est une entrée nommée d’un de ces formats, avec identité stable, caractéristiques, duplication et historique de modifications. Un modèle proposé par Brainy est copié dans la collection choisie. Convertir un format déjà rempli en modèle d’objets demande un aperçu et une confirmation ; une entrée sans titre ne peut devenir objet. La duplication conserve le nom saisi. L’action « Utiliser dans une entrée » crée un résumé figé dans un format de données ordinaire avec un lien interne vers l’objet source. Un champ de référence typé permet aussi de choisir un ou plusieurs objets dans une entrée, en mode valeur actuelle ou instantané ; un objet-variable utilise ces références sans créer de stock.

## Expérience et langage

- Sur les deux clients, suivre la direction [visuelle et linguistique](docs/EXPERIENCE_BRAINY.md) : sobriété Fedora sans copie, hiérarchie claire, fonds pastel, lisibilité et accessibilité sur tout écran.
- Permettre aux novices de commencer avec un champ ; garder les choix avancés progressifs. Fournir interface, erreurs et dates en anglais et français ; accepter la virgule décimale française et normaliser le stockage.
- Séparer **format de données** (structure et couleur), **entrée** (valeurs) et vue ou action (exploitation).

## Direction et état de livraison

Garder la collection comme conteneur unique. Les objets et objets-variables appartiennent d'abord à une collection ; leur copie, partage ou déplacement vers une autre collection, comme celui d'un format de données, exige un choix explicite de la cible. Ne pas créer de « types de collection » permanents.

Les unités, objets et références, transferts, vues, tâches, agenda et premières formules, analyses, graphiques, modèles et liens entre entrées sont livrés avec les limites indiquées dans [l'état d'implémentation](docs/ETAT_IMPLEMENTATION.md). Les stocks, prévisions et mises en relation restent futurs. Ne pas présenter une idée future comme disponible.

Lire [la direction produit](COLLECTIONS_DIRECTION.md) pour la philosophie et les décisions ouvertes. Pour une tâche Txx, lire uniquement `docs/tasks/Txx.md` et `docs/tasks/_PRINCIPES.md` ; [l'index](ROADMAP_BRAINY.md) donne les dépendances et l'état.

## Carte du dépôt

- `api/` : GraphQL `src/collections/*resolver.ts`, `*.input.ts` et `src/auth/` ; MongoDB `*.schema.ts` ; messages EN/FR dans les services ; fumées `scripts/`.
- `brainy_web_app/` : GraphQL `lib/api.ts`, modèles/traductions `lib/brainy.ts`, écran `app/brainy-app.tsx` ; pas de tests autonomes, fumée web dans `api/scripts/web-smoke.mjs`.
- `brainy/` : GraphQL/modèles `lib/collections_api.dart`, traductions `lib/app_strings.dart`, écran `lib/workspace_screen.dart`, tests `test/`.

## Vérifications

- API : `npm run typecheck` dans `api/` ; pour GraphQL, fumée `docker compose exec -T api npm run smoke:collections` ou `smoke:auth` à la racine.
- Web : `npm run lint`, `npx tsc --noEmit`, `npm run build` dans `brainy_web_app/` ; proxy : `npm run smoke:web` dans `api/` avec services actifs.
- Flutter : `flutter analyze`, puis `flutter test test/<fichier>.dart` dans `brainy/` ; `flutter test` au palier.
- Documentation : `node scripts/verifier-docs.mjs` ; roadmap : `node scripts/verifier-contenu-roadmap.mjs` à la racine.
- Fin de tâche : contrôles ciblés ; fin de palier : suite complète. Voir aussi les « Checks » du [README](README.md).

## Travailler économe

- Une tâche par session : lire ce guide, `Txx.md`, `_PRINCIPES.md`, le contrat utile et les seuls fichiers concernés.
- Chercher par chemin et motif ; éviter les fichiers entiers et exclure `node_modules`, `.next`, `.dart_tool`, `build` et le généré.
- Grouper les changements ; ne pas relire le texte écrit ; ne pas changer verrous ou dépendances sans accord.
- Raisonnement moyen par défaut, bas pour petits textes/écrans, élevé pour architecture, migration ou sécurité, selon la session.
- Demander avant d'élargir ; signaler les dépendances manquantes. Fin de tâche : actualiser Txx et l'index, puis résumer fichiers, contrôles et décisions en dix lignes au plus.

## Reprise après interruption

- Au départ : lire `docs/REPRISE_CODEX.md`, `git status --short`, `git log --oneline -5` ou lancer `node scripts/etat-reprise.mjs` ; suivre « Prochaine action ».
- Mettre le journal à jour après chaque étape et avant build long, migration ou action irréversible ; noter intention puis résultat. Commiter souvent (`wip:` permis), sans secrets.
- Garder les scripts relançables. Après coupure, vérifier les fichiers ; restaurer depuis Git seulement ceux qui sont corrompus.
- À la fin : statut de tâche et index à jour, journal « aucune tâche en cours », commit final. Le journal prime sur la mémoire du fil.
