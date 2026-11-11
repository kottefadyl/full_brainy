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
- À la première connexion sans profil complété, Brainy demande le nom, la profession, le poste actuel, le domaine d'études, les centres d'intérêt et les loisirs. Profession, poste et études sont facultatifs ; il faut au moins un centre d'intérêt ou un loisir (l'ajustement A1 prévoit de rendre centres d'intérêt et loisirs facultatifs sur décision produit tant que T33 n'est pas livrée). Le profil reste modifiable.
- Photo de profil facultative (JPEG, PNG ou WebP, 1 Mio au plus, contrôlée par l'API) : les clients compressent en JPEG une photo plus lourde avant l'envoi. La photo (ou l'initiale) et le nom s'affichent dans la barre supérieure (photo seule sur téléphone) et ouvrent le profil. Profession et poste proposent une longue liste de métiers ; centres d'intérêt et loisirs, des listes de suggestions en puces. La saisie libre reste toujours permise. Les listes EN/FR se modifient dans `scripts/profile-suggestions/*.txt`, puis `node scripts/profile-suggestions/generate.mjs`.
- Après le profil, un guide de bienvenue de 5 pages ([T50](docs/tasks/T50.md)) présente la langue de Brainy, l'usage quotidien, le caractère privé des données et la vision à long terme, puis crée la première collection ; il n'est montré qu'une fois par compte et se rouvre depuis « Autres actions ». « Guide et formation » ([T51](docs/tasks/T51.md)), dans le même menu, explique Brainy en 12 chapitres EN/FR avec captures ; le contenu se modifie dans `scripts/guide/content.mjs`, puis `node scripts/guide/generate.mjs`.
- **Collaborateurs** ([T52](docs/tasks/T52.md)) : chaque personne a un lien de collaboration personnel et révocable ; l'accepter rend deux personnes collaboratrices sans donner accès à aucune donnée. Seul le propriétaire partage une collection, et seulement avec un collaborateur, en « Lecture seule » ou « Lecture et écriture » (entrées seulement) ; elle apparaît alors sous « Partagées avec moi ». Mettre fin à une collaboration retire tous les partages dans les deux sens. Dans une collection partagée, chaque entrée et chaque format de données montre en haut à gauche la photo et le nom de son créateur et du dernier modificateur, sauf en vue tableur ([T53](docs/tasks/T53.md)).
- Ces informations sont privées et préparées pour une éventuelle mise en relation entre utilisateurs ([T33](docs/tasks/T33.md)). La mise en relation n'est pas encore disponible ; ne pas présenter le profil comme public.
- Les collections et entrées appartiennent au compte connecté. L'API contrôle cet accès.

## Collections, formats de données et entrées

1. Une **collection** possède un nom. Elle sert de conteneur aux formats de données et aux entrées. Son nom peut être modifié ; sa suppression retire aussi ses entrées.
2. Une collection possède de 1 à 24 **formats de données** nommés. Chaque format de données possède ses propres champs et une couleur pastel choisie obligatoirement dans la palette. Deux formats de données d'une même collection ne peuvent pas partager la même couleur. La couleur peut être changée plus tard.
3. Un format de données possède de 1 à 30 champs. Les noms de champs sont uniques au sein de ce format, sans distinction de casse. Types disponibles : titre, date, nombre, heure, lien web, caractère unique, texte, texte long, case à cocher (oui/non), choix unique ou multiple, date et heure, durée, pièce jointe et référence d'objet. Un champ nombre peut être sans unité, utiliser une unité proposée ou une unité personnalisée. L'unité appartient à la définition du champ. Les pièces jointes sont limitées à 2 MiB par fichier et 8 MiB par entrée.
4. Lors de la création d'une **entrée**, l'utilisateur choisit un format de données de la collection et renseigne au moins un de ses champs. L'entrée ne contient que des valeurs des champs de ce format. Le format de données d'une entrée existante ne change pas lors de sa modification.
5. L'entrée reprend le fond pastel de son format de données. La date de création doit être facile à repérer ; la date de modification apparaît si l'entrée a été modifiée. L'utilisateur peut modifier, supprimer et copier une entrée. La copie produit du texte lisible avec les champs renseignés et les unités des nombres.
6. Les entrées se présentent comme des lignes compactes et lisibles, y compris sur petit écran. Le contenu complet reste accessible par l'édition et la copie, même si une valeur longue est abrégée dans la liste.
7. Les anciennes collections sans formats de données sont rattachées à un format de données général afin de préserver leurs entrées.
8. Un format de données existant peut être renommé, recevoir de nouveaux champs ou changer l'ordre des champs. Un champ contenant des valeurs enregistrées ne peut pas être supprimé ni changer de type ou d'unité ; ses choix existants restent disponibles. L'API utilise une version de format pour refuser une modification sur un état périmé.
9. Une collection peut posséder des unités locales et des formats de données marqués comme modèles d’objets. Un objet est une entrée nommée d’un de ces formats, avec identité stable, caractéristiques, duplication et historique de modifications. Un modèle proposé par Brainy est copié dans la collection choisie. Convertir un format déjà rempli en modèle d’objets demande un aperçu et une confirmation ; une entrée sans titre ne peut devenir objet. La duplication conserve le nom saisi. L’action « Utiliser dans une entrée » crée un résumé figé dans un format de données ordinaire avec un lien interne vers l’objet source. Un champ de référence typé permet aussi de choisir un ou plusieurs objets dans une entrée, en mode valeur actuelle ou instantané ; un objet-variable utilise ces références sans créer de stock.
10. Une collection peut définir des règles de mouvements de stock explicites et idempotentes (entrée, sortie, transfert, correction avec aperçu avant validation et stock courant dérivé des mouvements, [T26](docs/tasks/T26.md)) ainsi que des premières prévisions explicables (moyenne ou tendance linéaire avec période tenue à l'écart, [T27](docs/tasks/T27.md)), toujours séparées des observations réelles.
11. Un format de données peut n'accepter qu'**une seule entrée** et limiter ses **parents autorisés** (relation parent-enfant de T37) ; l'API refuse les écarts. Le modèle Livre s'en sert ([T47](docs/tasks/T47.md)) ; sa **vue livre** n'existe que dans les collections créées depuis ce modèle (`templateId`, simple provenance) et une fois activée. La mise en forme y reste du Markdown léger dans le texte long.
12. Dans une collection créée depuis le modèle « Liens conservés », un champ lien contenant une adresse web affiche un aperçu (image, titre, description, site) obtenu par l'API de façon sûre et mis en cache ([T48](docs/tasks/T48.md)).
13. Le modèle « Liste de tâches » ajoute des vues Jour et Calendrier ([T49](docs/tasks/T49.md)) : chaque tâche est faite une seule fois sur une période ou revient (chaque jour, tous les N jours, certains jours, chaque semaine, chaque mois) ; une tâche qui revient se coche jour par jour et un jour oublié reste manqué. Ces vues n'existent que pour ce modèle.

## Expérience et langage

- Sur les deux clients, suivre la direction [visuelle et linguistique](docs/EXPERIENCE_BRAINY.md) : sobriété Fedora sans copie, hiérarchie claire, thèmes clair et sombre soignés, fonds pastel, lisibilité et accessibilité sur tout écran.
- Pour toute tâche UI/UX, lire et appliquer `.agents/skills/brainy-ui-ux/SKILL.md` ; vérifier le rendu clair/sombre et le parcours principal, puis signaler les vérifications non exécutées.
- Permettre aux novices de commencer avec un champ ; garder les choix avancés progressifs et masquer le jargon technique (ex. « objet-variable ») derrière des libellés naturels. Fournir interface, erreurs et dates en anglais et français ; accepter la virgule décimale française et normaliser le stockage.
- Séparer **format de données** (structure et couleur), **entrée** (valeurs) et vue, règle ou action (exploitation).

## Direction et état de livraison (T01 à T32 et T34 à T53 livrés ; T33 prévue)

Garder la collection comme conteneur unique. Les objets et objets-variables appartiennent d'abord à une collection ; leur copie, partage ou déplacement vers une autre collection, comme celui d'un format de données, exige un choix explicite de la cible. Ne pas créer de « types de collection » permanents ni promettre de conformité légale, médicale, fiscale ou industrielle.

Le socle **T01 à T27** (unités, objets, références, transferts, vues, tâches, agenda, rappels, formules, analyses, graphiques, modèles, liens entre entrées, mouvements de stock locaux et premières prévisions) est livré avec les limites décrites dans [l'état d'implémentation](docs/ETAT_IMPLEMENTATION.md). Les tâches **T28 à T32** (droits, sauvegarde/hors-ligne, traitements asynchrones, charge, connecteurs) et les **primitives Brainy 1.1 de T34 à T45** (capture rapide, opérations d'analyse extensibles, champ mesure, relations/composition, géographie, classifications, flux d'états, collecte tierce en quarantaine, registre non modifiable, sensibilité/seuils d'agrégat, données lourdes S3 et paquets de domaine) sont livrées avec les limites de leur fiche `docs/tasks/Txx.md`. Restent à livrer **T33** (mise en relation) et les sous-tâches ouvertes de [l'audit](docs/AUDIT_LACUNES_ET_CORRECTIFS_BRAINY.md) ; l'état de chaque tâche est dans [l'index](ROADMAP_BRAINY.md). Ne jamais présenter une tâche prévue comme déjà disponible.

Lire [la direction produit](COLLECTIONS_DIRECTION.md) pour la philosophie 1.0/1.1 et les décisions ouvertes. Pour exécuter une tâche `Txx`, lire uniquement `docs/tasks/Txx.md` et `docs/tasks/_PRINCIPES.md`.

## Carte du dépôt et règle de modularité

- `api/` (dépôt Git propre) : GraphQL `src/collections/*resolver.ts`, `*.input.ts` et `src/auth/` ; MongoDB `*.schema.ts` ; logique `collections.service.ts`, `unit_math.ts`, `time_math.ts` ; fumées `scripts/`.
- `brainy_web_app/` (dépôt Git propre) : GraphQL `lib/api.ts`, modèles/traductions `lib/brainy.ts`, écran `app/brainy-app.tsx` et dialogues `app/*-dialog.tsx` ; fumée `api/scripts/web-smoke.mjs`.
- `brainy/` (dépôt Git propre) : API/modèles `lib/collections_api.dart`, traductions `lib/app_strings.dart`, écran `lib/workspace_screen.dart` et vues dédiées `lib/*.dart`, tests `test/`.
- **Anti-monolithe obligatoire :** ne pas alourdir `workspace_screen.dart` (> 4 400 lignes), `brainy-app.tsx` ni `collections.service.ts`. Isoler toute nouvelle capacité (T34–T45, T28–T33) dans un fichier dédié par domaine ou composant et le brancher par une interface minimale.

## Vérifications

- API : `npm run typecheck` dans `api/` ; fumées `npm run smoke:collections`, `smoke:auth` ou `smoke:stock-forecast` dans `api/`, API démarrée (`node scripts/dev-local.mjs` à la racine ; MongoDB est un service local).
- Web : `npm run lint`, `npx tsc --noEmit`, `npm run build` dans `brainy_web_app/` ; proxy : `npm run smoke:web` dans `api/`.
- Flutter : `dart analyze <fichiers_modifiés>` (ou `flutter analyze`), puis `flutter test test/<fichier>.dart` dans `brainy/` ; `flutter test` complet au palier.
- Documentation : `node scripts/verifier-docs.mjs` ; roadmap : `node scripts/verifier-contenu-roadmap.mjs` à la racine.
- Fin de tâche : contrôles ciblés sur les seuls fichiers touchés ; fin de palier : suite complète. Voir aussi les « Checks » du [README](README.md).

## Travailler économe et à plusieurs IA (sans conflit)

- **Une tâche par session :** lancer d'abord `node scripts/etat-reprise.mjs` (1 seul appel inspecte le journal et les 4 dépôts Git). Lire ensuite uniquement ce guide, `docs/tasks/Txx.md`, `docs/tasks/_PRINCIPES.md` et les plages de lignes utiles des fichiers concernés.
- **Économie de jetons :** chercher par chemin et motif précis ; ne jamais lire de gros fichiers en entier (`StartLine`/`EndLine` obligatoires sur les gros fichiers) ; exclure `node_modules`, `.next`, `.dart_tool`, `build` ; grouper les éditions ; ne pas relire un fichier qui vient d'être écrit ; ne toucher ni aux dépendances ni aux verrous sans accord.
- **Raisonnement adapté :** bas pour textes EN/FR et retouches UI ; moyen par défaut ; élevé uniquement pour architecture, migrations ou sécurité (T28, T29, T35–T37, T42, T43).
- **Coordination Multi-IA et reprise (`docs/REPRISE_CODEX.md`) :**
  1. Garder `docs/REPRISE_CODEX.md` **sous 2 Kio** en le réécrivant sur place (l'historique détaillé vit dans Git et `docs/tasks/`).
  2. Au début d'une intervention, y inscrire l'`Agent actif`, la `Tâche verrouillée`, les `Fichiers réservés` et l'intention. Deux IA travaillant en parallèle doivent réserver des fichiers disjoints ; à tour de rôle, la seconde IA reprend exactement à la ligne `Prochaine action :` sans refaire les étapes validées.
  3. Mettre à jour le journal après chaque sous-étape et **avant** tout build long, migration ou action irréversible. Commiter dans le sous-dépôt concerné (`api/`, `brainy_web_app/`, `brainy/`) et à la racine (`wip:` permis, jamais de secrets).
  4. En fin de tâche : actualiser `docs/tasks/Txx.md` et `ROADMAP_BRAINY.md`, remettre le journal à `Aucune tâche en cours`, commiter et répondre en 10 lignes au plus.
