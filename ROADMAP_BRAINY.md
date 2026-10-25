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

**T01 — Inventaire fonctionnel et jeu de parcours de référence** · Dépendances : aucune.
- Relever les contrats GraphQL, les schémas MongoDB, les traductions et les différences web/Flutter ; créer des données de démonstration pour notes, liens, agenda, boutique et mesures. Identifier précisément les comportements absents et les limites actuelles, notamment la valeur stockée comme chaîne et l'absence de pagination.
- **Terminé quand :** une matrice « existe / partiel / absent » est vérifiable, et les parcours actuels passent sur les trois expériences d'écran sans modifier les données de l'utilisateur.

**T02 — Socle UX, design et langues** · Dépendances : T01.
- Définir composants visuels communs : navigation, ligne d'entrée, détail, éditeur de champ, sélection de couleur, état vide, chargement, erreur et confirmation. Définir tailles d'écran et gestes de base. Mettre sous contrôle les libellés EN/FR et la terminologie « data format / format de données ».
- **Terminé quand :** un novice peut créer une collection et sa première note sans utiliser de fonction avancée ; les actions restent claires à 320 px, sur tablette et sur ordinateur ; navigation clavier, focus visible, contraste et cibles tactiles sont vérifiés.

**T03 — Contrats de données et stratégie d'évolution** · Dépendances : T01.
- Rédiger les contrats cibles pour valeur typée, version de format de données, objet local, référence, objet-variable, unité, partage, formule, vue et automatisation. Fixer les identifiants immuables, les clés `ownerId`/`collectionId`, les règles de suppression et les erreurs GraphQL. Choisir comment les anciens clients continueront à lire les valeurs de type chaîne pendant la transition.
- **Terminé quand :** schéma, exemples JSON/GraphQL, migrations progressives, plan de retour en arrière et matrice de compatibilité sont documentés ; aucune nouvelle capacité ne requiert de rendre tous les objets globalement visibles.

**T04 — Modifier un format de données sans casser ses entrées** · Dépendances : T03.
- Ajouter changement de nom, ajout et réorganisation de champs, puis traiter explicitement changement de type, d'unité et suppression de champ. Versionner la définition ou maintenir une migration contrôlée ; afficher l'impact sur entrées, objets, vues et formules avant d'appliquer. Conserver les anciens identifiants utiles aux entrées historiques.
- **Terminé quand :** une ancienne entrée reste lisible après chaque modification permise ; une modification incompatible est refusée ou guidée par une migration avec aperçu ; tests API/web/Flutter et anciens enregistrements passent.

**T05 — Valeurs typées et champs utiles à de nombreux domaines** · Dépendances : T03, T04.
- Ajouter progressivement booléen, choix unique/multiple, date et heure avec fuseau si nécessaire, durée, pièce jointe et texte long adapté aux notes ; conserver les sept types actuels. Séparer valeur numérique canonique, unité et affichage localisé ; conserver la lecture des anciennes chaînes.
- **Terminé quand :** validation identique côté API et clients, erreurs par champ, recherche et copie correctes, et migration sans perte pour date/nombre/texte existants.

### Suivi de T01 à T05 — 21 octobre 2026

