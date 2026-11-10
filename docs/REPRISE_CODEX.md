# Journal de coordination et reprise Multi-IA

## Session A
Aucune tâche en cours. Livré le 11 nov. : photo de profil (≤ 1 Mio vérifiée par l'API, compression JPEG côté clients) et listes de suggestions EN/FR (398 métiers, 98 centres d'intérêt, 95 loisirs) avec saisie libre, web et Flutter. Sources : `scripts/profile-suggestions/*.txt` → `generate.mjs`. Aperçu natif : `brainy/tool/profile_preview.dart`.
Prochaine action : 1) Android (T46, grandes listes, pincement, T23/1, photo de profil) ; 2) T20 avec les vrais identifiants ; 3) T33 après décision produit.
T20 attend les vrais identifiants SMTP/FCM et un Android physique. Hébergement Vercel Hobby : 4 modules gelés (`docs/DEPLOIEMENT_VERCEL.md`). `brainy/tool/period_totals_preview.dart` : suppression à confirmer par l'utilisateur.

## Session B
Aucune tâche en cours. Le watch de l’API ne voit pas les modifications du montage Windows : redémarrer le service `api` avant les fumées.
