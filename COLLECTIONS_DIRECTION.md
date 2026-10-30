# Évolution des collections Brainy — proposition produit

**Statut : socle 1.0 (T01–T27) mis en œuvre ; extension 1.1 (T34–T45) et gouvernance/volume (T28–T33) planifiées.** Les unités locales, objets structurés, références typées, objets-variables, valeurs actuelles et figées, transferts entre collections, vues (liste, tableau, tâches, agenda), rappels, formules arithmétiques, analyses simples, graphiques, modèles de départ, liens entre entrées, registre local de mouvements de stock (T26) et premières prévisions explicables (T27) sont disponibles. La logique métier livrée est dans [AGENTS.md](AGENTS.md) et [l'état d'implémentation](docs/ETAT_IMPLEMENTATION.md).

## Choix recommandé

Conserver **un seul modèle de collection**. Une collection reste le conteneur des formats de données et des entrées. Proposer des **modèles de départ** pour accélérer sa création, puis permettre d'activer ou de modifier ses capacités au fil du temps.

Ne pas imposer à la création un type permanent tel que « statistique », « mathématique », « stockage », « agenda » ou « rappel ». Ces mots correspondent à des usages qui peuvent coexister dans une même collection. Le modèle de départ aide l'utilisateur à commencer ; il ne limite pas ce que la collection peut devenir.

### Philosophie produit retenue

Brainy permet à une personne de définir ce qu'elle suit, d'enregistrer ce qu'elle observe ou fait, puis de choisir comment retrouver, relier, traiter, présenter et partager ses données dans le temps. Une collection peut servir de bloc-notes, de liste de tâches, d'agenda, de journal de mesures, de suivi personnel ou de santé, de boutique ou de base d'étude. Aucun de ces usages n'oblige à créer un objet, un stock ou une formule : une note à un seul champ reste un parcours complet.

L'utilisateur définit les formats de données et leurs champs ; lorsqu'il suit des choses identifiables, il peut aussi définir des modèles d'objets et des objets locaux. Les entrées enregistrent des valeurs, observations ou événements. Des règles explicites pourront calculer une valeur par entrée, analyser plusieurs entrées, faire évoluer un état suivi comme un stock ou produire une prévision clairement distinguée des observations. Les vues montrent les mêmes sources sous une forme adaptée. Les règles choisissent leurs champs et objets sources, vérifient les types, unités et droits, et rendent leurs résultats explicables. Ces capacités avancées sont une direction de conception, pas des fonctions déjà livrées.

| Besoin | Exemple de composition, sans type de collection permanent |
| --- | --- |
| Bloc-notes et écriture | Entrées de texte long, pièces jointes, recherche et liens éventuels entre notes. |
| Liste de tâches | Entrées avec état, priorité et échéance facultative ; vues et rappels au besoin. |
| Agenda | Entrées datées, horaires ou récurrentes ; vues temporelles et rappels au besoin. |
| Suivi de santé personnel | Mesures datées et contextualisées, unités, notes et tendances ; données privées, sans prétendre poser un diagnostic. |
| Boutique et stockage physique | Produits identifiables, stocks par lieu ou lot si nécessaire, mouvements et quantité disponible expliquée par ces mouvements. |
| Météo et science | Lieu, appareil ou échantillon suivi ; observations horodatées, source, méthode, unités et qualité des mesures. |
| Statistiques et prévisions | Agrégats et comparaisons traçables ; prévisions séparées des faits avec méthode, période et incertitude indiquées. |

Un stock est une capacité métier explicite pour suivre une quantité d'exemplaires d'un objet ; il ne définit ni la possibilité de référencer plusieurs objets ni celle de nommer une variable de type objet. Une référence typée peut viser un ou plusieurs objets compatibles sans stock. Un stock courant est un état expliqué par ses mouvements, et non un nombre modifié silencieusement par une formule.

## Les éléments à distinguer

| Élément | Rôle | Exemple |
| --- | --- | --- |
| Collection | Regroupe les informations d'un sujet et délimite leur portée | Dépenses personnelles |
| Type d'objet | Définit les caractéristiques d'une chose suivie ; peut s'appuyer sur un format de données spécialisé | Produit : marque, poids, volume, prix |
| Objet réutilisable | Chose identifiable, avec les valeurs de ses caractéristiques | Produit « Bouteille 50 cl » : poids 0,55 kg |
| Format de données | Définit les champs et la couleur des entrées | Vente : date, produit, quantité, montant |
| Entrée | Enregistre une note, une observation ou un événement avec les valeurs de ses champs | Vente de 3 bouteilles le 20 octobre |
| Référence d'objet | Lie un champ à un ou plusieurs objets compatibles, par leur identité stable | Le champ « produit » d'une vente pointe vers « Bouteille 50 cl » |
| Objet-variable | Nomme l'objet choisi par une référence pour lire ses caractéristiques dans une règle | `produit.prix` pour le produit choisi dans une vente |
| Stock | Suit une quantité d'exemplaires d'un objet, éventuellement par lieu ou lot | Bouteilles 50 cl dans la réserve |
| Mouvement de stock | Enregistre une addition, sortie, correction ou transfert justifié | Approvisionnement de 20 bouteilles |
| Règle | Définit un calcul, une analyse, un changement d'état ou une prévision | `quantité × produit.prix` ; vente : retirer 3 du stock |
| Vue | Présente les mêmes sources et résultats autrement | Liste, tableau, calendrier, graphique |
| Rappel | Déclenche une action liée à une date ou une heure | Me prévenir avant une échéance |

