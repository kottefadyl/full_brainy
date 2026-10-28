# Principes communs des tâches

## 1. Résultat recherché

Faire de Brainy un espace où une personne ou une organisation peut **stocker, retrouver, relier, présenter et traiter ses données**, depuis une note, une tâche ou un rendez-vous jusqu'aux données opérationnelles volumineuses. Conserver un noyau intelligible : **collection → formats de données → entrées**. Ajouter ensuite des capacités modulaires : objets, relations, unités, stocks et autres états suivis, règles, vues, calculs, graphiques, rappels, importation et gouvernance. Les modèles « Notes », « Agenda » ou « Boutique » sont des aides de départ modifiables, jamais des types de collection irréversibles.

L'interface doit rester belle, calme, rapide et accessible. Un novice peut créer une collection et écrire une première entrée sans voir les options avancées. Un professionnel peut activer les fonctions nécessaires progressivement. Toute capacité livrée doit fonctionner dans **Next.js web responsive** et **Flutter mobile/ordinateur**, en **anglais et français**. Flutter ne doit pas redevenir le client web.

« Toucher presque tous les domaines » signifie fournir des primitives composables et des modèles spécialisés. Cela ne signifie pas promettre immédiatement une conformité comptable, médicale, industrielle ou réglementaire propre à chaque domaine.

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

## 8. Extension Brainy 1.1 (T34 à T45) — Positionnement et règles 11 à 18

**Positionnement 1.1 :** Brainy est l'établi de données structurées des particuliers, des petites équipes et des chercheurs, et une porte d'entrée vers des systèmes spécialisés (import, export, connecteurs). La largeur vient de primitives composables et de paquets de domaine partageables. La profondeur réglementaire (comptabilité légale certifiée, dossier patient certifié, essais cliniques réglementés, trading, pipelines génomiques) reste hors périmètre ou passe par des intégrations. **Ne jamais promettre une conformité** légale, médicale, fiscale ou industrielle. Voir [l'épreuve des 50 domaines et les scénarios R1–R10](../ANNEXE_50_DOMAINES.md).

11. **Une mesure n'est pas un simple nombre.** Valeur absente, zéro, valeur estimée et valeur mesurée sont quatre cas distincts. L'incertitude et la qualité sont facultatives ; ne jamais les inventer.
12. **Opérations déclarées.** Toute opération d'analyse déclare ses types et unités acceptés, son tri requis et son traitement des valeurs absentes. En cas d'incompatibilité, refuser avec un message clair plutôt que produire un résultat trompeur. Aucun code fourni par l'utilisateur n'est exécuté.
13. **Géographie sur choix.** Une position précise est une donnée sensible. Aucun appel à un fond de carte tiers ni géocodage sans choix explicite de l'utilisateur.
14. **Les tiers sans compte n'ont jamais de droit de lecture.** Leurs soumissions arrivent en quarantaine par défaut et leur lien est révocable.
15. **Preuve n'est pas certification.** Un registre non modifiable fournit de la traçabilité ; il ne se présente pas comme conforme à une loi ou à une norme.
16. **Confidentialité imposée par l'API.** Les seuils d'agrégat et les exclusions de champs sensibles sont appliqués côté serveur, pas seulement dans l'interface. Ne jamais présenter cela comme de l'anonymisation ; documenter les limites de recoupement.
17. **Paquets de domaine : copie locale uniquement.** Un paquet ne contient ni code exécutable, ni données d'utilisateur, ni pièces privées. Son installation respecte la règle 1 (copie locale avec aperçu).
18. **Pas de type de collection permanent.** Aucun paquet, modèle ou flux d'états ne doit enfermer une collection dans un domaine.

### Définition de fini et méthode 1.1
- Avant de coder une tâche T34–T45, écrire son contrat court dans `docs/` (ex. `docs/T35_OPERATIONS_ANALYSE.md`) et compléter `docs/T03_CONTRAT_DONNEES.md` si le contrat de base change.
- Alimenter `docs/reference-fixtures-1-1.json` avec les scénarios [R1 à R10](../ANNEXE_50_DOMAINES.md) concernés, isolés des données des utilisateurs.
- Étendre systématiquement l'export et l'import (T07) aux nouveaux éléments (ajustement A10) et préserver les parcours simples (une note à un seul champ reste un parcours complet).
- **Modularité obligatoire (anti-conflit IA et économie de jetons) :** ne jamais faire grossir `brainy/lib/workspace_screen.dart`, `brainy_web_app/app/brainy-app.tsx` ni `api/src/collections/collections.service.ts`. Chaque nouvelle primitive ou vue doit être isolée dans son propre fichier de service/composant/widget et branchée par une interface minimale.

### Ajustements transverses (A1 à A10)
- **A1 (Profil)** : rendre centres d'intérêt et loisirs facultatifs tant que T33 n'existe pas (décision produit à valider ou appliquer avant T33).
- **A2 (Terminologie)** : garder « data format » / « format de données » jusqu'à décision produit issue des tests novices ; masquer le jargon technique (ex. « objet-variable ») derrière des formulations guidées dans l'interface.
- **A3 (T11, T12 → T37)** : conserver des identifiants et cardinalités prêts pour hiérarchie et composition.
- **A4 (T22 → T35)** : structurer l'agrégateur comme un registre d'opérations versionné.
- **A5 (T26 → T42)** : aligner le registre de mouvements de stock de T26 avec le contrat de registre non modifiable de T42.
- **A6 (T32 ← T36)** : utiliser le champ mesure de T36 pour les flux de capteurs et sources externes.
- **A7 (T28 → T41, T43)** : unifier le modèle de droits pour couvrir les liens de contribution (T41) et la sensibilité (T43).
- **A8 (T24 → T45)** : faire adopter aux modèles de départ le format de paquet de T45.
- **A9 (Documentation & ID)** : aligner `README.md` avec l'état livré et remplacer `com.example.brainy` avant publication publique.
- **A10 (T07)** : étendre export/import à chaque nouvelle primitive (mesure, position, relations, codes, états).

### Paliers de livraison 1.1 et hors périmètre

| Palier | Tâches | Démonstration attendue |
| --- | --- | --- |
| 1.1-A Cas fondateurs | T34 | Un lien se garde en trois gestes avec son contexte ; une vente quotidienne se saisit en deux gestes. |
| 1.1-B Analyse et mesure | T35, T36 | Les mesures ont un statut, une incertitude et des opérations fiables ; les relevés donnent des consommations. |
| 1.1-C Espace, relations, vocabulaires | T37, T38, T39 | Recettes et nomenclatures calculent un coût ; les données s'affichent sur carte ; les classifications regroupent les chiffres. |
| 1.1-D Processus et collecte | T40, T41 | Des tâches sont assignées à des comptes ; des tiers contribuent sans compte, avec quarantaine. |
| 1.1-E Preuve et confidentialité | T42, T43 | Un registre détecte l'altération ; un agrégat sensible sous le seuil n'est jamais retourné. |
| 1.1-F Volume et extension | T44, T45 | Les gros fichiers sont référencés ; des paquets de domaine s'installent dans un autre compte. |

**Hors périmètre de 1.1 :** temps réel strict et ingestion industrielle à très haut débit ; trading et analyse de marchés ; comptabilité légale certifiée et fiscalité ; dossier patient certifié et essais cliniques réglementés ; pipelines génomiques et traitement d'images satellite ; simulation numérique et apprentissage automatique.