| Tâche | État et livrables | Vérification |
| --- | --- | --- |
| T01 | Inventaire et cinq jeux de référence : [docs/T01_INVENTAIRE.md](docs/T01_INVENTAIRE.md), [docs/reference-fixtures.json](docs/reference-fixtures.json). | Test API isolé des anciennes entrées et des règles métier ; tests Flutter aux largeurs 320, 390 et 1200 px. Les cinq parcours de démonstration restent à parcourir visuellement sur appareils réels. |
| T02 | Parcours novice, composants, terminologie et guide responsive EN/FR : [docs/T02_UX_LANGUES.md](docs/T02_UX_LANGUES.md), `brainy_web_app/app/formats.css`, `brainy/lib/workspace_screen.dart`. | Tests Flutter de création d'une collection et d'une entrée à 320/390/1200 px ; builds Next.js, Windows Flutter et APK Android. Contrôle manuel du clavier, du contraste et d'un lecteur d'écran encore nécessaire. |
| T03 | Contrat versionné et stratégie de compatibilité/retour en arrière : [docs/T03_CONTRAT_DONNEES.md](docs/T03_CONTRAT_DONNEES.md), `api/src/collections/`. | Typecheck API et test de lecture d'une collection/entrée antérieure aux formats. Les concepts objet, partage, formule et vue sont documentés, sans implémentation prématurée. |
| T04 | Édition d'un format de données existant sur API, Next.js et Flutter : nom, ajout/ordre des champs, aperçu des entrées concernées, version attendue, refus des changements destructeurs sur champs peuplés. | Tests API et du proxy web de l'aperçu, de la préservation des anciennes valeurs et du conflit de version ; test Flutter de modification à 320 px ; build Next.js. |
| T05 | Booléen, choix unique/multiple, date et heure, durée, texte long, pièce jointe contrôlée et valeur numérique canonique sur API, Next.js et Flutter ; anciens types conservés. | Tests API et du proxy web des valeurs typées et du téléchargement privé ; test Flutter de sérialisation des pièces jointes ; build Next.js. La recherche dans un gros volume est prévue en T06 et n'est pas livrée ici. |

**Portée de la validation :** `npm run typecheck` (API), `npm run smoke:collections`, `npm run smoke:web`, `npm run build` et `npx eslint app lib` (Next.js), `flutter analyze`, `flutter test`, `flutter build windows --debug` et `flutter build apk --debug` ont réussi. Les builds et parcours simulés ne remplacent pas une inspection visuelle sur téléphone/ordinateur ni un test avec lecteur d'écran. Les fichiers de démonstration sont isolés des données des utilisateurs.
                
**T06 — Retrouver beaucoup d'entrées** · Dépendances : T03, T05.
- Ajouter pagination par curseur à `collectionEntries`, recherche plein texte adaptée aux notes/liens, filtres typés par champ et tri stable (date + identifiant). Indexer selon les requêtes réelles ; charger les listes par pages sur web et Flutter, sans récupérer toute la collection à chaque ouverture.
- **Terminé quand :** plusieurs milliers d'entrées restent navigables, les filtres retrouvent les mêmes résultats après rafraîchissement et les requêtes d'un compte ne révèlent rien d'un autre.

**T07 — Exportation et importation fiables** · Dépendances : T04–T06.
- Offrir export lisible par humain et export structuré conservant collections, formats, identifiants, unités déjà définies dans les champs et dates. Étendre ce contrat aux futures unités locales, objets et liens lors de T08–T17. Pour l'import, montrer les colonnes associées, les erreurs ligne par ligne et le nombre d'entrées créées ; permettre une reprise sans doublons. Ne pas traiter une pièce jointe comme une simple URL non vérifiée.
- **Terminé quand :** un export réimporté dans un compte de test restitue les champs et entrées attendus ; un fichier invalide n'efface aucune donnée existante.

### Étape B — unités, objets et objets-variables locaux

**T08 — Catalogue d'unités par collection** · Dépendances : T03, T05.
- Garder les unités intégrées ; autoriser une définition locale avec nom, symbole, grandeur/dimension, base éventuelle, facteur et portée. Ajouter conditionnements de comptage liés à un type d'objet, par exemple « carton de 12 bouteilles ». Séparer devise et taux de change daté d'une conversion physique fixe.
- **Terminé quand :** additions/conversions incompatibles sont refusées ; `20 cartons × 12 bouteilles/carton` donne 240 bouteilles uniquement avec la conversion définie ; modifier une unité n'altère pas les ventes historiques.

**T09 — Définition d'objets dans une collection** · Dépendances : T04, T05, T08.
- Permettre à l'utilisateur de désigner un format de données local comme modèle d'objets et d'y définir des caractéristiques typées : texte, nombre et unité, date, lien, autre objet autorisé, etc. Prévoir des modèles précréés à copier localement, sans imposer leurs champs. Versionner ces caractéristiques comme les autres champs.
- **Terminé quand :** une collection « Boutique » définit « Produit » avec poids, prix, densité et dimensions ; une collection « Recherche » définit un tout autre objet sans modifier le modèle global.