Une vue ne crée pas une copie indépendante des données. Un calcul ne transforme pas automatiquement toute la collection en « collection mathématique ». Un rappel peut être utile dans une collection qui contient aussi des notes ou des calculs.

Le produit « Bouteille 50 cl » peut représenter une référence commerciale dont 120 exemplaires interchangeables sont comptés par quantité. Si chaque exemplaire doit être suivi séparément, chacun reçoit une identité propre, comme un numéro de série. Ni la multiplicité des objets ni une variable de type objet ne dépendent de l'existence d'un stock : une expérience peut référencer plusieurs échantillons sans gérer d'inventaire.

## Règles, états et prévisions à distinguer

| Usage d'une règle | Portée et exemple |
| --- | --- |
| Calcul par entrée | Choisir les champs de l'entrée et les propriétés des objets référencés : `quantité × produit.prix`. |
| Analyse de plusieurs entrées | Choisir formats de données, champs, filtres, période et regroupement : moyenne des températures quotidiennes par station. |
| Changement d'état suivi | Relier une entrée validée à un effet explicite : une vente retire sa quantité du stock choisi, une réception l'ajoute. |
| Prévision | Appliquer une méthode définie à des données historiques choisies ; enregistrer horizon, version de la méthode et incertitude, et signaler que le résultat est estimé. |

La configuration d'une règle sélectionne les champs par leur identité stable, pas seulement par leur nom affiché. Avant de valider une entrée ayant un effet sur un état, montrer à l'utilisateur ce qui changera. L'effet est appliqué une seule fois, même après reprise ou synchronisation. Une correction ou annulation doit rester explicable par les mouvements et entrées d'origine. Une multiplication peut calculer un montant ou convertir un conditionnement ; elle ne représente pas, à elle seule, un mouvement physique de stock. Les états et tableaux de bord peuvent être mis en cache pour la vitesse, mais leurs chiffres restent rattachés aux entrées sources.

## Temps, qualité et provenance

- Distinguer la date du fait observé ou de l'événement, la date de saisie, et si nécessaire la période pendant laquelle une valeur s'applique. Une tâche possède aussi son échéance ou son créneau planifié, distinct de sa création ; un rendez-vous récurrent peut avoir des exceptions.
- Pour une mesure ou une étude, conserver selon le besoin l'objet observé, l'unité, le lieu, la source, l'instrument ou la méthode, la qualité ou l'incertitude et le fuseau horaire. Une valeur absente, zéro et une estimation sont des cas différents.
- Les transactions historiques gardent par défaut les prix et autres propriétés utilisés à l'enregistrement ; une vue explicitement fondée sur les valeurs actuelles peut suivre les changements. Une prévision reste identifiable comme prévision et ne remplace pas une observation réelle.
- Une note ou une liste de tâches reste recherchable et exportable sans demander toutes ces métadonnées. Le partage de données personnelles, notamment de santé, exige un choix explicite de portée et d'accès ; un tableau de bord de santé ne se présente pas comme un diagnostic.

## Parcours proposé

1. L'utilisateur crée une collection et lui donne un nom.
2. Il choisit **Partir de zéro** ou un modèle simple, par exemple Notes, Dépenses, Suivi de mesures ou Planning. Le modèle suggère des formats de données, des champs et éventuellement une vue pertinente. Il reste modifiable.
3. Il enregistre ses premières entrées sans devoir configurer de formules ni de rappels.
4. Lorsque le besoin apparaît, il ajoute une vue, un calcul ou un rappel. Brainy lui propose seulement les options compatibles avec les champs présents.
5. Les utilisateurs avancés peuvent créer leurs propres formules et vues, sans forcer ces réglages dans le parcours des débutants.

Exemple : une collection « Dépenses » peut contenir un format de données « Achat » avec *date*, *article* et *montant en EUR*. Elle commence comme une simple liste. L'utilisateur peut ensuite ajouter le total mensuel, un graphique, puis un rappel sur une date d'échéance. Il garde la même collection et les mêmes entrées.

