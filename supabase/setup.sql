-- ==========================================
-- 1. CREATION DES TABLES 
-- ==========================================

-- Création de la table 'salles'
CREATE TABLE IF NOT EXISTS public.salles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  localisation TEXT NOT NULL,
  prix NUMERIC NOT NULL,
  capacite INTEGER NOT NULL,
  description TEXT,
  services TEXT[],
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ajout des nouvelles colonnes si la table existe déjà
ALTER TABLE public.salles ADD COLUMN IF NOT EXISTS photos TEXT[];
ALTER TABLE public.salles ADD COLUMN IF NOT EXISTS equipements TEXT[];
ALTER TABLE public.salles ADD COLUMN IF NOT EXISTS prestations TEXT[];

-- Nettoyage de la base de données
DELETE FROM public.salles WHERE nom != 'Bayazid';

-- Insertion de la salle Bayazid (Mise à jour avec les nouveaux champs)
-- IMPORTANT: Si Bayazid existe déjà, vous pouvez aussi utiliser un UPDATE. 
-- Ici, on va utiliser un INSERT ON CONFLICT ou juste supprimer Bayazid avant pour avoir la donnée fraîche.
DELETE FROM public.salles WHERE nom = 'Bayazid';

INSERT INTO public.salles (nom, localisation, prix, capacite, description, services, image_url, photos, equipements, prestations)
VALUES (
  'Bayazid',
  'Route de grossistes Jolie Vue (près de l''école Kateb Yacine), Kouba',
  90000,
  250,
  'Salle de dîner pour vos événements heureux: dîner de mariage, nous vous proposons notre salle sur 2 espaces d''une capacité de 150 et 100 personnes. La salle est très bien située, neuve, très propre et bien aménagée. Stationnement assuré.',
  ARRAY['parking', 'dj', 'photographe', 'traiteur', 'serveurs', 'decoration'],
  '/images/bayazid/media__1776887326681.jpg',
  ARRAY[
    '/images/bayazid/media__1776887324493.jpg', 
    '/images/bayazid/media__1776887324506.jpg', 
    '/images/bayazid/media__1776887326681.jpg', 
    '/images/bayazid/media__1776887329915.jpg'
  ],
  ARRAY['Nombre d''invités: 250 invités', 'Salon homme: Disponible', 'Traiteur: Inclus', 'Parking: 50 places'],
  ARRAY['Dîner sans courses (traiteur à votre charge): 90.000 DA', 'Dîner sans courses (traiteur à notre charge): 120.000 DA']
);

-- Création de la table 'reservations'
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  salle_id UUID NOT NULL REFERENCES public.salles(id) ON DELETE CASCADE,
  date_reservation DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  receipt_url TEXT,
  guests INTEGER NOT NULL,
  event_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. ACTIVATION DE RLS (ROW LEVEL SECURITY)
-- ==========================================

ALTER TABLE public.salles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. CREATION DES POLITIQUES (POLICIES)
-- ==========================================

-- Salles : Tout le monde peut voir les salles (Public read access)
CREATE POLICY "Les salles sont visibles par tout le monde" 
ON public.salles FOR SELECT 
USING (true);

-- Reservations : Un utilisateur ne peut voir que SES réservations
CREATE POLICY "Les utilisateurs peuvent voir leurs propres réservations" 
ON public.reservations FOR SELECT 
USING (auth.uid() = user_id);

-- Reservations : Un utilisateur ne peut insérer que SES réservations
CREATE POLICY "Les utilisateurs peuvent créer des réservations" 
ON public.reservations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Reservations : Un utilisateur peut modifier uniquement le status (ex: annuler)
CREATE POLICY "Les utilisateurs peuvent modifier leurs réservations" 
ON public.reservations FOR UPDATE 
USING (auth.uid() = user_id);

-- Gérer l'effacement par l'utilisateur
CREATE POLICY "Les utilisateurs peuvent supprimer leurs réservations" 
ON public.reservations FOR DELETE 
USING (auth.uid() = user_id);

-- ==========================================
-- 4. CONFIGURATION DU STORAGE BUCKET
-- ==========================================

-- Insérer le bucket 'receipts' si nécessaire
INSERT INTO storage.buckets (id, name, public) 
VALUES ('receipts', 'receipts', false) 
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Seul un utilisateur connecté peut uploader son reçu
CREATE POLICY "Les utilisateurs peuvent uploader leurs reçus"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'receipts' 
    AND auth.uid() = owner
);

-- Storage Policy: Autoriser les utilisateurs à voir ou télécharger LEURS fichiers
CREATE POLICY "Les utilisateurs peuvent lire leurs propres fichiers"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'receipts'
    AND auth.uid() = owner
);
