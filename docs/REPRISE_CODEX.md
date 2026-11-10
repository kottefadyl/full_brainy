# Journal de coordination et reprise Multi-IA

## Session A
En pause (10 nov., demande de l'utilisateur) : « tout ce qui ne dépend pas de l'utilisateur ». Fait et commité : T23/6 Flutter export PNG/CSV, T23/1 aires empilées + jauge (web `4762f35`, Flutter `2402bed`), T43/1 k-anonymat (API `ca422ca`), journal T43/3 affiché (web `c331af1`), ordre naturel des codes (API `19ce947`). Tests Flutter ciblés, lint/tsc web, fumées `smoke:sensitivity` et `smoke:referentials` réussis.
Prochaine action : (1 fait : docs T23, roadmap et audit à jour) 2) arrêter `dev-local`, lancer `node scripts/visual/phase-two-b/check.mjs --cleanup` puis `npm run build` dans `brainy_web_app` ; 3) `flutter test` complet ; 4) T23/1 restant (nuage de points, radar) ; 5) contrôle visuel natif Windows des graphiques et du journal.
T20 attend les vrais identifiants SMTP/FCM et un Android physique. Hébergement Vercel Hobby : 4 modules gelés (`docs/DEPLOIEMENT_VERCEL.md`). `brainy/tool/period_totals_preview.dart` : suppression à confirmer par l'utilisateur. Dépôts sur `main`, racine sur `kottefadyl/full_brainy` (commits du 10 novembre non poussés). Reste aussi : T33 ; Android non vérifié (grandes listes, pincement).

## Session B
Aucune tâche en cours. T22/1, T22/2 et ENV/1/1 clôturées côté API le 8 novembre 2026 (docs/tasks/T22.md). Opérations exposées sur le web et Flutter. Le watch de l’API ne voit pas les modifications du montage Windows : redémarrer le service `api` avant les fumées.