## Objets, caractéristiques et variables réutilisables

- Un objet n'est **pas seulement un nom**. L'utilisateur choisit ses caractéristiques, leurs types et, si nécessaire, leurs unités : poids en kg, taille en cm, densité en kg/L, prix en EUR, catégorie, description, lien, etc. Chaque objet possède ensuite ses propres valeurs. Les modèles et objets précréés sont des points de départ modifiables, pas une liste fermée.
- Pour conserver le principe de Brainy, un modèle d'objet peut s'appuyer sur un **format de données** et chaque objet sur une **entrée identifiable** de ce format. Par exemple, le modèle « Produit » définit les caractéristiques ; « Bouteille 50 cl » est un objet précis. Cela évite de créer un second système indépendant pour décrire les objets.
- Un nouveau type de champ proposé, **référence d'objet**, permettrait à une entrée d'utiliser un objet créé dans **la même collection**. Le champ conserve l'identité de l'objet, et non simplement une copie de son nom. Une formule pourrait lire une caractéristique de cet objet comme une variable, par exemple `quantité × produit.poids`.
- Exemple : une livraison référence « Bouteille 50 cl » (poids : 0,55 kg) et contient une quantité de 20. Brainy pourrait calculer un poids total de 11 kg. Le même objet pourrait être utilisé dans des ventes, stocks et graphiques sans ressaisir ses caractéristiques.
- Prévoir deux modes explicites : **valeur actuelle** pour une propriété qui doit suivre les changements de l'objet, et **valeur figée à l'enregistrement** pour une transaction historique. Si le prix d'un produit change demain, une vente enregistrée hier ne doit pas changer de montant sans action volontaire.
- Une unité et un objet restent distincts. « kg » est une unité de mesure ; « Bouteille 50 cl » est un objet. « Carton de 12 bouteilles » peut être un conditionnement défini par l'utilisateur, avec une conversion de comptage explicite. Un « carton » sans contenu défini ne suffit pas à convertir des quantités.
- Les références, variables et formules doivent contrôler les types, les unités et les droits d'accès. Éviter les calculs circulaires et expliquer la provenance des résultats. Prévoir ce qui arrive aux entrées liées lorsqu'un objet ou sa définition change ou est supprimé.

### Portée locale et réutilisation choisie

Un objet, sa définition et un objet-variable naissent dans une collection précise. Une autre collection ne les voit pas automatiquement. Pour les réutiliser, l'utilisateur choisit une collection cible et une action explicite : **copier** pour créer une version indépendante, **partager par lien** pour autoriser un accès contrôlé à la source, ou **déplacer** après vérification des références. Les dépendances (format de données, unités, objets référencés et objets-variables) et les conflits doivent être montrés avant l'action. Un objet-variable transféré doit être relié à un objet compatible dans la cible ; il ne suffit pas de copier son nom.

Un format de données peut aussi être copié ou partagé avec une collection choisie. Copier sa définition ne copie pas implicitement ses entrées ; un transfert avec entrées est une action séparée. Un partage lié doit préciser si les changements futurs du format source sont proposés, acceptés ou figés dans la cible. Aucun changement de structure ne doit rendre silencieusement illisibles les entrées déjà enregistrées.

## Règles à prévoir pour les calculs

- Un calcul simple cible d'abord un **format de données** et des champs précis. Une collection peut contenir plusieurs formats de données dont les champs n'ont aucun rapport.
- Pour additionner ou comparer des nombres, vérifier leur sens et leur unité. Par exemple, ne pas additionner des euros et des kilomètres. Toute conversion d'unités ou de devises devra être explicite et définie séparément.
- Un calcul entre plusieurs formats de données n'est permis que si l'utilisateur associe explicitement les champs compatibles.
- Les calculs peuvent utiliser les caractéristiques d'objets référencés, avec une règle explicite sur la valeur actuelle ou figée utilisée.
- Distinguer un résultat calculé pour chaque entrée (par exemple *prix × quantité*) d'un agrégat sur plusieurs entrées (par exemple *total du mois*).
- Un résultat doit pouvoir être compris : montrer quels champs et quelles entrées ont servi au calcul.

## Règles à prévoir pour le temps et les rappels

- Un calendrier ou un agenda est d'abord une **vue** des entrées qui possèdent une date ou une heure pertinente.
- Un emploi du temps peut demander des règles supplémentaires, notamment des créneaux récurrents. Ces règles devront être conçues avant de proposer ce modèle.
- Un rappel est une **capacité facultative** attachée à une date ou une heure, avec un choix clair du moment et du canal de notification. Les fuseaux horaires, les répétitions et les permissions de notification restent à définir.

## Principes d'expérience

