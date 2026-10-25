# Archive des lignes hors définitions de tâches

Texte conservé mot pour mot depuis le commit `5bc19fc`. Ce fichier contient l'état initial, les suivis, les portes de livraison et les références.

# Brainy — feuille de route de réalisation pour l'IA

**Statut : plan de travail, aucune fonction décrite ici n'est implémentée par ce document.** Lire d'abord [AGENTS.md](AGENTS.md) pour les règles métier actuelles et [COLLECTIONS_DIRECTION.md](COLLECTIONS_DIRECTION.md) pour l'orientation produit. Le texte de conversation joint par l'utilisateur sert de contexte ; la demande actuelle fixe la règle supplémentaire de portée des objets.

**Avancement au 24 octobre 2026 :** T01–T19 ont été traitées dans le code et les documents liés ci-dessous. T20 dispose d'une implémentation sur les trois clients et d'un test SMTP local ; sa validation de réception réelle reste ouverte tant que les identifiants SMTP/Firebase et les essais sur appareils ne sont pas disponibles. T21–T25 disposent d'un premier parcours utilisable sur API, web et Flutter, avec les limites indiquées plus bas. La section « Point de départ » garde volontairement l'état constaté avant ces tâches ; pour l'état actuel, lire [AGENTS.md](AGENTS.md). Les contrôles visuels sur appareils physiques et avec lecteur d'écran restent à effectuer avant une livraison publique.

## 1. Résultat recherché

Faire de Brainy un espace où une personne ou une organisation peut **stocker, retrouver, relier, présenter et traiter ses données**, depuis une note, une tâche ou un rendez-vous jusqu'aux données opérationnelles volumineuses. Conserver un noyau intelligible : **collection → formats de données → entrées**. Ajouter ensuite des capacités modulaires : objets, relations, unités, stocks et autres états suivis, règles, vues, calculs, graphiques, rappels, importation et gouvernance. Les modèles « Notes », « Agenda » ou « Boutique » sont des aides de départ modifiables, jamais des types de collection irréversibles.

L'interface doit rester belle, calme, rapide et accessible. Un novice peut créer une collection et écrire une première entrée sans voir les options avancées. Un professionnel peut activer les fonctions nécessaires progressivement. Toute capacité livrée doit fonctionner dans **Next.js web responsive** et **Flutter mobile/ordinateur**, en **anglais et français**. Flutter ne doit pas redevenir le client web.

« Toucher presque tous les domaines » signifie fournir des primitives composables et des modèles spécialisés. Cela ne signifie pas promettre immédiatement une conformité comptable, médicale, industrielle ou réglementaire propre à chaque domaine.

## 2. Point de départ vérifié dans le dépôt

| Existant | Emplacement et limite actuelle |
| --- | --- |
| Compte, connexion et profil privé | `api/src/auth/`, `brainy_web_app/app/brainy-app.tsx`, `brainy/lib/` ; mise en relation entre personnes encore absente. |
| Collections, formats de données, entrées | `api/src/collections/` ; une collection peut avoir plusieurs formats nommés, chacun avec ses champs et sa couleur pastel. |
| Valeurs des entrées | `EntryValue.value` est actuellement une chaîne ; les types sont validés à l'écriture, mais il n'existe pas encore de valeurs structurées, de référence d'objet ni de moteur de calcul. |
| Champs et unités | Titre, date, nombre, heure, lien, caractère et texte ; unité facultative sur un champ nombre ; palette de 24 couleurs. |
| Clients | `brainy_web_app/` pour le web et `brainy/` pour mobile/ordinateur ; les entrées affichent la date et offrent la copie. |
| Vérifications existantes | `api/scripts/`, `brainy/test/`, lint et build du web ; compléter ces tests par des parcours métiers et des mesures de performance au fil des tâches. |

Le code reste la source de vérité si ces repères vieillissent. Avant chaque tâche, relire les fichiers concernés et noter ce qui a changé. Les opérations actuelles permettent de créer un format de données et d'en changer la couleur ; **l'édition structurelle d'un format utilisé n'existe pas encore**.

