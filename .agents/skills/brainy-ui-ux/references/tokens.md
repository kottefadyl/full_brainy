# Tokens Brainy : proposition de départ

Réconcilier avec le thème existant avant modification. Centraliser les valeurs ; ne pas les recopier dans chaque composant. Les captures Fedora servent à la direction, pas à mesurer des pixels ni à extraire une palette officielle.

| Rôle | Clair | Sombre doux |
|---|---|---|
| canvas | #F5F6F8 | #1B1D22 |
| surface | #FFFFFF | #24272E |
| surface élevée | #FFFFFF | #2D313A |
| hover neutre | #E9EDF3 | #353B46 |
| texte principal | #20242C | #F1F3F7 |
| texte secondaire | #545E6D | #B5BECC |
| séparateur décoratif | #DDE2EA | #3E4653 |
| bord contrôle nécessaire | #778293 | #7B8799 |
| action primaire | #2463CE | #96BDFF |
| texte sur action | #FFFFFF | #142443 |
| focus | #2463CE | #A9CBFF |
| texte danger | #B42332 | #FFADB5 |

Mesurer après composition des états et transparences. Ne pas employer un séparateur décoratif comme seule limite d'un champ. Donner au focus un contour 2 unités avec décalage 2, ajuster si la surface adjacente le demande. Distinguer la sélection par fond + indicateur/forme et sémantique.

- Espacement : 4, 8, 12, 16, 24, 32, 48. Padding page étroite 16, bureau 24–32 ; espacement champ 16 ; groupes 24–32.
- Rayons : contrôle 10, groupe/carte 14, dialogue 18. Réserver le cercle aux avatars et boutons icône ; la pilule aux filtres courts si pertinente.
- Typographie : police système du projet, corps 16/1,5, métadonnées 13–14/1,4, titre section 20/1,3, titre page 24–28/1,2. Limiter à 3 niveaux visibles et 2 graisses usuelles. Respecter mise à l'échelle et glyphes FR.
- Tailles : contrôle 44 web / 48 Flutter sur tactile ; ligne compacte à hauteur minimale 48 avec croissance selon contenu. Jamais de hauteur fixe qui coupe le texte agrandi.
- Largeurs : formulaire environ 560, dialogue simple 440–560, éditeur complexe 720–880 maximum ; utiliser l'espace disponible pour listes/tableaux sans étirer les champs inutilement.
- Ombre : aucune par défaut sur les lignes ; légère seulement sur surfaces flottantes. En sombre, faire porter la séparation d'abord par surface et contour.

## Couleurs de formats de données

Réutiliser la palette canonique existante de 24 couleurs. Construire si nécessaire une table thème clair/sombre indexée par identifiant de couleur, sans modifier le stockage. Pour chaque teinte, choisir un fond sombre désaturé et un texte qui passe le contraste ; conserver un repère coloré et le nom du format de données. Tester les 24 associations, la sélection, le focus et les états désactivés. Ne pas annoncer cette table prête tant qu'elle n'est pas mesurée.

## Adaptation technique

Web : mapper les rôles sur variables CSS et attribut de thème existant ; honorer système par défaut et choix explicite persistant. Éviter le flash de thème au chargement. Utiliser composants sémantiques existants et media query de mouvement réduit.

Flutter : mapper les mêmes rôles sur `ThemeData`/`ColorScheme` et, au besoin, `ThemeExtension` pour les couleurs métier ; utiliser `ThemeMode`, `Focus`, `Semantics` et contrôles existants. Ne pas copier mécaniquement du CSS en Dart. Lire les API disponibles dans la version installée avant implémentation.
