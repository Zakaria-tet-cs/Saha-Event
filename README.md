# Saha-Event | Prestige & Excellence à Alger

Saha-Event est une plateforme SaaS de luxe dédiée à la réservation de salles de gala, résidences prestigieuses et espaces d'exception au cœur d'Alger.

## 💎 Vision & Prestige

Conçu pour l'excellence, Saha-Event redéfinit l'expérience de planification d'événements en Algérie en offrant une sélection rigoureuse des lieux les plus convoités, couplée à un service de conciergerie digitale "Haute Couture".

### Points Forts
- **Esthétique de Luxe** : Un design "Navy & Gold" sophistiqué, utilisant la typographie Playfair Display pour une élégance intemporelle.
- **Expérience Full-Stack** : Intégration complète avec Supabase pour une authentification sécurisée (OTP) et une gestion dynamique des données.
- **Interface Progressive** : Animations fluides avec Framer Motion et une architecture responsive "Glassmorphic".

---

## 🛠️ Stack Technique

- **Framework** : Next.js 14+ (App Router)
- **Styling** : Tailwind CSS + Vanilla CSS (Luxury Utilities)
- **Backend** : Supabase (Auth, Database, Storage)
- **Animations** : Framer Motion
- **Icons** : Lucide React

## 🚀 Installation & Développement

1. Clonez le dépôt
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Configurez vos variables d'environnement (`.env.local`) :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=votre_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle
   ```
4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

---

## 🏛️ Structure du Projet

- `/src/app` : Routes et pages (Landing, Salles, About, Contact)
- `/src/app/dashboard` : Espace client et gestionnaire exclusif
- `/src/app/auth` : Flux d'authentification sécurisé
- `/src/components` : Composants UI "Prestige" et Layouts
- `/src/data` : Gestion des données et catalogues

---

© 2026 Saha-Event Excellence. Tous droits réservés.
