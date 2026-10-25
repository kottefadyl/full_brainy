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

- Pour chaque nouvel écran ou changement visuel, s'inspirer des plus belles interfaces de Fedora Linux : composition aérée, hiérarchie nette, formes douces, palette harmonieuse et détails soignés. L'ensemble doit être beau, moderne et facile à utiliser, sans copier une interface Fedora à l'identique.
- Privilégier des couleurs douces et des fonds pastel très légers pour distinguer les formats de données. Ajouter de légères touches de transparence aux surfaces appropriées, comme les panneaux ou les fenêtres, avec parcimonie. Garder le texte, les icônes et les actions bien lisibles sur ces fonds, en thème clair comme en thème sombre si celui-ci est proposé.
- Conserver cette même direction visuelle sur le web Next.js et sur Flutter mobile/ordinateur. Adapter les espacements et les contrôles à chaque taille d'écran ; la beauté ne doit pas compliquer la navigation, la saisie ou l'accessibilité.
- Favoriser des libellés compréhensibles, des choix progressifs et des exemples concrets. Les novices doivent pouvoir commencer avec un seul champ ; les utilisateurs avancés peuvent mélanger plusieurs types de champs et plusieurs formats de données.
- L'interface, les erreurs et les dates affichées sont disponibles en anglais et en français. La saisie française des nombres accepte la virgule décimale ; les valeurs sont normalisées pour le stockage.
- Préserver la séparation entre un **format de données** (structure et couleur), une **entrée** (valeurs enregistrées) et une éventuelle **vue ou action** future (façon d'exploiter ces valeurs).

## Direction et état de livraison

Garder la collection comme conteneur unique. Les objets et objets-variables appartiennent d'abord à une collection ; leur copie, partage ou déplacement vers une autre collection, comme celui d'un format de données, exige un choix explicite de la cible. Ne pas créer de « types de collection » permanents.

Les unités, objets et références, transferts, vues, tâches, agenda et premières formules, analyses, graphiques, modèles et liens entre entrées sont livrés avec les limites indiquées dans [l'état d'implémentation](docs/ETAT_IMPLEMENTATION.md). Les stocks, prévisions et mises en relation restent futurs. Ne pas présenter une idée future comme disponible.

Lire [la direction produit](COLLECTIONS_DIRECTION.md) pour la philosophie et les décisions ouvertes. Pour une tâche Txx, lire uniquement `docs/tasks/Txx.md` et `docs/tasks/_PRINCIPES.md` après leur création ; avant cela, consulter [la feuille de route](ROADMAP_BRAINY.md).
