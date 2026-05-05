-- ╔══════════════════════════════════════════════════╗
-- ║  MIGRATION — À exécuter UNE SEULE FOIS dans     ║
-- ║  Supabase SQL Editor                             ║
-- ╚══════════════════════════════════════════════════╝

-- 1. Ajouter les nouvelles colonnes
ALTER TABLE public.salles ADD COLUMN IF NOT EXISTS photos TEXT[];
ALTER TABLE public.salles ADD COLUMN IF NOT EXISTS equipements TEXT[];
ALTER TABLE public.salles ADD COLUMN IF NOT EXISTS prestations TEXT[];

-- 2. Activer RLS et créer la politique de lecture publique
ALTER TABLE public.salles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'salles' 
    AND policyname = 'Les salles sont visibles par tout le monde'
  ) THEN
    EXECUTE 'CREATE POLICY "Les salles sont visibles par tout le monde"
      ON public.salles FOR SELECT USING (true)';
  END IF;
END
$$;

-- 3. Permettre l'insertion via anon key (pour le formulaire admin)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'salles' 
    AND policyname = 'Insertion libre des salles'
  ) THEN
    EXECUTE 'CREATE POLICY "Insertion libre des salles"
      ON public.salles FOR INSERT WITH CHECK (true)';
  END IF;
END
$$;

-- 4. Permettre la mise à jour via anon key (pour le seed script)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'salles' 
    AND policyname = 'Mise a jour libre des salles'
  ) THEN
    EXECUTE 'CREATE POLICY "Mise a jour libre des salles"
      ON public.salles FOR UPDATE USING (true)';
  END IF;
END
$$;

-- ✅ Vérification : afficher la structure de la table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'salles' 
ORDER BY ordinal_position;