**T10 — Créer, consulter et modifier des objets** · Dépendances : T09, T06.
- Traiter l'objet comme une entrée identifiable de sa collection et de son format, avec vues liste/détail, recherche, duplicata et historique minimal. Donner des actions claires « Créer un objet » et « Utiliser dans une entrée », sans exposer le vocabulaire technique au novice avant qu'il en ait besoin.
- **Terminé quand :** plusieurs objets du même modèle ont des caractéristiques différentes ; renommer un objet garde ses liens ; l'API refuse tout accès hors de la collection autorisée.

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

**T11 — Références d'objet locales dans les entrées** · Dépendances : T10, T05.
- Ajouter un champ de référence typé avec modèle cible et cardinalité (un ou plusieurs objets). Dans le formulaire, choisir l'objet local par recherche ; stocker son identifiant, afficher ses caractéristiques consultables et détecter références manquantes ou supprimées. Définir le comportement de suppression : empêcher ou proposer remplacement/détachement après aperçu.
- **Terminé quand :** une vente référence un produit local, retrouve ses caractéristiques après renommage, et aucune référence ne peut viser une collection étrangère sans partage explicite.

**T12 — Objets-variables locaux** · Dépendances : T11.
- Permettre à un format de données de définir un nom de variable tel que `produit`, son modèle d'objet accepté et sa source dans l'entrée. Exposer ses propriétés typées (`produit.poids`) à un sélecteur visuel ; conserver des identifiants internes pour que les renommages ne cassent pas les expressions. Si une référence vise plusieurs objets, exiger une sélection ou une agrégation explicite avant d'utiliser une propriété comme nombre unique. Empêcher les références circulaires non maîtrisées. Un objet-variable n'exige pas de stock.
- **Terminé quand :** deux collections peuvent avoir chacune une variable `produit` différente sans collision ; l'entrée ne peut lier que les objets permis ; une propriété absente produit une erreur explicite.

**T13 — Valeurs actuelles, instantanés et historique** · Dépendances : T10–T12.
- Définir, pour chaque usage d'une propriété d'objet, « suivre la valeur actuelle » ou « figer à l'enregistrement ». Appliquer un instantané par défaut aux prix, quantités converties et autres éléments d'une transaction ; conserver l'identité de la source, la valeur, l'unité, la date et la version utilisées. Prévoir l'affichage de la provenance.
- **Terminé quand :** changer aujourd'hui le prix ou le poids d'un produit ne change pas une vente historique figée ; une vue explicitement « valeur actuelle » se met à jour ; les deux comportements sont testés.

### Étape C — transfert et partage explicites entre collections

**T14 — Copier objets et dépendances vers une autre collection** · Dépendances : T08–T13.
- Ajouter « Copier vers… » avec choix de la collection cible et aperçu : format de données requis, unités locales, objets référencés, objets-variables et conflits de noms/couleurs. Copier avec de nouveaux identifiants, associer les références et variables internes aux copies, conserver source et provenance. Si une dépendance ne peut pas suivre, demander une correspondance compatible ou bloquer la copie ; ne jamais écraser silencieusement un objet cible. Étendre cet aperçu aux formules quand T21 les introduira.
- **Terminé quand :** une copie fonctionne sans la source, ses caractéristiques et unités restent cohérentes, et une tentative partiellement invalide ne laisse pas d'objets orphelins.

**T15 — Partager un objet lié entre deux collections** · Dépendances : T14.
- Ajouter « Partager par lien vers… » explicitement. L'objet reste propriétaire de sa collection source ; la cible reçoit une liaison autorisée, limitée aux caractéristiques choisies, avec mode valeur actuelle ou instantané. Un objet-variable local de la cible peut viser cette liaison seulement après un choix explicite. Vérifier accès à chaque lecture ; prévoir révocation, suppression de source, dépendances et notification d'impact. Aucun lien transversal n'est créé par une simple saisie du nom.
- **Terminé quand :** la cible n'accède qu'aux propriétés accordées, une révocation coupe la lecture future sans détruire les instantanés historiques, et une autre collection non autorisée ne voit rien.

