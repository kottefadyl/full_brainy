# T31 — Mesures de charge et architecture adaptée

## Méthode et matériel

Le banc reproductible est `api/scripts/t31-load-benchmark.mjs`. Il crée un compte et une collection temporaires, insère 1 000, 100 000 puis 1 000 000 d'entrées et supprime ces données en fin d'exécution. Chaque entrée contient un titre, un nombre et une date/heure ; aucune pièce jointe. Les mesures passent par GraphQL, sauf l'insertion du jeu synthétique et les statistiques MongoDB. Les p95 portent sur 20 requêtes pour page/recherche/écriture et 5 pour migration/analyse/prévision. Le curseur profond est situé au milieu du jeu. Les appels sont séquentiels et locaux ; le banc ne mesure ni concurrence ni latence réseau réelle.

Environnement : Docker Desktop, 8 vCPU, 8,27 Go de RAM alloués, API NestJS en mode développement et MongoDB sur le même hôte ; volume MongoDB avec 947 Go libres au départ. Les chiffres sont des millisecondes de bout en bout, côté client local. Une exécution de développement ne prédit pas directement un déploiement de production.

## Résultats avant optimisation

| Entrées | Page p95 | Recherche p95 | Écriture p95 | Aperçu migration p95 | Analyse p95 | Prévision p95 |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 000 | 15 | 12,7 | 13 | 16,4 | 325,9 | 116 |
| 100 000 | 11,1 | 12,3 | 10,7 | 249,1 | 8 144,5 | 8 719,7 |
| 1 000 000 | 21,7 | 24,3 | 12,6 | 2 781,2 | refus après 100 001 entrées (~7 s) | même refus (~7 s) |

Le parcours analytique lisait les entrées du format avant d'appliquer la plage de dates. Le plafond de 100 000 entrées arrêtait donc aussi une requête portant sur une période réduite. Ce plafond reste une limite fonctionnelle explicite.

## Changements et seconde mesure

L'analyse pousse la plage de dates dans la requête MongoDB, utilise un index composé sur propriétaire, collection, format, champ et valeur, et exclut les octets des pièces jointes de sa projection. Le stockage opérationnel et l'index texte existants suffisent aux pages et à la recherche ; aucun moteur de recherche ni entrepôt analytique séparé n'est justifié par ce banc. Le web et Flutter remplacent la liste affichée à chaque changement de page et ne conservent que les curseurs précédents.

Pour la mesure ciblée, les dates sont réparties sur dix ans. La plage de janvier à novembre 2026 sélectionne environ 91 700 entrées au palier d'un million. Elle teste le filtrage sur une grande collection tout en respectant le plafond analytique. À 100 000 entrées, elle sélectionne environ 9 170 entrées. Les résultats analytiques de cette table et ceux de la première table ne portent donc pas sur le même volume analysé.

| Entrées | Page p95 | Recherche p95 | Écriture p95 | Aperçu migration p95 | Migration p95 | Analyse p95 | Prévision p95 |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 000 | 15 | 9 | 15,3 | 16,7 | 22,2 | 34,5 | 23,5 |
| 100 000 | 12,2 | 13,7 | 10 | 445,3 | 412,1 | 1 014,9 | 870,4 |
| 1 000 000 | 16,6 | 18 | 12,5 | 5 905,6 | 5 506,2 | 10 058,7 | 9 775,8 |

Le palier d'un million a été répété avec cinq appels pour chaque opération lourde. Les meilleurs p95 observés sur les opérations courantes varient avec la chaleur du cache et la charge de Docker ; le tableau conserve le passage complet avec cinq échantillons analytiques. Les mesures ne permettent pas de promettre un temps constant pour une analyse de toute la collection : une telle analyse dépasse le plafond et doit être resserrée.

## Coût observé et budgets validés

Au million, MongoDB rapportait environ 468,6 Mo de données logiques, 66,9 Mo de stockage compressé et 175,8 Mo d'index, soit 242,7 Mo alloués aux données compressées et aux index sur ce banc. L'index ajouté représente environ 30 Mo par million d'entrées par rapport au premier passage. Ces statistiques sont celles de la collection MongoDB partagée et comprennent sa capacité réutilisée ; elles sont un ordre de grandeur, pas une facture. Les données de test ont été supprimées. Un tarif mensuel nécessite le fournisseur, la région, les sauvegardes et le profil de trafic du déploiement cible.

Budgets approuvés par l'utilisateur le 2026-10-29, pour le matériel ci-dessus et les scénarios mesurés :

| Charge | Page, recherche, écriture p95 | Aperçu et mise à jour de format p95 | Analyse et prévision p95 | Stockage MongoDB alloué |
| ---: | ---: | ---: | ---: | ---: |
| 1 000 | ≤ 100 ms | ≤ 250 ms | ≤ 1 s | — |
| 100 000 | ≤ 150 ms | ≤ 1 s | ≤ 3 s sur ~9 170 entrées ciblées | — |
| 1 000 000 | ≤ 250 ms | ≤ 10 s | ≤ 15 s sur ≤ 100 000 entrées ciblées | ≤ 350 Mo pour ce jeu sans pièces jointes |

Le budget de coût est ici un plafond de stockage et un gabarit de 8 vCPU/8,27 Go RAM. Il faudra convertir ce gabarit en coût monétaire lorsque l'hébergement sera choisi et refaire le banc avec les pièces jointes, la concurrence et le réseau réels. Les mesures actuelles ne valident pas ces charges supplémentaires.

## Rétention et suite

Les collections, entrées et pièces jointes personnelles restent conservées jusqu'à suppression explicite par leur propriétaire ; aucun archivage automatique n'est introduit. Les résultats d'analyse et de prévision sont calculés à la demande et ne créent pas de copie durable. Les données temporaires du banc sont effacées après chaque exécution. L'archivage automatique par domaine demande une décision produit avant implémentation, car Brainy ne connaît pas la valeur ni les obligations de conservation des données de l'utilisateur. La séparation des stockages sera réévaluée si un futur banc avec concurrence, pièces jointes ou gros calculs dépasse les budgets approuvés.
