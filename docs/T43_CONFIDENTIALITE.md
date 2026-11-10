# T43 — sensibilité et seuils d’agrégat

Contrat initial, 30 octobre 2026. Chaque format de données et chaque champ porte un niveau choisi par son propriétaire : `ORDINARY`, `PERSONAL` ou `SENSITIVE`. L’absence historique signifie `ORDINARY`. Le niveau effectif d’un champ est le plus élevé entre son niveau et celui du format de données. Les champs `POSITION` et `ZONE`, ainsi que les modèles de santé ou de position, proposent `SENSITIVE` à la création ; le propriétaire peut modifier ce choix. Les données existantes ne sont pas reclassées silencieusement.

Un partage de collection masque les champs sensibles par défaut, même si le membre accède aux autres champs. Le propriétaire choisit explicitement ceux qu’il partage. Les exports ordinaires excluent les champs sensibles par défaut ; une option explicite permet leur inclusion au propriétaire. Une sauvegarde complète garde son rôle de restauration et requiert une décision d’inclusion explicite. Les lectures et partages sensibles sont consignés dans l’audit T28 sans copier les valeurs dans le journal.

Le propriétaire choisit un seuil minimal d’effectif pour les analyses sensibles, avec une valeur initiale de 5. L’API applique ce seuil avant de rendre une ligne d’agrégat. Elle refuse les requêtes permettant des recoupements évidents par filtres, comparaisons, groupes complémentaires ou accès aux sources détaillées. Les résultats sont des contrôles de divulgation limités, **pas une anonymisation** : des connaissances extérieures et plusieurs exports peuvent encore permettre des inférences.

Les scénarios R7 (données métier avec champs personnels) et R8 (positions précises) servent de fumées de validation. Les anciens schémas et archives restent lisibles ; les nouveaux réglages sont conservés dans les sauvegardes.

## Requêtes répétées (T43/3, 10 novembre 2026)

Chaque agrégat sensible, servi ou refusé, est consigné dans l’audit T28 avec une empreinte de la question (`queryKey`, 16 caractères hexadécimaux calculés sur le format de données, le champ, l’opération, les regroupements et les filtres demandés) et, s’il est servi, son nombre total d’observations. Aucune valeur n’est écrite. Trois motifs ajoutent une alerte `SENSITIVE_AGGREGATE_ALERT` :

- **DIFFERENCING** : la même question, posée par la même personne dans les 24 heures, donne un total qui diffère de moins d’observations que le seuil ; soustraire les deux résultats peut isoler quelques entrées ;
- **BURST** : la même question est posée 10 fois en une heure ;
- **PROBING** : 5 requêtes sensibles sont refusées en une heure, signe d’un sondage des règles.

Une alerte d’un même motif n’est écrite qu’une fois par heure, par question et par personne. Ces alertes **ne bloquent rien** : le seuil et les refus restent la protection, et un ajout légitime d’entrée peut aussi déclencher DIFFERENCING. Le journal est lisible par l’API (`collectionAuditLogs`, 100 derniers événements, rôle éditeur ou propriétaire) et affiché, depuis le 10 novembre 2026, dans la section Confidentialité du web et de Flutter : libellés naturels, motif des alertes en clair, clé technique omise, filtre « tout le journal ». Logique dans `api/src/collections/sensitive-aggregate-watch.ts` ; fumée `npm run smoke:sensitivity`.

## Règle de k-anonymat (T43/1, 10 novembre 2026)

Chaque ligne rendue par un agrégat sensible compte au moins k observations, k étant le seuil minimal de la collection. Plutôt que de refuser dès qu’un groupe est trop petit, l’API élargit le regroupement dans un ordre fixe, donc explicable :

- **catégories** : les groupes sous k sont fusionnés en une seule ligne « Autres (n groupes regroupés) » lorsqu’ils sont au moins deux et atteignent k ensemble (un seul petit groupe resterait nommé par son absence) ; sinon le résultat devient un total unique ;
- **jours** → mois → total unique ; **mois** → total unique ;
- un total sous k, ou des observations omises (un complément soustractible), est refusé comme avant.

La valeur d’une ligne fusionnée est exacte : somme des nombres ou des sommes, moyenne pondérée par les effectifs. Le résultat porte le regroupement final (`groupBy`) et son explication dit ce qui a été élargi. Cela reste un contrôle de divulgation, pas une anonymisation : des connaissances extérieures peuvent toujours permettre des inférences. Logique dans `api/src/collections/sensitivity.logic.ts` ; fumée R9 dans `npm run smoke:sensitivity`.