**T16 — Déplacer un objet** · Dépendances : T14, T15.
- Ajouter « Déplacer vers… » seulement après avoir identifié toutes les entrées, variables, partages et calculs qui pointent vers l'objet. Proposer transfert des dépendances, remplacement ou annulation. Effectuer l'opération de manière atomique ou avec compensation/reprise et journal d'opération ; présenter un résumé avant confirmation.
- **Terminé quand :** aucune référence ne devient silencieusement invalide ; un échec intermédiaire restaure ou reprend correctement la migration ; l'objet n'existe plus dans la source uniquement lorsque la cible est valide.

**T17 — Partager et migrer un format de données** · Dépendances : T04, T08, T14.
- Ajouter copie d'un format vers une collection choisie, avec nouveaux identifiants de format/champs, couleur pastel obligatoire disponible dans la cible et traitement des unités, références d'objet et objets-variables. Une copie de définition n'emporte pas automatiquement les entrées ; « copier avec entrées » est une action séparée avec aperçu et correspondance des identifiants. Proposer aussi le partage lié d'un modèle de format versionné : la cible choisit de garder sa version ou d'accepter une évolution, avec aperçu de l'effet sur ses entrées. Ne pas permettre le déplacement destructeur d'un format utilisé sans migration de toutes ses entrées et dépendances. Étendre les vérifications aux calculs introduits à T21.
- **Terminé quand :** une collection cible crée de nouvelles entrées avec le format copié ou lié ; les anciennes entrées de la source restent lisibles ; une modification du format source ne casse pas la cible sans accord ; conflits et dépendances sont visibles avant l'action.

### Étape D — vues, temps et rappels

**T18 — Vues sauvegardées d'une même collection** · Dépendances : T06, T11.
- Définir liste, tableau et fiches détaillées comme présentations de la même source, avec filtres, colonnes, tri et groupes mémorisés. Une vue cible un ou plusieurs formats compatibles et ne duplique pas les entrées. Les utilisateurs débutants gardent une liste simple par défaut.
- **Terminé quand :** une modification d'entrée apparaît dans toutes ses vues ; les préférences ne changent pas les données ; chaque vue reste utilisable sur mobile et ordinateur.

**T19 — Agenda et emploi du temps** · Dépendances : T05, T18.
- Ajouter le parcours liste de tâches avec état, priorité facultative, échéance facultative et achèvement, sans imposer de créneau horaire. Pour l'agenda, ajouter début/fin, fuseau horaire, durée et récurrence définie ; vues jour/semaine/mois et liste accessible. Garder la date de création distincte de la date planifiée et de la date d'achèvement. Définir le traitement des changements d'heure, créneaux chevauchants et exceptions de récurrence avant d'écrire la logique.
- **Terminé quand :** une tâche sans date peut être créée, terminée et retrouvée ; une tâche datée, un rendez-vous récurrent et une exception s'affichent à la bonne heure sur les clients EN/FR ; les notes sans date restent dans leur liste normale.

**T20 — Rappels fiables** · Dépendances : T19, T03.
- Définir un rappel local à une entrée/date, son avance, son canal et son état. Planifier côté serveur lorsque l'app est fermée ; gérer permissions et tokens de notification pour les appareils, fuseaux, annulation, répétition, erreurs et envoi idempotent. Ne promettre un canal que s'il est effectivement disponible sur la plateforme.
- **Terminé quand :** création, modification et suppression d'une tâche mettent à jour le rappel ; un redémarrage ou un nouveau téléphone ne génère pas de doublon ; le rappel arrive au moment prévu sur les plateformes annoncées.

### Suivi de T11 à T20 — 23 octobre 2026

