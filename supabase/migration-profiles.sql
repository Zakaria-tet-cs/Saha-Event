-- ╔══════════════════════════════════════════════════════════╗
-- ║  SAHA-EVENT — Migration Profils & Rôles                 ║
-- ║  À exécuter dans Supabase SQL Editor                    ║
-- ╚══════════════════════════════════════════════════════════╝

-- 1. Créer la table profiles si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  nom TEXT,
  prenom TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  salles_ajoutees INTEGER DEFAULT 0,
  salles_supprimees INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Ajouter les colonnes manquantes (idempotent)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nom TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS prenom TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS event_preferences JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS salles_ajoutees INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS salles_supprimees INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 3. Activer RLS sur profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Policies RLS
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can read own profile') THEN
    EXECUTE 'CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id)';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can update own profile') THEN
    EXECUTE 'CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id)';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can insert own profile') THEN
    EXECUTE 'CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id)';
  END IF;
END $$;

-- Policy spéciale: les admins peuvent lire tous les profils (pour stats)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Admins can read all profiles') THEN
    EXECUTE 'CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = ''admin'')
    )';
  END IF;
END $$;

-- 5. Fonction trigger: créer automatiquement le profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Déterminer le rôle selon le domaine email
  IF NEW.email LIKE '%@estin.dz' THEN
    user_role := 'admin';
  ELSE
    user_role := 'user';
  END IF;

  INSERT INTO public.profiles (id, email, role, nom, prenom, created_at, updated_at)
  VALUES (
    NEW.id, 
    NEW.email, 
    user_role, 
    NEW.raw_user_meta_data->>'nom', 
    NEW.raw_user_meta_data->>'prenom', 
    NOW(), 
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    nom = EXCLUDED.nom,
    prenom = EXCLUDED.prenom,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Attacher le trigger à auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Ajouter colonne created_by à la table salles (pour stats admin)
ALTER TABLE public.salles ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- 8. Vérification finale
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'profiles' ORDER BY ordinal_position;
