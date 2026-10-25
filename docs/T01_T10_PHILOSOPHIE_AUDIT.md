# Vérification de T01 à T10 face à la philosophie produit retenue

**Date : 22 octobre 2026.** Référence produit : [COLLECTIONS_DIRECTION.md](../COLLECTIONS_DIRECTION.md). Cet audit porte sur le code présent dans `api/`, `brainy_web_app/` et `brainy/` ; il ne transforme pas les capacités prévues après T10 en fonctions livrées.

| Tâche | Constat et alignement |
| --- | --- |
| T01 | L'inventaire et les parcours de référence couvrent notes, liens, agenda, boutique et mesures. Les parcours agenda et boutique sont des exemples de données, pas des modules annoncés comme livrés. |
| T02 | La création d'une collection et d'une entrée à un champ reste le parcours simple. Les messages web et Flutter parlent désormais d'informations variées ; le profil est présenté comme privé et tout partage futur comme un choix de l'utilisateur. |
| T03 | Les identifiants stables, le propriétaire et la collection délimitent les données. Les contrats futurs pour stocks, règles et prévisions se préciseront dans leurs tâches ; le socle T03 reste compatible. |
| T04 | Les modifications de formats de données utilisés conservent les valeurs existantes, contrôlent les versions et refusent les changements destructeurs de champs peuplés. |
| T05 | Les types de champs, dates, nombres, unités et pièces jointes permettent des notes simples comme des relevés structurés, sans imposer objet ou calcul. |
| T06 | Recherche, filtres typés et pagination permettent de retrouver de nombreuses entrées ; les objets locaux disposent aussi d'une recherche paginée. |
| T07 | L'export et l'import structurés conservent formats de données, unités, objets et liens internes existants avec de nouveaux identifiants dans la cible. Ils ne constituent pas encore le partage lié prévu plus tard. |
| T08 | Les unités et conversions locales restent distinctes des objets et des stocks ; les valeurs enregistrées conservent un instantané de leur unité. Les anciens conditionnements liés à un format de données continuent d'être lisibles. |
| T09 | Un modèle d'objets est un format de données local avec champ titre. Convertir un format déjà rempli en modèle d'objets demande maintenant un aperçu, une confirmation explicite et un nombre d'entrées inchangé ; les entrées sans titre utilisable, y compris les anciens titres composés d'espaces, sont refusées. |
| T10 | Les objets ont une identité stable, des caractéristiques et un historique. La duplication conserve exactement le nom saisi tout en créant un nouvel identifiant. « Utiliser dans une entrée » ne cible qu'un format de données ordinaire et crée un résumé figé avec unités lisibles ; les références typées restent prévues en T11. |

Les tâches T01–T10 fournissent le socle de la nouvelle philosophie. Les listes de tâches dédiées, agendas, stocks, objets-variables, règles, analyses et prévisions suivent [ROADMAP_BRAINY.md](../ROADMAP_BRAINY.md) à partir de T11 ; leur absence actuelle ne doit pas être présentée comme une capacité déjà livrée.

## Vérifications ciblées

- Le smoke test API vérifie qu'une conversion d'entrées en objets ne se fait pas sans confirmation, refuse un nombre d'entrées périmé et des entrées sans titre utilisable, y compris un titre historique composé d'espaces, et empêche un résumé figé de créer un autre objet.
- Le test Flutter de la bibliothèque d'objets vérifie l'aperçu, l'annulation et l'envoi du nombre d'entrées confirmé.
- Les contrôles statiques et builds des trois clients restent les portes de validation technique ; l'inspection visuelle sur appareils physiques et avec lecteur d'écran est encore à faire avant une livraison publique.