## 3. Règles de conception à préserver

1. **Portée locale.** Un objet, sa définition et un objet-variable sont créés **dans une collection précise**. Une entrée d'une autre collection ne les voit pas automatiquement. Une bibliothèque de modèles fournis par Brainy peut aider à créer une copie locale ; elle ne transforme pas les objets de l'utilisateur en ressources globales.
2. **Objet structuré.** Un objet possède une identité stable et des caractéristiques choisies par l'utilisateur : poids, taille, densité, prix, description, liens, etc. Le chemin privilégié est un format de données marqué pour les objets, puis des entrées de ce format marquées comme objets. Éviter un second langage de schémas concurrent.
3. **Objet-variable.** C'est un nom local à une collection ou à un format de données, lié à un objet compatible. Par exemple `produit` référence l'objet « Bouteille 50 cl » ; `produit.poids` fournit une quantité typée à une formule. Conserver des identifiants stables en interne : renommer « produit » ou « poids » ne doit pas casser silencieusement les calculs.
4. **Réutilisation entre collections explicite.** L'utilisateur choisit une collection cible et voit un aperçu des dépendances, des conflits et de l'effet sur les données existantes. Prévoir trois actions distinctes : **copier** (nouvelle identité indépendante dans la cible), **partager par lien** (source conservée, accès autorisé à la cible) et **déplacer** (source retirée après vérification des références). Aucun partage implicite. Commencer par les collections d'un même compte ; le partage entre comptes attend les droits et rôles de T28.
5. **Valeurs historiques.** Une formule peut lire la valeur actuelle d'un objet ou une valeur figée lors d'une entrée. Les transactions commerciales utilisent par défaut un instantané du prix, de l'unité et des paramètres pertinents au moment de l'opération. Un changement ultérieur de l'objet ne réécrit pas le passé sans action explicite.
6. **Unités distinctes des objets.** `kg` est une unité de mesure ; « Bouteille 50 cl » est un objet ; « carton de 12 bouteilles » peut être un conditionnement avec une conversion de comptage définie pour un produit. Les unités créées par l'utilisateur sont locales à une collection, avec importation explicite vers une autre. Les unités intégrées sont des modèles communs en lecture seule. Ne jamais déduire une conversion d'un simple nom.
7. **Compatibilité et sécurité.** Chaque lecture, calcul, lien ou migration contrôle les droits sur la source et la cible, les types, les unités, les versions de formats et les références. Préserver les données existantes ; fournir un chemin de migration et de retour en arrière pour chaque changement de stockage.
8. **Parcours simples et liens généraux.** Une note, une tâche ou un rendez-vous n'exigent ni objet, ni stock, ni formule. Les liens entre entrées ordinaires doivent exister sans transformer chaque note en objet. Les capacités avancées s'ajoutent à la demande.
9. **Règles aux effets distincts.** Séparer calcul par entrée, analyse de plusieurs entrées, effet explicite sur un état suivi et prévision. Une formule arithmétique ne modifie pas silencieusement un stock. L'utilisateur choisit les champs et objets sources ; l'API vérifie types, unités, droits, versions et effet attendu. Un effet validé ne s'applique qu'une fois, y compris après reprise ou synchronisation.
10. **Temps, provenance et prévisions.** Distinguer date du fait, date de saisie et période de validité si nécessaire ; garder sources, méthodes, qualité et incertitude selon le domaine. Une prévision conserve sa méthode, son horizon et ses données sources, et reste visiblement distincte d'une observation. Les données de santé sont privées et aucun résultat ne se présente comme diagnostic.

### Modèle conceptuel cible

