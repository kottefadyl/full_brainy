# Journal de coordination et reprise Multi-IA

## Session A
Agent actif : Claude. T20/3 faite (index d'expiration 270 j sur `PushDevice.lastSeenAt`, fumée OK) ; T20 attend les vrais identifiants SMTP/FCM et un Android physique. T23/2 livrée (web et Flutter, commits `bd908e3` web et `3384ee3` Flutter). T23/4 livrée (zoom web `480aa87`, Flutter `26c4fa2`). T43/3 livrée (alertes de requêtes répétées dans l'audit, API). Décisions E prises (suggestions appliquées). Hébergement Vercel Hobby : 4 modules gelés (`docs/DEPLOIEMENT_VERCEL.md`, API `545c924`). Prochaine action : T38/2 (cache des tuiles vues), T38/3 (pointage + GPS, `geolocator` accepté), T39/3 (codes hors du document de collection), T39/1. Les vérifications de l'utilisateur sont dans le document Claude « Brainy — ce qui dépend de toi ». `brainy/tool/period_totals_preview.dart` : suppression à confirmer par l'utilisateur.
Précédemment : FCFA, modèle KT personal et entête web compacte livrés ; Docker retiré (`node scripts/dev-local.mjs`, MongoDB en service Windows, VersityGW avec `--sidecar`) ; ancienne base dans `D:\docker-backup`. Dépôts sur `main`, racine sur `kottefadyl/full_brainy` (commits du 10 novembre non poussés).
Reste : T20, T23/1, T23/6 Flutter, T38/2, T38/3, T39/1, T39/3, T43/1, T33 ; écran d’audit absent.

## Session B
Aucune tâche en cours. T22/1, T22/2 et ENV/1/1 clôturées côté API le 8 novembre 2026 (docs/tasks/T22.md). Opérations exposées sur le web et Flutter. Le watch de l’API ne voit pas les modifications du montage Windows : redémarrer le service `api` avant les fumées.