| Tâches | État | Vérification et limites |
| --- | --- | --- |
| T11–T13 | Implémentées : références d'objets locales, objets-variables, valeurs actuelles et instantanés avec provenance et historique. | Test GraphQL des droits et valeurs historiques ; interfaces Next.js et Flutter. |
| T14–T17 | Implémentées : copie des dépendances, partage lié explicite, déplacement avec journal et reprise, copie ou liaison versionnée des formats de données. | Test GraphQL des dépendances, conflits, reprise et séparation des comptes ; interfaces des deux clients. Les formules de T21 ne sont pas encore des dépendances possibles. |
| T18 | Implémentée : vues sauvegardées liste, tableau et fiches, filtres, tri, groupes et champs choisis. | Test GraphQL des vues privées et de la pagination ; build Next.js et analyse Flutter. |
| T19 | Implémentée : vue des tâches et agenda jour/semaine/mois, fuseaux IANA, récurrence et exceptions. | Test GraphQL d'une tâche sans date et d'une récurrence traversant le changement d'heure ; interfaces EN/FR. Contrôles visuels réels encore à effectuer. |
| T20 | Implémentation présente ; validation externe en attente. Rappels par e-mail SMTP et push Firebase avec états, replanification et registre par occurrence/canal. | [Configuration et limites](docs/T20_RAPPELS.md). Test SMTP local réussi ; réception SMTP et Firebase réelles, ainsi que le redémarrage en déploiement, attendent les identifiants et appareils. |

### Étape E — calculs, statistiques et graphiques

**T21 — Moteur de formules typées et sûr** · Dépendances : T05, T08, T12, T13.
- Définir une syntaxe ou représentation structurée pour nombres, unités, dates, champs et propriétés d'objets-variables ; sélectionner visuellement les champs sources par identifiants stables et valider côté API, sans exécuter de code fourni par l'utilisateur. Gérer valeurs absentes, arrondis, précision monétaire, division par zéro, profondeur, coût et cycles. Versionner les formules et tracer leurs dépendances ; les inclure dans les aperçus de copie, partage et déplacement de T14–T17. Séparer le résultat calculé pour une entrée d'un effet sur un état suivi ; le moteur de formules n'applique pas seul une mutation de stock.
- **Terminé quand :** `quantité × produit.poids` calcule une unité correcte ; euros + kilomètres et cycles sont refusés ; renommer un champ ne détruit pas la formule ; le même résultat est obtenu sur web, Flutter et API sans changement d'état caché.

**T22 — Agrégats et analyses commerciales/statistiques** · Dépendances : T21, T06, T18.
- Ajouter somme, compte, moyenne, minimum, maximum et regroupement par période, catégorie ou objet ; préciser filtre, format de données, unité, sens temporel de chaque mesure et traitement des valeurs absentes. Permettre comparaison de périodes et table source de chaque résultat ; calculer côté serveur pour gros ensembles, avec mise à jour ou invalidation des résultats mis en cache. Distinguer sommes de mouvements, mesures instantanées et taux pour éviter des agrégats trompeurs.
- **Terminé quand :** les chiffres d'un tableau de bord correspondent aux entrées filtrées ; une correction d'entrée recalcule les résultats ; les utilisateurs ne peuvent pas agréger les données d'un autre compte.

**T23 — Graphiques lisibles** · Dépendances : T22.
- Proposer courbe, barres et répartition seulement quand les champs et regroupements le permettent. Indiquer titre, axes, unités, intervalle, données manquantes et date de rafraîchissement. Fournir la table sous-jacente accessible et un retour vers les entrées concernées ; adapter gestes et densité à mobile/ordinateur. Lorsque T27 introduira des prévisions, les afficher comme estimations distinctes des mesures observées, avec horizon et incertitude.
- **Terminé quand :** un graphique de ventes par jour et un graphique de poids par produit ont des unités justes et les mêmes valeurs que leur tableau ; il reste compréhensible sans couleur seule.

### Étape F — modèles concrets, sans types de collection rigides

