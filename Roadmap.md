Ce document définit la stratégie d'implémentation pour un outil de modélisation d'architecture d'entreprise nouvelle génération. L'objectif est de surpasser Draw.io et Excalidraw en termes d'UX, de performance et de fonctionnalités 3D.

Tech Stack imposée :

Frontend : React 18+ (TypeScript), Vite.

State Management : Zustand (pour la performance et la simplicité du store global).

2D Canvas Engine : React Flow (optimisé) ou Tldraw (personnalisé). Choix recommandé : React Flow pour la gestion stricte des nœuds/liens propres à l'architecture.

3D Engine : React-Three-Fiber (Three.js).

Backend/BaaS : Supabase (PostgreSQL, Auth, Storage, Realtime).

Styling : Tailwind CSS + Shadcn/ui (pour une UI propre et rapide).

Icon System : Iconify API (accès à +100k icônes).

Phase 1 : Fondations et Infrastructure
Objectif : Mettre en place un environnement de développement robuste et le système de persistance.

1.1. Initialisation du Projet
[ ] Scaffolding du projet Vite + React + TypeScript.

[ ] Configuration de ESLint et Prettier (règles strictes).

[ ] Installation de Tailwind CSS et configuration du thème "Enterprise Dark/Light".

[ ] Mise en place du routing (React Router) : /login, /dashboard, /editor/:id.

1.2. Intégration Supabase (Backend)
[ ] Création du projet Supabase.

[ ] Configuration de l'Authentification (Email/Password + GitHub/Google).

[ ] Définition du schéma de base de données SQL :

users : Profils.

projects : Conteneur global.

diagrams : JSONB pour stocker l'état du canvas (nodes/edges).

folders : Système hiérarchique.

assets : Images custom uploadées.

[ ] Création des Row Level Security (RLS) policies pour isoler les données utilisateurs.

1.3. Architecture du State (Zustand)
[ ] Création du store useAuthStore (Session).

[ ] Création du store useDiagramStore (Nodes, Edges, Viewport, HistoryStack).

[ ] Implémentation du pattern "Optimistic UI" pour les sauvegardes automatiques.

Phase 2 : Moteur 2D Core (L'expérience "Mieux que Draw.io")
Objectif : Une fluidité absolue et une manipulation intuitive.

2.1. Canvas Infini et Performant
[ ] Intégration de la librairie de graphe (ex: React Flow).

[ ] Configuration du "Infinite Pan & Zoom" avec rendu conditionnel (ne pas rendre les éléments hors écran).

[ ] Implémentation de la grille magnétique (Snap-to-grid) paramétrable.

[ ] Gestion des raccourcis clavier standards (Ctrl+C, Ctrl+V, Delete, Space+Drag).

2.2. Système de Nœuds "Architecture d'Entreprise"
[ ] Création de nœuds personnalisés (Custom Nodes) :

App Node : Icône + Titre + Sous-titre + Indicateurs de statut.

Container Node : Groupement visuel (Box) qui capture les enfants.

Database Node : Forme cylindrique stylisée.

[ ] Implémentation des "Handles" dynamiques (points de connexion qui apparaissent au survol).

2.3. Moteur de Liens (Edges) Intelligent
[ ] Algorithme de routing orthogonal (lignes à angles droits qui évitent les nœuds).

[ ] Gestion des étiquettes sur les liens (cardinalités, protocoles).

[ ] Styling des connecteurs (flèches, pointés, pleins) selon les standards UML/ArchiMate.

2.4. Barre d'Outils Contextuelle
[ ] Menu flottant au clic droit ou à la sélection (Changer couleur, forme, type).

[ ] "Quick Add" : Double-clic sur le canvas ouvre une recherche rapide pour ajouter un composant sans aller dans la sidebar.

Phase 3 : Gestion de Contenu et Recherche d'Icônes
Objectif : Accès instantané à n'importe quelle ressource visuelle.

3.1. Sidebar "Assets" Intelligente
[ ] Création d'un panneau latéral rétractable.

[ ] Intégration de l'API Iconify :

Barre de recherche qui requête l'API en temps réel.

Drag & Drop des icônes SVG directement depuis la sidebar vers le canvas.

[ ] Catégories pré-chargées : AWS, Azure, GCP, Kubernetes, Cisco, Generic Servers.

3.2. Historisation et Versionning
[ ] Implémentation du Undo/Redo (Ctrl+Z / Ctrl+Y) via une stack temporelle dans Zustand.

[ ] Système de "Snapshots" : L'utilisateur peut nommer une version (ex: "Architecture V1.0") et y revenir plus tard via Supabase.

3.3. Organisation Hiérarchique
[ ] Développement du Dashboard "Explorateur de fichiers".

[ ] Création de dossiers, sous-dossiers et déplacement de diagrammes (Drag & Drop dans l'arborescence).

[ ] Vue "Récents" et "Favoris".

Phase 4 : La Révolution 3D (La "Killer Feature")
Objectif : Visualiser les couches d'architecture (Business, App, Infra).

4.1. Moteur de Projection (2D to 3D)
[ ] Création d'un bouton "Switch View 3D".

[ ] Initialisation de la scène Three.js (Canvas R3F).

[ ] Algorithme de parsing :

Lire les positions X/Y des nœuds 2D.

Assigner une position Z basée sur le "Type" ou le "Groupe" du nœud (ex: Database = Sol, App = Niveau 1, Cloud = Nuage).

4.2. Rendu Isométrique et Esthétique
[ ] Génération de meshes 3D extrudés à partir des formes 2D.

[ ] Application de matériaux "Glassmorphism" pour les conteneurs (transparence pour voir ce qu'il y a dedans).

[ ] Lumières et ombres douces pour l'effet "Maquette d'architecte".

4.3. Navigation 3D
[ ] OrbitControls pour tourner autour de l'architecture.

[ ] Click-to-focus : Cliquer sur un élément 3D zoome dessus et affiche ses métadonnées dans un panel HTML (Overlay).

Phase 5 : UI/UX "Hors Pair" et Optimisation
Objectif : Le "Look & Feel" premium.

5.1. Design System & Theming
[ ] Interface minimaliste (HUD) qui maximise l'espace de travail.

[ ] Animations fluides (Framer Motion) pour l'ouverture des panneaux et les transitions de nœuds.

[ ] Dark Mode natif parfait (contrastes élevés pour les diagrammes complexes).

5.2. Collaboration (Bonus/Advanced)
[ ] Curseur multijoueur (via Supabase Realtime).

[ ] Verrouillage d'objets pendant l'édition par un autre utilisateur.

5.3. Performance Tuning
[ ] Virtualisation des listes (si beaucoup d'objets).

[ ] Débouncing des sauvegardes en base de données.

[ ] Compression des JSON de diagrammes avant envoi réseau.

Phase 6 : Export et Intégration
[ ] Export PNG/JPG haute résolution (avec gestion du pixel ratio).

[ ] Export SVG vectoriel (propre pour l'impression).

[ ] Export JSON (format propriétaire) pour backup.