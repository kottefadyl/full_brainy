# Patterns : lire uniquement la section utile

## Navigation et disposition

Bureau : panneau collections à gauche, titre de collection et actions contextuelles en haut, données au centre. Réserver une zone de détail à droite seulement si elle aide à lire/éditer. Éviter plusieurs barres concurrentes. Petit écran : une colonne ; ouvrir les collections par navigation accessible et montrer les détails dans un écran dédié. Ne pas ajouter de barre basse pour des actions qui ne sont pas des destinations principales.

Déterminer les ruptures selon le contenu, pas le nom d'un appareil. Replier un panneau lorsque les champs deviennent trop étroits. Préférer une liste adaptée au mobile ; autoriser le défilement horizontal à l'intérieur d'un vrai tableau si indispensable, jamais sur toute la page. Garder les actions hors de la zone qui défile horizontalement.

## Actions et boutons

| Intention | Composant | Emplacement |
|---|---|---|
| Ajouter une entrée | bouton primaire « Ajouter une entrée » | en-tête de la collection, visible en contexte |
| Changer de vue | sélecteur de vue | près du titre/contenu, distinct des actions métier |
| Rechercher/filtrer | recherche et filtres | au-dessus des résultats, avec réinitialisation |
| Copier une entrée | action secondaire nommée ou icône accessible | sur la ligne/détail ; retour « Entrée copiée » |
| Modifier/supprimer | menu d'actions de l'entrée | proche de la ligne ; suppression séparée visuellement |
| Enregistrer un formulaire | primaire « Enregistrer » | après les champs ou pied stable du dialogue |
| Annuler | secondaire | à côté d'Enregistrer, ordre stable conforme à la plateforme |

Donner un verbe et un objet aux actions ambiguës. Garder l'action principale visible sur petit écran ; menu pour actions rares. Ne pas réserver l'accès à un survol. Ne pas faire toute la ligne cliquable si elle contient d'autres contrôles imbriqués. Employer tailles et alignements cohérents ; ne pas étirer tous les boutons pleine largeur sur bureau.

## Formulaires

Une colonne par défaut ; grouper seulement les champs directement liés. Label au-dessus, aide courte puis contrôle et erreur associée. Placeholder pour un exemple uniquement. Identifier obligatoire/facultatif sans ambiguïté. Choisir clavier et contrôle selon le type ; conserver la valeur saisie en cas d'erreur réseau. Présenter unités à côté du nombre sans les confondre avec sa valeur.

Valider au moment utile, généralement sortie de champ et soumission, sans punir chaque frappe. À l'échec, annoncer le résumé pertinent et amener au premier champ invalide ; ne pas transmettre uniquement un toast. Pendant soumission, empêcher les doublons et garder le libellé compréhensible. Ne fermer qu'après succès. Conserver les données tant que l'utilisateur ne les abandonne pas explicitement.

Création Brainy : nom de collection → premier format de données nommé, couleur et champ initial → première entrée. Respecter le flux existant, montrer la prochaine action et révéler les réglages avancés à la demande. Ne pas inventer une nouvelle obligation métier.

## Listes et densité

Privilégier les lignes compactes aux mosaïques de grandes cartes. Aligner valeurs, unités et dates ; permettre au titre de prendre l'espace disponible. Distinguer métadonnée et valeur par hiérarchie, pas par minuscule texte gris. Sur mobile, envelopper les informations utiles et abréger le reste avec accès au contenu complet. Maintenir une cible d'action confortable malgré la densité visuelle. Utiliser une identité stable pour préserver sélection et focus lors des mises à jour.

## Dialogues et confirmations

Éviter les modales imbriquées. Pour une modification courte, dialogue avec titre, contenu, actions ; pour édition longue, préférer un écran ou panneau dédié. Limiter le défilement à une zone lisible, garder titre et actions accessibles sans masquer les champs au clavier. Sur petit écran, une page plein écran peut remplacer le dialogue.

Pour supprimer une collection, nommer la cible et annoncer les entrées supprimées aussi. Confirmer la conséquence réelle, ne pas employer « Êtes-vous sûr ? » seul. Pour action facilement réversible, préférer Annuler après action seulement si l'annulation existe réellement. Pour mouvement de stock ou conversion, montrer l'aperçu prévu par le métier ; une animation ne remplace pas la confirmation.

## États et retours

Vide : expliquer ce qui apparaîtra et offrir l'action suivante. Aucun résultat : proposer d'effacer les filtres, sans prétendre que la collection est vide. Chargement : stabiliser la disposition, éviter flashes et spinners multiples ; exposer l'état aux technologies d'assistance. Erreur : message concret, reprise près de la zone affectée ; conserver les données déjà visibles. Succès courant : retour discret ; ne pas ouvrir une modale. Réserver bannière aux problèmes persistants.

## Exemples de corrections

- Mauvais : 5 CTA bleus « Créer », « Ajouter », « Nouveau » au même niveau. Corriger : un primaire « Ajouter une entrée », gestion du format de données dans son menu dédié.
- Mauvais : champ sans label, erreur rouge seulement, saisie effacée au retry. Corriger : label associé, message textuel, valeur préservée et focus pertinent.
- Mauvais : cartes pastel éclatantes sur noir pur, icônes gris illisibles. Corriger : charbon à plusieurs niveaux, teintes atténuées mesurées et actions lisibles.
- Mauvais : chaque ligne arrive avec rebond et délai croissant. Corriger : affichage immédiat des données et feedback local bref sur l'action.
