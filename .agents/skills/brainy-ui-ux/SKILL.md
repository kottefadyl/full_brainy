---
name: brainy-ui-ux
description: Concevoir, implémenter et auditer les interfaces Brainy Next.js et Flutter, composants, formulaires, placement des actions, coque d'application, responsive, thèmes clair/sombre, couleurs, graphiques et animations. Utiliser pour toute création ou retouche UI/UX Brainy et toute demande de style Fedora/GNOME. Appliquer une direction sobre mais vivante, accueillante, colorée avec mesure, accessible et économe en contexte.
---

# Brainy UI & UX

## Contrat de travail

1. Lire les instructions du dépôt, puis uniquement les extraits utiles de `docs/EXPERIENCE_BRAINY.md`, du composant concerné et de ses tokens. Respecter la reprise et les réservations de fichiers du projet. Ne pas supposer que les fichiers cités existent ; signaler les absences utiles. Ne pas demander de décision pour un choix visuel réversible couvert ici.
2. Identifier en trois lignes maximum : tâche de l'utilisateur, action principale, contexte écran/plateforme. Corriger le parcours avant de décorer. Ne pas réinventer l'écran entier pour un défaut local.
3. Réutiliser les composants et tokens existants. Pour une première fondation ou un changement de thème, lire [tokens.md](references/tokens.md) ; pour formulaires, navigation, listes ou modales, lire seulement la section pertinente de [patterns.md](references/patterns.md). Ces valeurs sont des choix Brainy proposés, pas des valeurs officielles Fedora.
4. Implémenter une solution cohérente et ses états. Vérifier visuellement les surfaces modifiées selon la recette ci-dessous. Corriger les défauts observés ; conclure avec changements, vérifications et limites réelles.

## Direction visuelle : sobre mais vivante

Objectif : une interface professionnelle, rassurante et accueillante, jamais austère ni intimidante. La clarté Fedora/GNOME (coins doux, bleu mesuré, hiérarchie nette) reste la base ; on y ajoute de la chaleur par la couleur, la profondeur et le mouvement doux.

