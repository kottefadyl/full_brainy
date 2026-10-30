# T43 — sensibilité et seuils d’agrégat

Contrat initial, 30 octobre 2026. Chaque format de données et chaque champ porte un niveau choisi par son propriétaire : `ORDINARY`, `PERSONAL` ou `SENSITIVE`. L’absence historique signifie `ORDINARY`. Le niveau effectif d’un champ est le plus élevé entre son niveau et celui du format de données. Les champs `POSITION` et `ZONE`, ainsi que les modèles de santé ou de position, proposent `SENSITIVE` à la création ; le propriétaire peut modifier ce choix. Les données existantes ne sont pas reclassées silencieusement.

Un partage de collection masque les champs sensibles par défaut, même si le membre accède aux autres champs. Le propriétaire choisit explicitement ceux qu’il partage. Les exports ordinaires excluent les champs sensibles par défaut ; une option explicite permet leur inclusion au propriétaire. Une sauvegarde complète garde son rôle de restauration et requiert une décision d’inclusion explicite. Les lectures et partages sensibles sont consignés dans l’audit T28 sans copier les valeurs dans le journal.

Le propriétaire choisit un seuil minimal d’effectif pour les analyses sensibles, avec une valeur initiale de 5. L’API applique ce seuil avant de rendre une ligne d’agrégat. Elle refuse les requêtes permettant des recoupements évidents par filtres, comparaisons, groupes complémentaires ou accès aux sources détaillées. Les résultats sont des contrôles de divulgation limités, **pas une anonymisation** : des connaissances extérieures et plusieurs exports peuvent encore permettre des inférences.

Les scénarios R7 (données métier avec champs personnels) et R8 (positions précises) servent de fumées de validation. Les anciens schémas et archives restent lisibles ; les nouveaux réglages sont conservés dans les sauvegardes.