`Collection` contient des `DataFormat`, `Entry`, `Object`, `ObjectVariable`, `UnitDefinition`, `View`, `Rule` et `Automation` **locaux**. Un `Object` est une entrée identifiable d'un format de données de la même collection. Un champ de référence d'objet pointe vers son identifiant ; un lien entre entrées ordinaires suit aussi une identité stable. Un stock ou autre état suivi est identifié par son sujet et, si nécessaire, son lieu ou son lot ; ses valeurs courantes sont expliquées par des mouvements ou entrées sources. Les prévisions sont des résultats identifiés comme estimations. Pour l'accès entre collections, un `Transfer` ou `ShareGrant` explicite établit la copie, le déplacement ou le lien autorisé. Ce sont des concepts de domaine ; leurs contrats détaillés se précisent dans les tâches correspondantes sans déclarer T03 incomplet rétroactivement.

## 4. Méthode d'exécution pour chaque tâche

- Traiter les tâches dans l'ordre des dépendances. Une tâche est terminée quand sa validation ci-dessous passe ; mettre son statut à jour dans ce document avec la date et les fichiers touchés.
- Commencer par un petit parcours utilisateur concret et par le contrat API/données. Implémenter ensuite API, web Next.js et Flutter mobile/ordinateur dans la même tranche fonctionnelle. Respecter `brainy_web_app/AGENTS.md` et lire les documents Next.js locaux pertinents avant de modifier ce client.
- Prévoir les textes, erreurs, dates, nombres et unités en anglais/français dès la conception. Les noms et valeurs saisis par les utilisateurs ne sont jamais traduits automatiquement.
- Pour toute migration : sauvegarde de test, lecture des anciennes données, écriture des nouvelles, reprise après interruption, et scénario de retour en arrière. Ne jamais supprimer silencieusement une entrée, une référence ou un format de données.
- Ajouter des tests qui couvrent les règles métier et les erreurs réelles ; éviter les tests qui ne répètent que le code. Vérifier aussi les écrans étroits, le clavier, le lecteur d'écran, les permissions et une base contenant des données plus anciennes.
- La forme visuelle reste sobre et inspirée de l'esprit Fedora sans copier son interface à l'identique : couleurs pastel très légères pour les formats de données, contraste lisible, actions explicites, entrées compactes et détails ouvrables. Les contrôles tactiles doivent rester confortables même si les lignes sont fines.
- **Définition de fini commune :** fonctionnalité utilisable sur les trois expériences d'écran, EN/FR, erreurs compréhensibles, contrôle d'accès API, aucune régression de données, tests métier et parcours manuel représentatif, documentation mise à jour.

## 5. Tâches ordonnées

### Étape A — consolider le noyau existant






### Suivi de T01 à T05 — 21 octobre 2026

| Tâche | État et livrables | Vérification |
| --- | --- | --- |
| T01 | Inventaire et cinq jeux de référence : [docs/T01_INVENTAIRE.md](docs/T01_INVENTAIRE.md), [docs/reference-fixtures.json](docs/reference-fixtures.json). | Test API isolé des anciennes entrées et des règles métier ; tests Flutter aux largeurs 320, 390 et 1200 px. Les cinq parcours de démonstration restent à parcourir visuellement sur appareils réels. |
| T02 | Parcours novice, composants, terminologie et guide responsive EN/FR : [docs/T02_UX_LANGUES.md](docs/T02_UX_LANGUES.md), `brainy_web_app/app/formats.css`, `brainy/lib/workspace_screen.dart`. | Tests Flutter de création d'une collection et d'une entrée à 320/390/1200 px ; builds Next.js, Windows Flutter et APK Android. Contrôle manuel du clavier, du contraste et d'un lecteur d'écran encore nécessaire. |
| T03 | Contrat versionné et stratégie de compatibilité/retour en arrière : [docs/T03_CONTRAT_DONNEES.md](docs/T03_CONTRAT_DONNEES.md), `api/src/collections/`. | Typecheck API et test de lecture d'une collection/entrée antérieure aux formats. Les concepts objet, partage, formule et vue sont documentés, sans implémentation prématurée. |
| T04 | Édition d'un format de données existant sur API, Next.js et Flutter : nom, ajout/ordre des champs, aperçu des entrées concernées, version attendue, refus des changements destructeurs sur champs peuplés. | Tests API et du proxy web de l'aperçu, de la préservation des anciennes valeurs et du conflit de version ; test Flutter de modification à 320 px ; build Next.js. |
| T05 | Booléen, choix unique/multiple, date et heure, durée, texte long, pièce jointe contrôlée et valeur numérique canonique sur API, Next.js et Flutter ; anciens types conservés. | Tests API et du proxy web des valeurs typées et du téléchargement privé ; test Flutter de sérialisation des pièces jointes ; build Next.js. La recherche dans un gros volume est prévue en T06 et n'est pas livrée ici. |