- **Couleur.** Un seul accent d'action (bleu) ; rouge réservé à danger/erreur. Teintes secondaires par catégorie (violet = structure et modèles, turquoise = gouvernance et sécurité, ambre = avertissements doux, rose = accents rares) uniquement pour tuiles d'icône, pastilles et repères décoratifs, jamais pour des actions. Canvas légèrement teinté (pas de blanc ni de noir purs), surfaces distinctes du canvas. Les couleurs des formats de données identifient les données, pas des actions.
- **Dégradés et profondeur.** Autorisé : dégradé très doux (accent à 8–14 % d'opacité vers la surface) sur l'en-tête de collection, les états vides, la connexion et les tuiles d'icône ; ombres douces sur cartes et surfaces flottantes. En sombre, séparer d'abord par surface et contour, ombre légère seulement sur les surfaces flottantes. Interdits : verre flouté, halos, cartes imbriquées, dégradés derrière les données courantes, bouton pilule sur chaque ligne.
- **Illustrations.** Pastel et formes arrondies (SVG inline simple) dans l'accueil, la connexion et les états vides ; jamais derrière les données courantes. Ne pas copier le logo Fedora, la barre système ou le dock.
- **Rythme.** Grille de 4/8 unités ; rapprocher ce qui appartient ensemble, séparer les sections davantage que leurs éléments ; échelle cohérente de taille, rayon et ombre.
- **Actions.** Une action primaire pleine par zone de travail active ; actions près de leur objet, sans répéter le même CTA ; actions rares dans un menu nommé et accessible.
- **Thème sombre.** Vrai gris charbon à couches distinctes (canvas < surface < surface élevée < dialogue), texte secondaire lisible, teintes pastel désaturées. Ne pas inverser automatiquement : vérifier chaque combinaison réelle, y compris hover, focus et sélection. Mêmes règles d'élévation en clair.

## Coque d'application (web ; équivalents Flutter plus bas)

- Sur bureau, la barre latérale est fixe sur toute la hauteur de la fenêtre (100dvh) et ne défile jamais avec la page. Seule la liste des collections défile à l'intérieur (min-height 0, scrollbar fine). Recherche en haut ; « New collection », « More actions » et compte restent toujours visibles en bas.
- La colonne droite est l'unique conteneur de défilement ; la barre supérieure y reste collée. Les menus (« More actions », etc.) s'ouvrent en popover par-dessus, sans pousser ni réduire la liste.
- Adapter tout code lié au défilement de `window` (retour de défilement, ancres, observateurs, focus à rendre visible, modales) au conteneur réel.
- Petit écran : tiroir accessible (bouton de 44, focus piégé et restauré, Échap), aucune barre basse pour des actions qui ne sont pas des destinations principales.

## Composants Brainy

- **Cartes de formats de données.** Rayon 14, fond teinté de la couleur du format (clair et sombre), liseré supérieur fin ou tuile d'icône colorée, jamais de grosse barre latérale sombre. Titre en 600, sous-titre « N champs · M entrées ». Puces de champ discrètes (nom en 600, type en texte secondaire, sans bord dur). Une action principale « Add entry » en bouton tonal + un menu ⋯ nommé (modifier, changer la couleur, dupliquer, copier le lien). Pas de rangée de boutons carrés à gros contour. Grille auto-fill, cartes de même hauteur par ligne, survol élevé de 2px.
- **Lignes d'entrée.** Compactes, fond teinté du format, repère coloré, titre en 600 sur la largeur disponible, métadonnées lisibles (13 px minimum, jamais minuscule en gris), puce avec le nom du format, date de création et modification si applicable. Actions Détails et menu ⋯ de 44, accessibles sans survol ; suppression séparée et en danger.
- **Sélecteurs.** Pas de liste ouverte native du système sur les écrans principaux : composant listbox accessible (bouton + popover, flèches, saisie rapide, Échap, focus restauré). Jamais de code hexadécimal visible : afficher une pastille de couleur et son nom (table centrale des 24 couleurs avec noms EN/FR).
- **Cartes d'outils.** Une icône distincte par outil, tuile colorée par catégorie. Aucune icône dupliquée.
- **Graphiques et résultats.** Un seul résultat : carte « chiffre clé » (grand nombre, unité, libellé, date). Plusieurs points : courbe ou barres avec points visibles, grille discrète, axes lisibles, légende, info-bulle, palette de 8 séries testée en daltonisme, marqueurs ou traits distincts en plus de la couleur. Libellés humains ; détails techniques dans un résumé repliable. Hauteur adaptée au contenu, états vide/chargement/erreur.
- **États.** Vide : carte douce, icône, phrase chaleureuse, prochaine action. Aucun résultat avec filtres : message dédié et « Clear filters ». Chargement : squelettes stables. Erreur : message concret et « Retry », données déjà visibles conservées. Bouton désactivé : texte d'aide visible qui explique pourquoi.

## Invariants Brainy

- Préserver collection → formats de données → entrées. Employer « format de données » / « data format », jamais « format » seul pour cette entité. Garder les noms saisis intacts.
- Afficher les entrées en lignes compactes, avec date de création repérable et date de modification si applicable. Abréger les valeurs longues sans perdre l'accès au contenu par édition et copie.
- Conserver la palette existante de 24 couleurs et l'identité stable du format de données entre thèmes ; adapter sa représentation, pas sa valeur métier. Ne pas fusionner deux couleurs distinctes dans le thème sombre. Ajouter nom ou indicateur pour ne pas dépendre seulement de la couleur.
- Commencer simplement avec un champ ; révéler progressivement unités, références et réglages avancés. Ne pas transformer une création de note en assistant de configuration complet.
- Maintenir EN/FR, dates locales, unités et saisie décimale française. Distinguer valeur vide, zéro et estimation. Ne pas afficher de fonctions planifiées comme disponibles ni rendre public un profil privé.
- Garder mêmes sens, capacités et tokens sur Next.js et Flutter ; adapter navigation et interactions à la plateforme. Ne pas modifier API, règles métier ou dépendances pour une retouche esthétique. Isoler les composants au lieu d'agrandir les écrans monolithiques.

## Accessibilité et comportement

- Employer les contrôles sémantiques : bouton pour action, lien pour navigation, checkbox pour choix, switch pour réglage immédiat. Nommer les icônes interactives ; rendre les actions accessibles sans survol.
- Viser WCAG 2.2 AA : contraste texte normal ≥ 4,5:1, grand texte ≥ 3:1, limites/états nécessaires des contrôles ≥ 3:1. Mesurer les combinaisons effectives (y compris texte sur dégradé et sur teinte), pas seulement la palette. Ne pas présenter un contrôle visuel comme une certification.
- Viser des cibles tactiles de 44 CSS px sur web, 48 unités logiques sur Flutter, même si l'icône reste petite. Ce sont les objectifs Brainy, distincts du minimum WCAG AA de 24 CSS px et de ses exceptions.
- Assurer ordre clavier logique, focus visible et non masqué (contour 2 px, décalage 2, arrondi comme l'élément), zoom texte, libellés persistants et erreurs associées. Restaurer le focus après fermeture d'une modale ; permettre Échap hors mutation bloquante justifiée. Expliquer les actions indisponibles sans dépendre d'un tooltip sur bouton désactivé.
- Prévoir normal, hover si pointeur, focus, pressé, désactivé, chargement, succès et erreur pour les contrôles touchés ; pour une vue, prévoir vide, chargement, données, erreur avec reprise. Ne jamais ajouter un bouton factice.

## Mouvement vivant et performant (web ; équivalents Flutter plus bas)

- Animer pour aider à comprendre et pour donner de la vie : ouverture, fermeture, sélection, survol, retour d'action. Durées : 100–140 ms feedback ; 160–220 ms popover/dialogue ; 200–280 ms panneau/page. Courbe de décélération simple, sans rebond marqué.
- Catalogue autorisé : survol élevé de 2 px avec ombre ; appui à l'échelle .98 ; indicateur de collection active et soulignement d'onglet qui glissent ; changement d'onglet/page en fondu + translation de 8 px ; accordéons à hauteur animée avec chevron qui tourne ; modales en fondu + échelle (.98 → 1) avec voile ; squelettes avec léger shimmer ; coche de succès avec petit « pop » ; toasts qui glissent ; bascule de thème avec icône qui pivote ; tracé d'un graphique en 400 ms au premier affichage ; cascade d'apparition limitée à 8 éléments (30 ms d'écart), une seule fois à l'affichage de la vue, jamais à chaque mise à jour.
- Sur web, privilégier opacity/transform ; sur Flutter, limiter la reconstruction au sous-arbre animé. Éviter animations permanentes, blur animé et layout recalculé à chaque frame. Ne jamais retarder une action réseau pour finir une animation.
- Respecter `prefers-reduced-motion` sur web et le réglage de réduction des animations de Flutter. Supprimer translations et échelles ; garder un fondu bref (≈80 ms) et un indicateur de progression perceptible.
- Ne pas installer de bibliothèque d'animation pour ces effets. Ne pas imposer une migration de framework ou de design system.

## Équivalents Flutter (Android, Windows, autres bureaux)

Mêmes sens, mêmes tokens, mêmes couleurs que le web ; ne jamais copier du CSS en Dart, adapter à la plateforme. Les sections « Direction visuelle », « Composants Brainy », « Invariants » et « Accessibilité » s'appliquent telles quelles ; les points ci-dessous traduisent la coque, le mouvement et la vérification.

- **Tokens.** ThemeData et ColorScheme pour les rôles standard ; ThemeExtension (par exemple BrainyColors) pour les teintes secondaires par catégorie, la table des 24 couleurs de formats de données clair/sombre, les dégradés et les ombres. ThemeMode : système par défaut + choix persistant. Aucune couleur en dur dans les widgets.
- **Coque.** Bureau (largeur ≥ 840) : Row avec barre latérale de largeur fixe (en-tête, Expanded(ListView) des collections, pied avec « New collection », « More actions » et compte, toujours visible) et zone principale avec son propre défilement ; la barre latérale ne défile jamais avec la page. Mobile (< 840) : Drawer ou NavigationDrawer, bouton d'ouverture de 48, SafeArea, bords de l'écran gérés. Décider par LayoutBuilder selon la largeur disponible, pas selon le nom de l'appareil.
- **Sélecteurs et menus.** DropdownMenu, MenuAnchor ou feuille inférieure (petit écran) stylés par le thème ; pastille de couleur + nom pour les couleurs, jamais de code hexadécimal visible. Dialogues : plein écran ou feuille inférieure sur mobile, dialogue centré sur bureau.
- **Animations.** Widgets implicites (AnimatedContainer, AnimatedSwitcher, AnimatedSize, TweenAnimationBuilder, AnimatedOpacity) avec les durées du catalogue ; courbe Curves.easeOutCubic ; pas de rebond marqué. Limiter la reconstruction au sous-arbre animé (RepaintBoundary pour les éléments animés). Réduction du mouvement : MediaQuery.disableAnimationsOf(context) ; si vrai, fondu bref ou changement instantané. Cascade d'apparition limitée à 8 éléments, une seule fois par affichage de vue.
- **Pointeur et tactile.** Survol uniquement si pointeur (MouseRegion/InkWell) ; sur Android, retour de pression (ripple) et cible de 48. Jamais d'action réservée au survol. Retour système (bouton/geste Retour) cohérent avec la navigation.
- **Clavier et accessibilité.** FocusTraversalGroup, Shortcuts/Actions et FocusableActionDetector pour le focus visible (contour 2, décalage 2) sur bureau ; Semantics avec noms sur les icônes interactives ; MediaQuery.textScaler pour l'agrandissement du texte ; aucune hauteur fixe qui coupe le texte agrandi ; clavier à l'écran qui ne masque ni champ ni action (resizeToAvoidBottomInset, SafeArea, défilement vers le champ actif).
- **Vérification Flutter.** dart analyze/flutter analyze sur les fichiers modifiés, flutter test ciblé, puis rendu réel sur Windows et sur Android (émulateur ou téléphone) en clair et sombre, 320/390 de large pour le mobile, ≥ 1280 pour le bureau, texte agrandi, mouvement réduit. Ne jamais annoncer un rendu vérifié sans exécution réelle.
- **Anti-monolithe.** Ne pas alourdir workspace_screen.dart ; créer des widgets dédiés (barre latérale, carte de format de données, ligne d'entrée, sélecteur, états vides) dans des fichiers séparés.

## Recette de livraison, proportionnée

- Examiner le rendu réel des zones touchées en clair et sombre : écran étroit à 320/390, puis bureau à 1280 de largeur selon la plateforme. Adapter au scope ; noter la parité restant à vérifier.
- Parcourir au moins le chemin principal, une erreur pertinente, le clavier, un libellé FR long et du texte agrandi. Vérifier absence de débordement, CTA visible, contenu non caché par clavier ou barre fixe, focus, contraste, réduction du mouvement, et que la barre latérale reste immobile sur une page longue.
- Corriger d'abord les blocages : action inaccessible, perte de saisie, contraste insuffisant, débordement, piège clavier. Puis harmoniser alignements, densité, couleur et états. Une compilation réussie ne prouve pas la qualité du rendu.
- Exécuter les contrôles ciblés prescrits par le dépôt ; préférer les tests existants. Ajouter un test seulement pour un comportement ou une régression significative. Ne pas inventer de capture, mesure ou validation. Si exécution impossible, dire précisément ce qui reste non vérifié.

## Budget de contexte

- Lire ce noyau puis au maximum la référence nécessaire ; ne pas charger tous les documents produit ni parcourir tous les liens. Chercher par chemin/motif, lire des plages courtes, ignorer sorties générées et dépendances.
- Réutiliser les décisions enregistrées et corriger un composant partagé plutôt que plusieurs copies. Traiter un parcours à la fois ; ne pas proposer trois variantes sauf demande.
- Ne pas lancer de sous-agents, génération d'images ou recherche web systématique. Consulter [sources.md](references/sources.md) uniquement pour une question de norme ou de compatibilité. Garder un rapport final court et honnête ; aucune promesse chiffrée d'économie de crédits.