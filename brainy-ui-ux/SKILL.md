---
name: brainy-ui-ux
description: Concevoir, implémenter et auditer les interfaces Brainy Next.js et Flutter, composants, formulaires, placement des actions, responsive, thèmes clair/sombre et animations. Utiliser pour toute création ou retouche UI/UX Brainy et toute demande de style Fedora/GNOME. Appliquer une direction sobre, accessible et économe en contexte.
---

# Brainy UI & UX

## Contrat de travail

1. Lire les instructions du dépôt, puis uniquement les extraits utiles de `docs/EXPERIENCE_BRAINY.md`, du composant concerné et de ses tokens. Respecter la reprise et les réservations de fichiers du projet. Ne pas supposer que les fichiers cités existent ; signaler les absences utiles. Ne pas demander de décision pour un choix visuel réversible couvert ici.
2. Identifier en trois lignes maximum : tâche de l'utilisateur, action principale, contexte écran/plateforme. Corriger le parcours avant de décorer. Ne pas réinventer l'écran entier pour un défaut local.
3. Réutiliser les composants et tokens existants. Pour une première fondation ou un changement de thème, lire [tokens.md](references/tokens.md) ; pour formulaires, navigation, listes ou modales, lire seulement la section pertinente de [patterns.md](references/patterns.md). Ces valeurs sont des choix Brainy proposés, pas des valeurs officielles Fedora.
4. Implémenter une solution cohérente et ses états. Vérifier visuellement les surfaces modifiées selon la recette ci-dessous. Corriger les défauts observés ; conclure avec changements, vérifications et limites réelles.

## Direction visuelle ferme

- Interpréter les références Fedora/GNOME : calme, surfaces mates, espaces réguliers, coins doux, bleu mesuré, texte hiérarchisé, contrôles groupés. Garder les illustrations pastel dans l'accueil ou les états vides, jamais derrière les données courantes. Ne pas copier le logo Fedora, la barre système ou le dock dans Brainy.
- Employer un seul accent d'action ; réserver rouge à danger/erreur. Les couleurs des formats de données identifient les données, pas des actions. Éviter dégradés omniprésents, verre flouté, halos, cartes imbriquées et bouton pilule sur chaque ligne.
- Aligner les bords et les groupes sur une grille de 4/8 unités. Rapprocher ce qui appartient ensemble ; séparer les sections davantage que leurs éléments. Garder une échelle cohérente de taille, rayon et ombre.
- Définir une action principale par zone de travail active. Placer les actions près de leur objet, sans répéter le même CTA dans chaque zone. Conserver navigation, titre et actions dans des positions stables ; masquer les actions rares dans un menu nommé et accessible.
- Construire un vrai thème sombre gris charbon : couches distinctes, texte secondaire lisible, teintes pastel atténuées. Ne pas inverser les couleurs automatiquement ; vérifier chaque combinaison réelle, y compris hover, focus et sélection.

## Invariants Brainy

- Préserver collection → formats de données → entrées. Employer « format de données » / « data format », jamais « format » seul pour cette entité. Garder les noms saisis intacts.
- Afficher les entrées en lignes compactes, avec date de création repérable et date de modification si applicable. Abréger les valeurs longues sans perdre l'accès au contenu par édition et copie.
- Conserver la palette existante de 24 couleurs et l'identité stable du format de données entre thèmes ; adapter sa représentation, pas sa valeur métier. Ne pas fusionner deux couleurs distinctes dans le thème sombre. Ajouter nom ou indicateur pour ne pas dépendre seulement de la couleur.
- Commencer simplement avec un champ ; révéler progressivement unités, références et réglages avancés. Ne pas transformer une création de note en assistant de configuration complet.
- Maintenir EN/FR, dates locales, unités et saisie décimale française. Distinguer valeur vide, zéro et estimation. Ne pas afficher de fonctions planifiées comme disponibles ni rendre public un profil privé.
- Garder mêmes sens, capacités et tokens sur Next.js et Flutter ; adapter navigation et interactions à la plateforme. Ne pas modifier API, règles métier ou dépendances pour une retouche esthétique. Isoler les composants au lieu d'agrandir les écrans monolithiques.

