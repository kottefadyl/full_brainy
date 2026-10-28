# Ressources officielles à consulter à la demande

Direction Brainy proposée d'après les références Fedora fournies par Kevin et les documents produit joints le 28 octobre 2026. Les principes GNOME inspirent l'expérience ; ils ne prescrivent pas un port GTK ni la reproduction d'un bureau Linux.

- GNOME HIG : https://developer.gnome.org/hig/ — hiérarchie, navigation, contrôles, adaptabilité ; lire seulement le pattern concerné.
- Boutons : https://developer.gnome.org/hig/patterns/controls/buttons.html
- Dialogues : https://developer.gnome.org/hig/patterns/feedback/dialogs.html
- WCAG 2.2 : https://www.w3.org/TR/WCAG22/ — exigences web ; ne pas confondre objectif visuel et conformité auditée.
- Cibles minimales : https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- Animations : https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- Codex, documentation des skills : https://developers.openai.com/codex/skills/
- Antigravity, documentation des skills : https://antigravity.google/docs/skills

## Portabilité au dépôt Brainy

Distribuer le dossier complet `brainy-ui-ux` (SKILL.md et references) dans `.agents/skills/brainy-ui-ux/` à la racine du projet ; vérifier le chemin de découverte documenté par la version locale de chaque outil. Antigravity documente `.agents/skills` et une compatibilité avec `.agent/skills`. Si un agent ne découvre pas le skill, lui demander explicitement de lire `.agents/skills/brainy-ui-ux/SKILL.md` avant toute modification UI.

Pour rendre l'application régulière, ajouter au guide projet une seule règle courte, sans dupliquer le contenu :

> Pour toute tâche UI/UX, lire et appliquer `.agents/skills/brainy-ui-ux/SKILL.md` ; vérifier le rendu clair/sombre et le parcours principal, puis signaler les vérifications non exécutées.

L'installation personnelle dans ChatGPT ne copie pas automatiquement ce dossier sur l'ordinateur de l'utilisateur ni dans Codex local ou Antigravity. Ne pas annoncer ces installations locales comme faites.
