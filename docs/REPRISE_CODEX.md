# Journal de coordination et reprise Multi-IA

## Session A
Aucune tâche en cours. Devise FCFA livrée. Docker retiré : `node scripts/dev-local.mjs` lance S3, API et web ; MongoDB est un service Windows ; secrets dans `api/.env`. Ancienne base dans `D:\docker-backup`, non récupérée. VersityGW Windows lancé avec `--sidecar` (pas de xattr) ; `smoke:large-files` et `smoke:web` passent le 2026-11-10. `brainy/tool/period_totals_preview.dart` est temporaire, non commité. Modèle KT personal livré (voir `docs/ETAT_IMPLEMENTATION.md`). Entête web allégée jusqu'à 340 px (`topbar-compact.css`). Les quatre dépôts sont sur `main` depuis le 9 novembre 2026 ; tous sont poussés sur GitHub (la racine sur `kottefadyl/full_brainy`). Révision post-audit terminée : décisions T22, T23, T43 (audit, section 13), délai d'analyse à 60 s (T22), mesures web (T36), liens de contribution, libellés et dates, recette web et téléphone (T02).
Reste : T20, T23/1, T23/2 (courbes multiples), T23/4, T23/6 Flutter, T38/2, T38/3, T39/1, T39/3, T43/1, T43/3, T33.

## Session B
Aucune tâche en cours. T22/1, T22/2 et ENV/1/1 clôturées côté API le 8 novembre 2026 (docs/tasks/T22.md). Opérations exposées sur le web et Flutter. Le watch de l’API ne voit pas les modifications du montage Windows : redémarrer le service `api` avant les fumées.
