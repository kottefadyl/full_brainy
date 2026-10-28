# T34 — contrat de capture et de saisie rapide

Une capture crée une entrée ordinaire dans une collection choisie, sous un format de données comportant au moins un champ adapté au contenu. Le lien ou texte reçu est conservé tel quel ; aucune requête n'est envoyée à sa page. La date de création est celle de l'entrée enregistrée par l'API. Une note facultative donne le contexte et reste indexée par la recherche des entrées. Une image ou un fichier utilise un champ pièce jointe et les limites existantes de 2 MiB par fichier et 8 MiB par entrée.

Le navigateur reçoit les liens et textes par l'URL de capture d'une application installable ou par un marque-page ; l'utilisateur choisit la collection et le format de données si nécessaire. Android reçoit les données par `ACTION_SEND` et les transmet au dialogue Flutter. L'ordinateur accepte le presse-papiers. iOS n'a pas d'extension native dans T34 : la capture par collage dans l'application reste disponible.

Le choix par défaut et les modèles de saisie sont des préférences locales à l'appareil, jamais des types de collection. La création d'entrée et le dédoublonnage sont contrôlés par l'API du compte. Un doublon de lien produit un avertissement et deux actions explicites : ouvrir l'entrée existante ou enregistrer malgré tout. Les données saisies restent dans le dialogue après toute erreur réseau ; aucune file hors ligne n'est annoncée avant T29.

Un modèle de saisie est lié à l'identifiant stable d'un format de données et de ses champs. Il propose des valeurs initiales, les champs repliés et la date du jour, sans changer les règles de validation de l'API. « Dupliquer la dernière entrée » crée une nouvelle entrée avec une nouvelle date de création. Les suggestions de valeurs fréquentes proviennent uniquement des entrées du compte connecté dans la collection et le format choisis ; elles ne sont pas envoyées à un tiers.

La capture n'ajoute aucun type au stockage : l'export et l'import T07 conservent les entrées et pièces jointes par leurs chemins existants. Les préférences locales se reconfigurent après import ; elles ne sont pas incluses dans l'export de données.
