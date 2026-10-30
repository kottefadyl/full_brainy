# T42 — registre à ajout seul

Livré le 30 octobre 2026. Un propriétaire peut activer ce mode sur un **format de données vide** et ordinaire. L'activation est irréversible dans l'interface. Les entrées de ce format restent des entrées de la collection, mais l'API refuse leur modification et leur suppression directes, ainsi que la suppression de la collection qui les contient. L'import, le déplacement et la copie de ce format de données sont refusés pour éviter des écritures non scellées. Les liens de collecte publique ne peuvent pas écrire directement dans ce registre.

## Écritures, correction et solde

- `createEntry` ajoute une écriture et lui attribue `ledgerSequence`, `ledgerPreviousHash` et `ledgerHash`. Une tête indépendante conserve le nombre et le dernier hachage ; la vérification compare aussi les valeurs présentes en base aux empreintes individuelles. La disparition de la dernière écriture est détectée par la tête.
- `correctLedgerEntry(originalId,input)` ajoute une écriture liée par `correctionOf`. Chaque champ numérique renseigné dans l'écriture d'origine doit avoir son opposé exact dans la contre-écriture ; un montant absent ne peut pas être introduit par cette correction. Une écriture de remplacement peut ensuite être ajoutée. Les champs textuels peuvent expliquer la correction.
- `ledgerBalance` additionne un champ numérique des écritures, y compris les contre-écritures, en arithmétique décimale exacte. Il est réservé au propriétaire. Le solde n'est pas une valeur stockée.
- `verifyLedger` rend `valid`, `checked`, `headHash`, `redactionHash` et `problem`. `ledgerProof` exporte un JSON lisible avec les identifiants, l'ordre, les hachages, les liens de correction, les traces de masquage et l'état de vérification. Conserver une preuve hors de la base permet de comparer un ancrage antérieur à un état ultérieur.

## Effacement décidé pour T42

Décision produit du 29 octobre 2026 : le propriétaire **choisit les champs à masquer**, les montants numériques restent et une trace est conservée. `redactLedgerFields` remplace physiquement les valeurs choisies par `[redacted]`, sans conserver leurs contenus dans la trace. Les empreintes individuelles d'origine restent dans l'écriture ; la vérification accepte ce masque uniquement si une trace chaînée correspondante existe. Le motif, les identifiants de champs, l'auteur et la date figurent dans la preuve. Les champs `NUMBER` et `MEASURE` ne peuvent pas être masqués. Choisir un motif sans donnée personnelle.

L'API conserve le refus de suppression de la collection tant qu'un registre y est activé. Les sauvegardes incluent les têtes et les traces. Une sauvegarde est refusée si l'intégrité d'un registre ou d'un stock déjà scellé échoue ; une ancienne archive sans ces données reste lisible si elle ne contient aucun registre.

Les sauvegardes déjà exportées avant un masquage peuvent toujours contenir les valeurs d'origine : le propriétaire doit gérer séparément ces copies externes.

## Mouvements de stock T26

Chaque produit possède sa propre tête de chaîne. Les nouveaux mouvements sont scellés sous leur clé d'idempotence ; le stock courant et le rapport restent dérivés des mouvements. `verifyStockLedger` et `stockLedgerProof` contrôlent et exportent la chaîne. `sealStockHistory`, réservé au propriétaire, pose une **ligne de base** sur les mouvements antérieurs à T42 ; la prochaine validation d'un mouvement de ce produit pose aussi cette ligne de base automatiquement. Elle ne peut pas prouver leur état avant ce premier scellement. Après le scellement, une modification ou une disparition en base est détectée. Les corrections et retours restent de nouveaux mouvements, sans réécriture de l'ancien.

## Limites

La chaîne détecte une modification ordinaire en base, mais un acteur pouvant réécrire **à la fois** toutes les écritures et leurs têtes peut fabriquer une autre chaîne. Comparer les preuves exportées hors de Brainy aide à repérer ce cas. MongoDB local n'utilise pas de transaction entre écriture, tête et trace : une panne pendant l'opération peut laisser un état que `verifyLedger` ou `verifyStockLedger` signale comme invalide et qui demande une réparation contrôlée. L'activation d'un format de données déjà rempli n'est pas proposée ; il faut créer un nouveau format de données vide. Le registre n'est **pas une certification comptable, médicale ou réglementaire**.

Vérification ciblée : `docker compose exec -T api npm run smoke:ledger` couvre R4 (caisse) et R7 (stock par lot), correction liée, masquage, sauvegarde, export et altération directe simulée en base. Interfaces EN/FR : panneau Registre dans la collection, intégrité du stock dans l'écran Stock, sur web et Flutter.
