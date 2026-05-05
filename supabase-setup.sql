-- Supabase Full Stack Schema for Saha-Event

-- 1. Create Salles Table
CREATE TABLE IF NOT EXISTS public.salles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom TEXT NOT NULL,
    localisation TEXT NOT NULL,
    commune TEXT NOT NULL,
    prix NUMERIC NOT NULL,
    capacite INTEGER NOT NULL,
    rating NUMERIC DEFAULT 0,
    image_url TEXT,
    description TEXT,
    surface TEXT,
    tags TEXT[] DEFAULT '{}',
    parking BOOLEAN DEFAULT false,
    dj BOOLEAN DEFAULT false,
    photographe BOOLEAN DEFAULT false,
    traiteur BOOLEAN DEFAULT false,
    serveurs BOOLEAN DEFAULT false,
    decoration BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for salles
ALTER TABLE public.salles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to salles
CREATE POLICY "Les salles sont visibles par tout le monde" 
ON public.salles FOR SELECT 
USING (true);


-- 2. Create Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs peuvent voir et modifier leur propre profil" 
ON public.profiles FOR ALL 
USING (auth.uid() = id);


-- Function to automatically create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 3. Create Reservations Table
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    salle_id UUID REFERENCES public.salles(id) ON DELETE CASCADE,
    date_reservation DATE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    contract_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(salle_id, date_reservation) -- Empêcher la double réservation
);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres réservations
CREATE POLICY "Voir ses propres réservations" 
ON public.reservations FOR SELECT 
USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer des réservations pour eux-mêmes
CREATE POLICY "Créer ses propres réservations" 
ON public.reservations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 4. Create Storage Bucket for Contracts/Receipts
INSERT INTO storage.buckets (id, name, public) 
VALUES ('receipts_contracts', 'receipts_contracts', false)
ON CONFLICT (id) DO NOTHING;

-- RLS for Storage (Users can only read/insert their own files)
CREATE POLICY "Accès aux reçus authentifié"
ON storage.objects FOR SELECT
USING (bucket_id = 'receipts_contracts' AND auth.uid() = owner);

CREATE POLICY "Upload des reçus authentifié"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'receipts_contracts' AND auth.uid() = owner);

-- ==========================================
-- DATA SEEDING (Salles)
-- Run this to populate your first few halls
-- ==========================================
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, description, surface, parking, dj, photographe, traiteur, serveurs, decoration, tags)
VALUES 
  (gen_random_uuid(), 'Palais des Lumières', 'Route Nationale 5, Bab Ezzouar', 'Bab Ezzouar', 450000, 600, 4.9, 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800', 'Le Palais des Lumières est un espace événementiel de prestige...', '1 200 m²', true, true, true, true, true, true, ARRAY['Mariage', 'Fiançailles', 'Gala']),
  (gen_random_uuid(), 'Espace Royal de l''Émir', 'Rue Abane Ramdane, Hydra', 'Hydra', 800000, 400, 5.0, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800', 'Un lieu d''exception à Hydra...', '900 m²', true, true, true, true, true, true, ARRAY['Luxe', 'Mariage']),
  (gen_random_uuid(), 'Salle les Pyramides', 'Cité des Pyramides, Dergana', 'Dergana', 320000, 500, 4.7, 'https://images.unsplash.com/photo-1549488344-c1eaab6afce6?q=80&w=800', 'Avec une capacité de 500 convives...', '1 100 m²', true, true, false, true, true, true, ARRAY['Grand événement']);