**T24 — Modèles de départ et parcours progressif** · Dépendances du socle : T02, T05. Extensions après leurs capacités : T19, T21–T23, T26 et T27.
- Livrer « Partir de zéro », Notes/Écriture (bloc-notes) et Liens avec un mécanisme de modèles extensible. Ajouter ensuite Liste de tâches et Agenda sur la capacité de T19, Dépenses avec les calculs compatibles, Boutique/Stock avec T26 et Mesures avec T27. Un modèle crée uniquement des formats de données, objets locaux d'exemple si demandés, vues et règles disponibles ; tout reste modifiable. Montrer une explication en langage simple avant les choix avancés. Aucun modèle n'impose objets, stock ou formules à une note simple.
- **Terminé quand :** une personne novice crée sa première entrée depuis chaque modèle disponible en quelques actions ; le même résultat peut être obtenu manuellement par un expert ; aucun modèle n'enferme la collection dans un type permanent. Les modèles avancés sont validés lors de leur tâche métier et ne bloquent pas le socle de T24.

**T25 — Écriture de livre et collecte de liens** · Dépendances : T03, T05, T06, T18, T24.
- Parcours « Livre » : chapitres, scènes et notes, texte long, liens stables entre entrées ordinaires sans exiger un modèle d'objet, recherche, ordre manuel et export lisible. Définir création, suppression et restauration de ces liens avec contrôle d'accès. Parcours « Liens » : URL validée, titre, commentaire, catégorie, date de sauvegarde, dédoublonnage explicite et recherche. Ne pas télécharger automatiquement des pages web sans définir permissions et provenance.
- **Terminé quand :** un auteur relie deux notes sans créer d'objet, retrouve une scène par mot-clé et exporte ses notes avec leurs liens ; une personne retrouve un lien conservé et peut le copier/ouvrir depuis mobile, web ou ordinateur.

### Suivi de T21 à T25 — 24 octobre 2026

| Tâche | État constaté | Travail restant pour le critère « terminé quand » |
| --- | --- | --- |
| T21 | Moteur de formules typées, par format de données, avec arithmétique, écart entre deux champs date ou date/heure, arrondi configurable de 0 à 6 décimales (moitié vers le haut ou vers le pair), références aux propriétés numériques d'objet, contrôle des unités, cycles, divisions par zéro, versions et valeurs historiques. Création, modification versionnée de formules simples et calcul dans les deux clients. Les aperçus affichent les formules ; copie et déplacement remappent leurs identifiants et les vérifient. | Étendre le constructeur visuel au-delà de deux opérandes et vérifier les cas monétaires de bout en bout, notamment les transferts et la mise à jour de formats liés. |
| T22 | Compte, somme, moyenne, minimum, maximum ; groupes jour, mois, catégorie et objet ; périodes comparées, sources, jusqu'à huit filtres typés dans l'API et les deux clients, et distinction événement/instantané/taux. Les deux clients peuvent choisir une période de comparaison. L'API parcourt les entrées par curseur jusqu'à 100 000 entrées par analyse et cumule les valeurs par groupe sans les garder toutes en mémoire ; elle conserve actuellement la liste des sources. | Mesurer les temps et la mémoire sur de grands jeux, paginer les sources des résultats et enregistrer des tableaux de bord. |
| T23 | Table source et graphiques barres, courbe temporelle et répartition positive dans Next.js et Flutter, avec valeur et unité. Une source ouvre maintenant son entrée par lecture ciblée et contrôlée côté API sur les deux clients. | Améliorer axes, légendes, navigation tactile et accessibilité après vérification sur appareils réels ; aligner les options de graphiques sur les valeurs négatives et manquantes. |
| T24 | Modèles locaux « partir de zéro », notes, liens, tâches, agenda, dépenses et livre ; parcours manuel conservé. | Valider les parcours novices sur appareils ; enrichir les modèles dépendants de T26–T27 quand ces capacités existeront. |
| T25 | Formats chapitre/scène/note avec champ « Ordre » persistant et vue « Manuscrit » triée côté API, y compris la pagination ; liens stables entre entrées, retrait/restauration, export JSON/CSV avec liens et export texte lisible trié par ordre saisi, recherche existante et avertissement de doublon d'URL ; ouverture d'une entrée liée dans les deux clients. Un test Flutter vérifie l'ordre et les liens de l'export d'un livre d'exemple ; une note sans ordre est exportée après les chapitres sur les deux clients. | Vérifier le parcours complet de restauration après import et tester l'export texte avec un livre réel. |

