# T39 — Contrat des classifications

- Une liste de codes appartient à une collection. Chaque code stable possède des libellés `en` et `fr`, un parent facultatif et un état actif ou obsolète. Le code enregistré dans une entrée ne change pas quand un libellé change.
- Un champ `CODE` référence une liste locale par `codeListId`. L'API accepte uniquement un code actif lors d'une nouvelle saisie ; une entrée existante conserve son code obsolète en lecture et en édition. Les parents forment un graphe sans cycle, limité à trois niveaux pour le premier parcours.
- Les mutations de liste vérifient le rôle propriétaire, la version attendue et les conflits. Une fusion propose d'abord le nombre d'entrées affectées ; la confirmation remplace leurs codes avec contrôle de version. L'import CSV produit des erreurs par ligne avant toute écriture.
- Une copie vers une autre collection demande un aperçu et une cible explicite ; elle crée des identités locales. L'export/import JSON T07 conserve listes, codes, parents et références des champs.
- Les analyses regroupent les codes à leur niveau ou à un niveau parent choisi, sans traduire les valeurs saisies. Les libellés sont résolus dans la langue de l'interface.
