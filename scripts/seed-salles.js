// ╔══════════════════════════════════════════════╗
// ║  SAHA-EVENT — Script de seed automatique     ║
// ║  Usage: node scripts/seed-salles.js          ║
// ╚══════════════════════════════════════════════╝

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Variables d\'environnement manquantes. Vérifiez .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ══════════════════════════════════════════════
// 👇 AJOUTEZ VOS SALLES ICI
// ══════════════════════════════════════════════
const SALLES_A_INSERER = [
  {
    nom: 'Bayazid',
    localisation: "Route de grossistes Jolie Vue (près de l'école Kateb Yacine), Kouba",
    prix: 90000,
    capacite: 250,
    description: "Salle de dîner pour vos événements heureux: dîner de mariage, nous vous proposons notre salle sur 2 espaces d'une capacité de 150 et 100 personnes. La salle est très bien située, neuve, très propre et bien aménagée. Stationnement assuré.",
    services: ['parking', 'dj', 'photographe', 'traiteur', 'serveurs', 'decoration'],
    image_url: '/images/bayazid/media__1776887326681.jpg',
    photos: [
      '/images/bayazid/media__1776887326681.jpg',
      '/images/bayazid/media__1776887324493.jpg',
      '/images/bayazid/media__1776887324506.jpg',
      '/images/bayazid/media__1776887329915.jpg',
      '/images/bayazid/media__1777579818092.jpg',
      '/images/bayazid/media__1777579822483.jpg',
      '/images/bayazid/media__1777579822540.jpg',
      '/images/bayazid/media__1777573630617.jpg',
      '/images/bayazid/media__1777573630629.jpg',
      '/images/bayazid/media__1777573634796.jpg',
    ],
    equipements: [
      "Nombre d'invités: 250 invités",
      'Salon homme: Disponible',
      'Traiteur: Inclus',
      'Parking: 50 places',
    ],
    prestations: [
      'Dîner sans courses (traiteur à votre charge): 90.000 DA',
      'Dîner sans courses (traiteur à notre charge): 120.000 DA',
    ],
  },
  // ── Ajoutez d'autres salles ici ──────────────
  // {
  //   nom: 'Nom de la salle',
  //   localisation: 'Adresse, Commune, Alger',
  //   prix: 85000,
  //   capacite: 500,
  //   description: 'Description...',
  //   services: ['parking', 'dj'],
  //   image_url: '/images/salle/photo1.jpg',
  //   photos: ['/images/salle/photo1.jpg', '/images/salle/photo2.jpg'],
  //   equipements: ['Salle de fêtes: Grande salle', 'Parking: 100 places'],
  //   prestations: ['Formule mariage: 150.000 DA'],
  // },
];

// ══════════════════════════════════════════════
// Détection automatique des colonnes disponibles
// ══════════════════════════════════════════════
async function getAvailableColumns() {
  // Test avec une salle vide pour détecter les colonnes
  const { data, error } = await supabase
    .from('salles')
    .select('id, nom, localisation, prix, capacite, description, services, image_url, photos, equipements, prestations')
    .limit(1);

  const available = new Set([
    'nom', 'localisation', 'prix', 'capacite', 'description', 'services', 'image_url'
  ]);

  if (!error) {
    // If no error, new columns exist
    available.add('photos');
    available.add('equipements');
    available.add('prestations');
    console.log('✅ Colonnes étendues détectées (photos, equipements, prestations)');
  } else {
    console.log('⚠️  Colonnes de base uniquement — exécutez supabase/migration.sql pour ajouter les nouvelles colonnes');
  }

  return available;
}

function buildPayload(salle, availableColumns) {
  const payload = {};
  const baseFields = ['nom', 'localisation', 'prix', 'capacite', 'description', 'services', 'image_url'];
  const extFields = ['photos', 'equipements', 'prestations'];

  for (const field of baseFields) {
    if (salle[field] !== undefined) payload[field] = salle[field];
  }

  for (const field of extFields) {
    if (availableColumns.has(field) && salle[field] !== undefined) {
      payload[field] = salle[field];
    }
  }

  return payload;
}

// ══════════════════════════════════════════════
// Logique d'insertion principale
// ══════════════════════════════════════════════
async function seed() {
  console.log('\n🌱 Démarrage du seed des salles Saha-Event...\n');

  const availableColumns = await getAvailableColumns();

  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const salle of SALLES_A_INSERER) {
    const payload = buildPayload(salle, availableColumns);

    // Vérifier si la salle existe déjà (par nom)
    const { data: existing } = await supabase
      .from('salles')
      .select('id')
      .eq('nom', salle.nom)
      .maybeSingle();

    if (existing) {
      console.log(`🔄 "${salle.nom}" déjà existante — mise à jour...`);
      const { error } = await supabase
        .from('salles')
        .update(payload)
        .eq('nom', salle.nom);

      if (error) {
        console.error(`   ❌ Erreur update: ${error.message}`);
        errors++;
      } else {
        console.log(`   ✅ "${salle.nom}" mise à jour avec succès`);
        updated++;
      }
    } else {
      const { error } = await supabase.from('salles').insert([payload]);
      if (error) {
        console.error(`   ❌ Erreur insertion "${salle.nom}": ${error.message}`);
        errors++;
      } else {
        console.log(`✅ "${salle.nom}" ajoutée avec succès`);
        inserted++;
      }
    }
  }

  console.log('\n══════════════════════════════════════════');
  console.log(`✅ ${inserted} salle(s) nouvellement ajoutée(s)`);
  console.log(`🔄 ${updated} salle(s) mise(s) à jour`);
  if (errors > 0) {
    console.log(`❌ ${errors} erreur(s) — vérifiez que migration.sql a bien été exécuté`);
    console.log('   → Ouvrez Supabase SQL Editor et collez le contenu de supabase/migration.sql');
  }
  console.log('══════════════════════════════════════════\n');
}

seed().catch(console.error);