- Utiliser le même concept sur le web Next.js et les applications Flutter mobile et ordinateur, en anglais et en français.
- Montrer les options progressivement. La création d'une collection doit rester rapide même pour quelqu'un qui veut seulement écrire une note, et la capture quotidienne d'un lien ou d'une vente doit tenir en deux ou trois gestes (T34).
- Masquer la mécanique abstraite (comme « objet-variable » ou les identifiants de schéma) derrière des formulations naturelles dans l'interface (ex. *« Utiliser une propriété de l'objet choisi »*), et regrouper les types de champs spécialisés (mesure, composition, géographie, classification, flux d'états) dans des options avancées ou des paquets de départ.
- Permettre de revenir sur le modèle de départ ou sur les capacités activées sans perdre les entrées.
- Séparer clairement la saisie des données, leur présentation et leur traitement dans l'interface et dans le langage utilisé.

## Extension Brainy 1.1 : primitives universelles et paquets de domaine (T34 à T45)

Brainy 1.1 étend la portée du noyau (**collection → formats de données → entrées**) pour couvrir aussi bien les usages quotidiens rapides que les suivis scientifiques, statistiques, géographiques et de processus, **sans jamais créer de type de collection permanent ni promettre une conformité légale, médicale, fiscale ou industrielle**. Voir [l'épreuve des 50 domaines et les scénarios R1–R10](docs/ANNEXE_50_DOMAINES.md).

| Primitive 1.1 | Rôle métier | Tâche |
| --- | --- | --- |
| Capture et saisie rapides | Garder un lien avec contexte en ≤ 3 gestes ; saisir une opération fréquente en ≤ 2 gestes | [T34](docs/tasks/T34.md) |
| Registre d'opérations d'analyse | Médiane, percentiles, écart-type, taux pour $N$, tableau croisé, cumul, moyenne glissante, différence de compteur | [T35](docs/tasks/T35.md) |
| Champ « mesure » | Valeur + unité + statut (mesurée, estimée, calculée, absente), incertitude, qualité, source et historique de révisions | [T36](docs/tasks/T36.md) |
| Relations généralisées | Hiérarchie parent-enfant sans cycle, plusieurs-à-plusieurs et composition multi-niveaux avec quantité/unité | [T37](docs/tasks/T37.md) |
| Géographie sur choix | Position (WGS84, précision) et zone ; carte et distances sans appel tiers ni géocodage implicite | [T38](docs/tasks/T38.md) |
| Codes et classifications | Vocabulaire contrôlé local et hiérarchique, libellés EN/FR, codes obsolètes préservés, import CSV | [T39](docs/tasks/T39.md) |
| Flux d'états et validations | États, transitions autorisées, champs requis par état, assignation à un compte et historique | [T40](docs/tasks/T40.md) |
| Collecte tierce sans compte | Formulaire public révocable, sans aucun droit de lecture, avec arrivée obligatoire en quarantaine | [T41](docs/tasks/T41.md) |
| Registre non modifiable | Mode ajout seul, correction par contre-écriture liée, chaîne de hachage et vérification d'intégrité | [T42](docs/tasks/T42.md) |
| Sensibilité et seuils d'agrégat | Champs ordinaires/personnels/sensibles ; exclusion par défaut des partages et seuil minimal d'effectif côté API | [T43](docs/tasks/T43.md) |
| Données lourdes par référence | Pièces volumineuses sur stockage objet (S3), envoi repris par morceaux, lien signé et empreinte | [T44](docs/tasks/T44.md) |
| Paquets de domaine | Modèles complets versionnés (formats, unités, codes, vues, opérations) installés par copie locale sans code exécutable | [T45](docs/tasks/T45.md) |

## Décisions encore ouvertes

Le socle T01–T27 a fixé la portée locale des objets, les transferts explicites, le moteur de formules (T21), les analyses et graphiques (T22–T23), les mouvements de stock (T26) et les premières prévisions (T27). Trois décisions produit restent ouvertes pour la suite (détaillées dans [les principes communs](docs/tasks/_PRINCIPES.md)) :
1. **A1 (Profil à l'inscription)** : rendre les centres d'intérêt et les loisirs facultatifs tant que la mise en relation ([T33](docs/tasks/T33.md)) n'est pas livrée.
2. **A2 (Terminologie)** : tester « format de données » / « data format » auprès de novices (alternatives : fiche, modèle d'entrée, structure) avant toute modification.
3. **T42 (Registre et droit à l'effacement) — décidé le 2026-10-29** : masquer les champs choisis, conserver les montants numériques et une trace chaînée, selon [le contrat T42](docs/T42_REGISTRE.md).

Le plan d'exécution complet (T01 à T45) et l'ordre fusionné recommandé sont dans [ROADMAP_BRAINY.md](ROADMAP_BRAINY.md).