**Portée de la validation :** `npm run typecheck` (API), `npm run smoke:collections`, `npm run smoke:web`, `npm run build` et `npx eslint app lib` (Next.js), `flutter analyze`, `flutter test`, `flutter build windows --debug` et `flutter build apk --debug` ont réussi. Les builds et parcours simulés ne remplacent pas une inspection visuelle sur téléphone/ordinateur ni un test avec lecteur d'écran. Les fichiers de démonstration sont isolés des données des utilisateurs.
                


### Étape B — unités, objets et objets-variables locaux




### Suivi de T06 à T10 — 21 octobre 2026

| Tâche | État et livrables | Vérification |
| --- | --- | --- |
| T06 | Pagination par curseur, tri stable, recherche indexée et filtres typés dans `api/src/collections/` ; chargement par pages sur Next.js et Flutter. | `api/scripts/collections-smoke.mjs` parcourt 2 113 entrées sans doublon, vérifie recherche, filtres et isolation des comptes. |
| T07 | Sauvegarde JSON et tableau CSV ; import contrôlé par lots, correspondance des champs, erreurs par ligne et reprise idempotente dans `brainy_web_app/lib/transfer.ts`, `brainy/lib/collection_transfer.dart` et l’API. Les unités, taux datés, modèles d’objets et liens internes d’objets sont restaurés avec de nouveaux identifiants dans la cible. | Tests API d’import invalide sans création, reprise sans doublon, pièces jointes, taux datés et restauration de lien ; les deux clients utilisent le même contrat. |
| T08 | Catalogue d’unités locales, conversions exactes par facteur, conditionnements de comptage liés à un modèle et taux de change datés ; instantané de l’unité dans les valeurs historiques ; interfaces EN/FR. | Tests API : 20 cartons de 12 donnent 240 bouteilles ; grandeur incompatible refusée ; modifier le facteur ne change pas l’ancienne entrée. Les additions générales relèvent du moteur de formules T21. |
| T09 | Marquage versionné d’un format de données comme modèle d’objets, champ titre requis, modèles de départ copiés localement avec champs EN/FR ; choix dans Next.js et Flutter. | Tests API de définition locale, refus d’objet sans titre et isolation entre collections/comptes ; analyses TypeScript et Dart. |
| T10 | Objets créés comme entrées à identifiant stable ; liste, recherche, détail, édition, suppression contrôlée, duplication et historique visible sur les deux clients. « Utiliser dans une entrée » crée un résumé figé avec lien interne, restauré lors d’un import. | Tests API de deux objets distincts, renommage sans changement d’identifiant, duplication, historique, lien restauré et refus d’accès d’un autre compte. Les champs de référence typés et les valeurs actuelles restent pour T11–T13. |

**Alignement avec la philosophie retenue — 22 octobre 2026 :** [audit de T01 à T10](docs/T01_T10_PHILOSOPHIE_AUDIT.md). Les parcours existants ont été vérifiés et ajustés sur API, Next.js et Flutter : profil privé sans partage implicite, conversion explicite d'entrées en objets, noms dupliqués préservés et résumé figé réservé aux entrées ordinaires. Les capacités prévues après T10 restent futures.