Vérifications réalisées : `api/scripts/analysis-smoke.mjs` passe sur l'API locale, y compris écart entre dates, arrondi, copie et modification versionnée d'une formule, somme/moyenne/minimum/maximum, recalcul après correction d'une entrée, comparaison de périodes, filtres combinés, contrôle d'accès à une entrée source, tri manuel paginé du livre, import des liens, détection d'URL en double et comptage de 10 005 entrées ; `flutter test test/book_export_test.dart` passe pour l'ordre et les liens d'un livre d'exemple ; `api/scripts/demo-seed.mjs` confirme dans le compte de démonstration une vente à 3,6 EUR et une perte de masse à 23,6 g ; build API/Next.js et analyse statique Flutter sans erreur bloquante. Ces contrôles ne remplacent pas les essais sur appareils.

**T26 — Boutique et mouvements de stock** · Dépendances : T08–T13, T21–T24.
- Proposer des modèles locaux Produit, Entrée de stock, Sortie/Vente et Fournisseur, sans les imposer. Construire la capacité générale d'**effet explicite sur un état suivi**, puis l'appliquer au stock : l'utilisateur choisit le champ objet, le champ quantité et l'effet entrée, sortie, transfert ou correction. Identifier chaque stock par produit et, si utile, lieu ou lot ; permettre un inventaire initial par mouvement. Les exemplaires interchangeables sont comptés par quantité, tandis que les exemplaires à identité propre peuvent être suivis séparément. Chaque mouvement enregistre date du fait, date de saisie, produit référencé, quantité/conditionnement, prix instantané si pertinent, motif et auteur ; le stock courant est dérivé des mouvements validés. Montrer l'effet avant validation, l'appliquer une seule fois et définir annulation/correction, transfert cohérent et règle de stock négatif configurable. Ne pas présenter ce module comme une comptabilité ou fiscalité certifiée.
- Copier ou partager un produit vers une autre collection ne copie ni ne déplace implicitement son stock ou ses mouvements : demander une action et une cible explicites, avec aperçu des dépendances et de l'effet physique ou comptable attendu.
- **Terminé quand :** une vente diminue le bon stock une seule fois, même après reprise ; un transfert conserve la quantité totale ; un retour corrige la vente sans effacer l'historique ; un rapport quotidien explique chaque total par ses mouvements sources.

**T27 — Mesures, recherche, tableaux de bord et prévisions de domaine** · Dépendances : T08, T21–T24.
- Préparer des exemples de mesures scientifiques, météo, suivi personnel de santé et exploitation de machines : objet mesuré, nombre + unité, date/heure du fait distincte de la saisie, conditions, qualité et source. Garder les données de santé privées et ne pas présenter les analyses comme un diagnostic. Vérifier dimensions, conversions et regroupements avant de proposer une formule. Permettre des tableaux de bord adaptés sans introduire un nouveau type de collection. Définir puis livrer une première prévision limitée et explicable sur une série compatible : choix de la méthode et de la période source, horizon, estimation et incertitude, comparaison avec des observations tenues à l'écart. Afficher la prévision séparément des faits et refuser les jeux de données insuffisants ; ne promettre aucune prévision universelle ou conseil médical.
- **Terminé quand :** deux domaines avec champs différents partagent le même noyau, sans calcul entre grandeurs incompatibles ; une prévision simple de ventes ou mesures indique ses sources, son horizon et son incertitude sans se confondre avec les observations ; les graphiques restent lisibles sur les trois expériences d'écran.

