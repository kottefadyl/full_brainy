# T02 — socle UX, design et langues

Date : 21 octobre 2026. Référence pour les composants web Next.js et Flutter mobile/ordinateur. Les valeurs écrites par les utilisateurs restent dans leur langue d'origine.

## Parcours novice

1. « Nouvelle collection » : nom, premier format de données, couleur pastel obligatoire, un champ Titre déjà proposé.
2. « Créer la collection » mène immédiatement à « Nouvelle entrée ». Les champs avancés, les unités, les choix et les capacités futures ne sont montrés que lorsque l'utilisateur les demande.
3. Après enregistrement, la ligne affiche la date de création, le format de données et un résumé compact. Ouvrir l'édition pour la valeur complète ; « Copier l'entrée » produit un texte lisible.
4. Modifier un format de données présente le nombre d'entrées concernées. Renommer, réorganiser et ajouter des champs sont directs ; les changements touchant des valeurs sauvegardées sont refusés par l'API avec une erreur traduite.

## Composants et règles communs

| Composant | Règle |
| --- | --- |
| Navigation | Collection active évidente ; création accessible sans menu profond ; retour clair sur mobile. |
| Ligne d'entrée | Hauteur compacte, date visible, couleur pastel du format, texte abrégé seulement dans la liste ; actions accessibles par clavier et toucher. |
| Détail/éditeur | Tous les champs renseignés et leur unité visibles ; choix adaptés au type ; erreurs près du formulaire. |
| Format de données | Nom, couleur, liste ordonnée des champs ; actions explicites « Modifier » et « Changer la couleur ». |
| État vide | Une action principale : créer une collection ou écrire une entrée. |
| Chargement/erreur | Indicateur, texte compréhensible et action de réessai ; ne pas effacer la saisie après une erreur API. |
| Confirmation | Décrire l'effet d'une suppression ou migration avant de l'exécuter. |

Vérifier les largeurs 320, 390, 760 et 1200 px. Sur web, les grilles de champs deviennent verticales à petite largeur ; les commandes de déplacement et d'édition gardent un focus visible. Sur Flutter, la largeur utile dépend de `LayoutBuilder`, les dialogues défilent et les actions utilisent `IconButton`/`FilledButton`. Les lignes peuvent être fines tout en gardant des cibles d'action suffisamment grandes. Tester le clavier, le lecteur d'écran, le contraste texte/fond et l'agrandissement du texte.

Le visuel reste inspiré de la sobriété Fedora : bleu clair, contours discrets, fonds très légers, typographie lisible. Il ne copie pas une interface Fedora. L'anglais emploie **data format** et le français **format de données** dans les libellés, erreurs et titres. Dates, nombres et heures s'affichent dans la langue du client ; les unités et données créées par l'utilisateur ne sont pas traduites.