## Accessibilité et comportement

- Employer les contrôles sémantiques : bouton pour action, lien pour navigation, checkbox pour choix, switch pour réglage immédiat. Nommer les icônes interactives ; rendre les actions accessibles sans survol.
- Viser WCAG 2.2 AA : contraste texte normal ≥ 4,5:1, grand texte ≥ 3:1, limites/états nécessaires des contrôles ≥ 3:1. Mesurer les combinaisons effectives, pas seulement la palette. Ne pas présenter un contrôle visuel comme une certification.
- Viser des cibles tactiles de 44 CSS px sur web, 48 unités logiques sur Flutter, même si l'icône reste petite. Ce sont les objectifs Brainy, distincts du minimum WCAG AA de 24 CSS px et de ses exceptions.
- Assurer ordre clavier logique, focus visible et non masqué, zoom texte, libellés persistants et erreurs associées. Restaurer le focus après fermeture d'une modale ; permettre Échap hors mutation bloquante justifiée. Expliquer les actions indisponibles sans dépendre d'un tooltip sur bouton désactivé.
- Prévoir normal, hover si pointeur, focus, pressé, désactivé, chargement, succès et erreur pour les contrôles touchés ; pour une vue, prévoir vide, chargement, données, erreur avec reprise. Ne jamais ajouter un bouton factice.

## Mouvement utile et performant

- Animer uniquement un changement qui aide à comprendre : ouverture, fermeture, sélection, retour d'action. Utiliser 100–140 ms pour feedback ; 160–220 ms pour popover/dialogue ; 200–280 ms pour transition de panneau. Appliquer une courbe de décélération simple, sans rebond par défaut.
- Sur web, privilégier opacity/transform ; sur Flutter, limiter la reconstruction au sous-arbre animé. Éviter animations permanentes, cascades de listes, blur animé et layout recalculé à chaque frame. Ne jamais retarder une action réseau pour finir une animation.
- Respecter `prefers-reduced-motion` sur web et le réglage de réduction/désactivation des animations accessible dans la version Flutter du projet. Supprimer translations/zoom et utiliser un changement instantané ou fondu bref. Garder un indicateur de progression perceptible.
- Ne pas installer de bibliothèque d'animation pour ces effets simples. Ne pas imposer une migration de framework ou de design system.

## Recette de livraison, proportionnée

- Examiner le rendu réel des zones touchées en clair et sombre : écran étroit à 320/390, puis bureau à 1280 unités de largeur selon la plateforme. Adapter au scope : ne pas lancer les deux applications si une seule change ; noter la parité restant à vérifier.
- Parcourir au moins le chemin principal, une erreur pertinente, le clavier, un libellé FR long et du texte agrandi. Vérifier absence de débordement, CTA visible, contenu non caché par clavier/barre fixe, focus, contraste et réduction du mouvement si animation modifiée.
- Corriger d'abord les blocages : action inaccessible, perte de saisie, contraste insuffisant, débordement, piège clavier. Puis harmoniser alignements, densité et états. Une compilation réussie ne prouve pas la qualité du rendu.
- Exécuter les contrôles ciblés prescrits par le dépôt ; préférer les tests existants. Ajouter un test seulement pour un comportement ou une régression significative, pas pour figer une marge. Ne pas inventer de capture, mesure ou validation. Si exécution impossible, dire précisément ce qui reste non vérifié.

## Budget de contexte

- Lire ce noyau puis au maximum la référence nécessaire ; ne pas charger tous les documents produit ni parcourir tous les liens. Chercher par chemin/motif, lire des plages courtes, ignorer sorties générées et dépendances.
- Réutiliser les décisions enregistrées et corriger un composant partagé plutôt que plusieurs copies. Traiter un parcours à la fois ; ne pas proposer trois variantes sauf demande.
- Ne pas lancer de sous-agents, génération d'images ou recherche web systématique. Consulter [sources.md](references/sources.md) uniquement pour une question de norme ou de compatibilité. Garder un rapport final court et honnête ; aucune promesse chiffrée d'économie de crédits.