**Portée des vérifications :** typecheck API, test GraphQL avec MongoDB local, build et lint Next.js, analyse et tests Flutter. Les parcours visuels sur téléphone/ordinateur réel, lecteur d’écran et mesures de latence au 95e percentile restent nécessaires avant une livraison publique.




### Étape C — transfert et partage explicites entre collections





### Étape D — vues, temps et rappels




### Suivi de T11 à T20 — 23 octobre 2026

| Tâches | État | Vérification et limites |
| --- | --- | --- |
| T11–T13 | Implémentées : références d'objets locales, objets-variables, valeurs actuelles et instantanés avec provenance et historique. | Test GraphQL des droits et valeurs historiques ; interfaces Next.js et Flutter. |
| T14–T17 | Implémentées : copie des dépendances, partage lié explicite, déplacement avec journal et reprise, copie ou liaison versionnée des formats de données. | Test GraphQL des dépendances, conflits, reprise et séparation des comptes ; interfaces des deux clients. Les formules de T21 ne sont pas encore des dépendances possibles. |
| T18 | Implémentée : vues sauvegardées liste, tableau et fiches, filtres, tri, groupes et champs choisis. | Test GraphQL des vues privées et de la pagination ; build Next.js et analyse Flutter. |
| T19 | Implémentée : vue des tâches et agenda jour/semaine/mois, fuseaux IANA, récurrence et exceptions. | Test GraphQL d'une tâche sans date et d'une récurrence traversant le changement d'heure ; interfaces EN/FR. Contrôles visuels réels encore à effectuer. |
| T20 | Implémentation présente ; validation externe en attente. Rappels par e-mail SMTP et push Firebase avec états, replanification et registre par occurrence/canal. | [Configuration et limites](docs/T20_RAPPELS.md). Test SMTP local réussi ; réception SMTP et Firebase réelles, ainsi que le redémarrage en déploiement, attendent les identifiants et appareils. |

### Étape E — calculs, statistiques et graphiques




### Étape F — modèles concrets, sans types de collection rigides



### Suivi de T21 à T25 — 24 octobre 2026

| Tâche | État constaté | Travail restant pour le critère « terminé quand » |
| --- | --- | --- |
| T21 | Moteur de formules typées, par format de données, avec arithmétique, écart entre deux champs date ou date/heure, arrondi configurable de 0 à 6 décimales (moitié vers le haut ou vers le pair), références aux propriétés numériques d'objet, contrôle des unités, cycles, divisions par zéro, versions et valeurs historiques. Création, modification versionnée de formules simples et calcul dans les deux clients. Les aperçus affichent les formules ; copie et déplacement remappent leurs identifiants et les vérifient. | Étendre le constructeur visuel au-delà de deux opérandes et vérifier les cas monétaires de bout en bout, notamment les transferts et la mise à jour de formats liés. |
| T22 | Compte, somme, moyenne, minimum, maximum ; groupes jour, mois, catégorie et objet ; périodes comparées, sources, jusqu'à huit filtres typés dans l'API et les deux clients, et distinction événement/instantané/taux. Les deux clients peuvent choisir une période de comparaison. L'API parcourt les entrées par curseur jusqu'à 100 000 entrées par analyse et cumule les valeurs par groupe sans les garder toutes en mémoire ; elle conserve actuellement la liste des sources. | Mesurer les temps et la mémoire sur de grands jeux, paginer les sources des résultats et enregistrer des tableaux de bord. |
| T23 | Table source et graphiques barres, courbe temporelle et répartition positive dans Next.js et Flutter, avec valeur et unité. Une source ouvre maintenant son entrée par lecture ciblée et contrôlée côté API sur les deux clients. | Améliorer axes, légendes, navigation tactile et accessibilité après vérification sur appareils réels ; aligner les options de graphiques sur les valeurs négatives et manquantes. |
| T24 | Modèles locaux « partir de zéro », notes, liens, tâches, agenda, dépenses et livre ; parcours manuel conservé. | Valider les parcours novices sur appareils ; enrichir les modèles dépendants de T26–T27 quand ces capacités existeront. |
| T25 | Formats chapitre/scène/note avec champ « Ordre » persistant et vue « Manuscrit » triée côté API, y compris la pagination ; liens stables entre entrées, retrait/restauration, export JSON/CSV avec liens et export texte lisible trié par ordre saisi, recherche existante et avertissement de doublon d'URL ; ouverture d'une entrée liée dans les deux clients. Un test Flutter vérifie l'ordre et les liens de l'export d'un livre d'exemple ; une note sans ordre est exportée après les chapitres sur les deux clients. | Vérifier le parcours complet de restauration après import et tester l'export texte avec un livre réel. |

