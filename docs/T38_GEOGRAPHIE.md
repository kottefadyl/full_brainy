# T38 — Contrat géographique

- Les champs `POSITION` et `ZONE` sont des valeurs du format de données. Une position est stockée en WGS84 comme latitude, longitude et précision facultative en mètres ; une zone est un cercle ou un polygone simple. L'API valide les coordonnées, la géométrie, la taille et l'appartenance à la collection.
- Les distances utilisent la formule de Haversine et retournent des mètres ou des kilomètres. L'appartenance à une zone se calcule côté API ; les regroupements par zone comptent chaque entrée concernée explicitement.
- La vue carte lit les entrées par pages et respecte les filtres de la liste. Elle ne charge jamais les 10 000 points d'un coup. Sans fond externe, une grille WGS84 locale et les coordonnées restent utilisables.
- Aucun fournisseur de tuiles n'est activé par défaut : coût nul, aucune position envoyée à un tiers, aucune licence de fond à gérer. Un fournisseur éventuel demanderait un choix produit et un consentement explicite. La saisie manuelle est le premier parcours, sans permission de localisation.
- L'import/export GeoJSON et CSV latitude/longitude conserve les coordonnées et signale les lignes invalides. La position précise est traitée comme sensible dans les partages ; T43 ajoutera les seuils et niveaux généraux.

Limites de cette reprise : un import est limité à 500 points et un export à 10 000 ; l'aller-retour est donc direct pour un fichier de 500 points au plus. Le regroupement par zone utilise `COUNT` du registre T35, reprend les filtres de la liste et reste limité à 10 000 entrées et 100 zones. Les zones qui se recouvrent comptent chacune le point concerné. La carte est réservée au propriétaire de la collection.