### Étape G — organisation, gros volumes et exploitation

**T28 — Droits, audit et collaboration** · Dépendances : T15, T17, T03.
- Étendre la propriété personnelle à des espaces d'équipe seulement après définition de rôles (propriétaire, éditeur, lecteur), droits par collection et partage d'objet/format. Prévoir une sélection explicite des entrées et champs partageables, particulièrement pour les données personnelles ou de santé ; les vues, calculs et prévisions ne doivent pas révéler de données sources non autorisées. Tracer qui a créé, changé, partagé, révoqué ou déplacé une donnée ; éviter d'exposer le profil privé par le partage d'une collection.
- **Terminé quand :** les refus d'accès sont imposés par l'API, même si le client est contourné ; un journal permet de reconstruire les actions sensibles ; les données d'un autre espace ne fuient pas par recherche, partage, graphique ou prévision.

**T29 — Sauvegarde, reprise et synchronisation** · Dépendances : T07, T26–T28.
- Tester sauvegarde/restauration et export complet d'un espace, y compris définitions, références, règles, mouvements de stock, instantanés, historiques et prévisions avec leur provenance. Définir si le travail hors ligne est nécessaire ; si oui, ajouter file locale de changements, identifiants temporaires, reprise et résolution visible des conflits. Préserver les instantanés et l'application unique des effets sur état lors d'une synchronisation tardive.
- **Terminé quand :** une restauration de test restitue les liens internes ; une interruption réseau ne crée pas de doublon ni de perte ; les conflits ne sont pas arbitrés silencieusement.

**T30 — Chargement massif et traitements asynchrones** · Dépendances : T06, T07, T22, T26–T28.
- Créer des tâches d'import, export, recalcul, génération de graphiques et prévisions avec état, progression, annulation sûre et reprise. Limiter la taille et le coût par requête ; fournir retours par lot et logs utiles. Ne pas bloquer l'interface pendant un traitement long ni laisser un état suivi partiellement mis à jour.
- **Terminé quand :** un grand import peut être interrompu puis repris sans doublon ; les utilisateurs voient les erreurs et résultats ; les tâches restent isolées par compte/espace.

**T31 — Mesures de charge et architecture adaptée** · Dépendances : T30.
- Mesurer la consultation, recherche, écriture, migration, agrégation et prévision avec jeux de 1 000, 100 000 puis 1 000 000 d'entrées, en notant matériel, coût et temps au 95e percentile. Optimiser index, pagination, projections, cache et stockage à partir des mesures. Séparer stockage opérationnel, recherche et calcul analytique seulement si les charges l'exigent ; décider archivage et rétention par domaine.
- **Terminé quand :** budgets de latence et coût approuvés sont respectés sur les charges cibles, sans régression des petits comptes ; aucun client ne charge la totalité des entrées en mémoire pour afficher une page.

**T32 — Connecteurs et données industrielles** · Dépendances : T28–T31.
- Concevoir imports CSV/API, puis flux réguliers avec identifiant de source, date du fait distincte de la réception, unité, qualité, validation, dédoublonnage et traçabilité. Tester des formats de données évolutifs et des mises à jour fréquentes d'objets. Pour les besoins spécialisés (temps réel dur, réglementation, calcul scientifique spécifique), ajouter un module de domaine ou une intégration plutôt que modifier la signification du noyau.
- **Terminé quand :** une source volumineuse alimente une collection autorisée de façon mesurable et réparable ; les données rejetées sont explicables ; le système ne promet pas des garanties industrielles non testées.

**T33 — Mise en relation entre personnes (axe séparé)** · Dépendances : T28 et décision produit sur consentement.
- Réutiliser uniquement les éléments du profil que la personne choisit de rendre visibles ; définir consentement, découverte, contrôle de visibilité et suppression. Ne pas confondre le partage d'objets/collections avec le partage du profil personnel.
- **Terminé quand :** le profil reste privé par défaut et la mise en relation fonctionne sans exposer les collections ni les données sensibles.

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