Vérifications réalisées : `api/scripts/analysis-smoke.mjs` passe sur l'API locale, y compris écart entre dates, arrondi, copie et modification versionnée d'une formule, somme/moyenne/minimum/maximum, recalcul après correction d'une entrée, comparaison de périodes, filtres combinés, contrôle d'accès à une entrée source, tri manuel paginé du livre, import des liens, détection d'URL en double et comptage de 10 005 entrées ; `flutter test test/book_export_test.dart` passe pour l'ordre et les liens d'un livre d'exemple ; `api/scripts/demo-seed.mjs` confirme dans le compte de démonstration une vente à 3,6 EUR et une perte de masse à 23,6 g ; build API/Next.js et analyse statique Flutter sans erreur bloquante. Ces contrôles ne remplacent pas les essais sur appareils.



### Étape G — organisation, gros volumes et exploitation







## 6. Portes de livraison

| Palier | Tâches nécessaires | Démonstration attendue |
| --- | --- | --- |
| Base fiable | T01–T07 | Notes, liens et nombreuses entrées restent simples et retrouvables. |
| Objets locaux | T08–T13 | Un objet structuré nourrit une entrée et un objet-variable, avec unités et historique corrects. |
| Réutilisation contrôlée | T14–T17 | L'utilisateur choisit exactement quoi copier, partager ou déplacer vers une collection cible. |
| Temps et analyse | T18–T23 | Listes de tâches, agenda/rappels, calculs et graphiques reposent sur les mêmes entrées. |
| Domaines concrets | T24–T27 | Notes liées, boutique avec mouvements, mesures et première prévision explicable ont des parcours prêts à l'emploi sans changer le noyau. |
| Organisation et volume | T28–T32 | Droits, sauvegardes, traitements et limites de charge sont prouvés. |
| Mise en relation | T33 | Fonction séparée, avec consentement et profil privé par défaut. |

## 7. Références techniques à vérifier au moment d'implémenter

- [GraphQL — pagination](https://graphql.org/learn/pagination/) : forme des connexions et curseurs ; adapter le choix aux requêtes Brainy.
- [MongoDB — versionnement des schémas](https://www.mongodb.com/docs/manual/data-modeling/design-patterns/data-versioning/) : préserver les anciennes données lors des évolutions ; ne pas appliquer un motif sans examiner la charge réelle.
- [MongoDB — transactions](https://www.mongodb.com/docs/manual/core/transactions/) : évaluer l'atomicité des transferts entre documents.
- [UCUM — unités](https://ucum.org/ucum) : distinguer grandeurs convertibles et unités arbitraires ; les unités locales Brainy nécessitent leurs propres règles.
- [W3C WCAG 2.2 — taille minimale des cibles](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) : concilier lignes compactes et commandes tactiles accessibles.
- [Microsoft — event sourcing](https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing) : considérer ce motif seulement si ses avantages justifient sa complexité ; un registre de mouvements métier n'impose pas de l'adopter pour toute l'application.

**Ne pas exécuter cette feuille de route d'un seul bloc.** Livrer et vérifier chaque palier, mesurer les usages, puis ajuster le suivant sans perdre la philosophie de Brainy : l'utilisateur décrit ses propres données et choisit comment les exploiter.
