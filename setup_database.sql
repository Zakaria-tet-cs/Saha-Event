
-- 1. Ensure table schema is up to date
ALTER TABLE public.salles ADD COLUMN IF NOT EXISTS capacite integer;
ALTER TABLE public.salles ADD COLUMN IF NOT EXISTS commune text;
ALTER TABLE public.salles ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.salles ADD COLUMN IF NOT EXISTS images jsonb;
ALTER TABLE public.salles ADD COLUMN IF NOT EXISTS equipements jsonb;
ALTER TABLE public.salles ADD COLUMN IF NOT EXISTS prestations jsonb;
ALTER TABLE public.salles ADD COLUMN IF NOT EXISTS rating numeric;
ALTER TABLE public.salles ADD COLUMN IF NOT EXISTS tags jsonb;

-- 2. Clear old placeholders
DELETE FROM public.salles;

-- 3. Insert real halls
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'bayazid-kouba',
    'Bayazid',
    'Route de grossistes Jolie Vue (près de l''école Kateb Yacine), Kouba',
    'Kouba',
    90000,
    250,
    5,
    '/images/bayazid/media__1776887326681.jpg',
    '["/images/bayazid/media__1776887324493.jpg","/images/bayazid/media__1776887324506.jpg","/images/bayazid/media__1776887326681.jpg","/images/bayazid/media__1776887329915.jpg"]'::jsonb,
    'Magnifique salle de fêtes Bayazid située à Kouba. Vous offrant un service irréprochable pour vos événements avec une décoration luxueuse et un cadre convivial.',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":true,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"250 invités","inclus":true},{"label":"Salon de dîner","value":"Disponible","inclus":true}]'::jsonb,
    '[{"label":"A partir de","price":"90.000 DA"}]'::jsonb,
    '["Mariage","Kouba","Bayazid"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'hani-souf-0',
    'Hani Souf',
    'A coté de la salle Maroua, en face des terraisn de sport cité El Hayet, Djasr Kasentina',
    'Alger',
    90000,
    400,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'La salle Hani Souf vous acueille dans un cadre magnifique et vous offres toutes les comodités afin que votre mariage soit mémorable. Elle dispose de 2 espa...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"400 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Parking","value":"60 places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"90.000 DA"},{"label":"-->","price":"70.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'hotel-emir-1',
    'Hotel Emir',
    '33 Rue Tella ahcen route de dely brahim, Cheraga',
    'Alger',
    566,
    250,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'L&#039;hôtel Emir dispose d&#039;une belle salle des fêtes rouge d&#039;une capacité qui dépasse les 250 invités en plus d&#039;un espace séparé. Un espace chaleureux et convi...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"250 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"100 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"200.000 DA"},{"label":"-->","price":"280.000 DA"},{"label":"-->","price":"320.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'lotus-2',
    'Lotus',
    '62 Coopérative l&#039;amitié (à coté de la clinique Aya), Birkhadem',
    'Alger',
    60000,
    350,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Salle de dîner',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"350 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"0 places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"60.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'el-quaada-3',
    'El Quaada',
    '170 Mohamed Belouizdad, El hamma, Belouizdad',
    'Alger',
    140000,
    250,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'A la recherche d&#039;une salle de dîner pour y abriter vos repas festifs ? La salle El Quaada vous propose deux vastes espaces, une de 150 personnes et une sec...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":true,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"250 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"30 places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"140.000 DA"},{"label":"-->","price":"1.200 DA"},{"label":"-->","price":"180.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'el-mordjane-4',
    'El Mordjane',
    'Autoroute Nationale 1 Alger - Blida, Birtouta',
    'Alger',
    4,
    300,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'El Mordjane située à Alger vous accueille pour vos événements.',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"300 invités","inclus":true}]'::jsonb,
    '[{"label":"Location de salle","price":"4 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'les-6-palmiers-5',
    'Les 6 palmiers',
    '03 Hai Si-Haoues En face hôpital, Aïn Taya',
    'Alger',
    200000,
    330,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Les 6 palmiers vous propose une belle salle des fêtes d&#039;une capacité de 270 personnes avec un espace séparé d&#039;une capacité de 70 personnes.',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"330 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"70 places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"200.000 DA"},{"label":"-->","price":"500 DA"},{"label":"-->","price":"200.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'moulay-driss-6',
    'Moulay Driss',
    'Villa 3 , Complexe touristique, Zeralda',
    'Alger',
    1,
    300,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Un cadre prestigieux pour des moments inoubliables, qui conjugue traditions et modernité,la salle des fêtes Moulay Driss vous accueille dans un espace calm...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"300 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"60 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"220.000 DA"},{"label":"-->","price":"360.000 DA"},{"label":"-->","price":"460.000 DA"},{"label":"-->","price":"320.000 DA"},{"label":"-->","price":"360.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'palais-layel-7',
    'Palais Layel',
    '117 route nationale 24, Bordj El Bahri',
    'Alger',
    33,
    400,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Salle des fêtes PALAIS LAYEL Bordj el bahri est un véritable palais de rêve qui se distingue par son style mauresque et sa jolie décoration ,avec un person...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"400 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"100 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"260.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'tamgout-8',
    'Tamgout',
    'Birkhadem, Birkhadem',
    'Alger',
    175000,
    170,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'La salle des fêtes Tamgout vous accueille dans un décor somptueux qui ravira vos convives et fera de votre mariage une journée inoubliable. La salle d&#039;une ...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"170 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"50 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"175.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'el-rayan-9',
    'El Rayan',
    'Chéraga, Cheraga',
    'Alger',
    180000,
    180,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'La salle des fêtes El Rayan vous offre un espace élégant et raffiné pour tous vos événements : mariages, fêtes et réceptions. Profitez d’un cadre exception...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"180 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"40 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"180.000 DA"},{"label":"-->","price":"210.000 DA"},{"label":"-->","price":"250.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'harmony-events-10',
    'Harmony Events',
    'Jolie vue, Kouba',
    'Alger',
    90000,
    380,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Harmony Events met à votre disposition une magnifique salle de dîner pour organiser toutes vos cérémonies et fêter votre mariages dans une ambiance chic. A...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"380 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"90.000 DA"},{"label":"-->","price":"120.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'randa-11',
    'Randa',
    '55 hay reguieg, Dely Ibrahim',
    'Alger',
    130000,
    250,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Randa met à votre disposition une belle salle des fêtes d&#039;une capacité de 250 personnes.',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"250 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Parking","value":"40 places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"130.000 DA"},{"label":"-->","price":"140.000 DA"},{"label":"-->","price":"130.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'el-baraka-12',
    'El Baraka',
    'Belle vue, Bachdjerrah',
    'Alger',
    150000,
    200,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'La salle de dîner en Baraka vous accueil dans un décor somptueux pour votre mariage et toute autre fête. Elle ravira vos convives et vous marquera vos souv...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"200 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"50 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"150.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'el-hana-13',
    'El Hana',
    'Sebala, Draria',
    'Alger',
    250000,
    200,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    '',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"200 invités","inclus":true}]'::jsonb,
    '[{"label":"Location de salle","price":"250000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'm-suite-hotel-14',
    'M Suite Hotel',
    '9, route de l&#039;ALN, Dar El Beïda',
    'Alger',
    100000,
    170,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'La salle des fêtes du M Suite Hotel offre un cadre élégamment décoré, idéal pour accueillir vos événements les plus prestigieux. Avec une capacité de 120 p...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"170 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"50 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"100.000 DA"},{"label":"-->","price":"7.500 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'bensadok-15',
    'Bensadok',
    'Staouali, Staoueli',
    'Alger',
    150000,
    200,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'La salle des fêtes Bensadok vous accueil dans un cadre agréable et beau et vous offre toutes les commodités pour que votre mariage soit mémorable. Elle est...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"200 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Parking","value":"35 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"150.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'el-ketani-16',
    'El ketani',
    '3 Rue Meriem Abdelaziz, Bab El Oued',
    'Alger',
    250000,
    200,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Une magnifique salle des fêtes avec une terrasse et une belle vue sur mer',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"200 invités","inclus":true}]'::jsonb,
    '[{"label":"Location de salle","price":"250000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'hamza-17',
    'Hamza',
    '14 rue Ahmed Ouaked, Dely Ibrahim',
    'Alger',
    4,
    250,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'La salle des fêtes Hamza vous offre un cadre magnifique, chaleureux et convivial pour célébrer tous vos événements: mariage, fiançailles et réceptions de t...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"250 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"80 places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"200.000 DA"},{"label":"-->","price":"2.800 DA"},{"label":"-->","price":"270.000 DA"},{"label":"-->","price":"320.000 DA"},{"label":"-->","price":"350.000 DA"},{"label":"-->","price":"220.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'villa-mauresque-18',
    'Villa Mauresque',
    'Sidi Youcef, Beni Messous',
    'Alger',
    210000,
    250,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Villa Mauresque située à Alger vous accueille pour vos événements.',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"250 invités","inclus":true},{"label":"Parking","value":"90 places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"210.000 DA"},{"label":"-->","price":"260.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'le-carillon-stand-all-19',
    'Le Carillon Stand&#039;all',
    'Rue du Kiffane, Bordj El Kiffan, Bordj El Kiffan',
    'Alger',
    260000,
    700,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Le Carillon Stand&#039;all située à Alger vous accueille pour vos événements.',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"700 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"70 places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"260.000 DA"},{"label":"-->","price":"380.000 DA"},{"label":"-->","price":"480.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'lalla-mouni-20',
    'Lalla Mouni',
    'Rue zouaoua, Cheraga',
    'Alger',
    100000,
    240,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Lalla Mouni située à Alger vous accueille pour vos événements.',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"240 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"50 places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"100.000 DA"},{"label":"-->","price":"90.000 DA"},{"label":"-->","price":"85.000 DA"},{"label":"-->","price":"20.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'ichbilia-21',
    'Ichbilia',
    'Route principale, Beau lieu, El Harrach',
    'Alger',
    0,
    250,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Ichbilia située à Alger vous accueille pour vos événements.',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"250 invités","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"32 places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"120.000 DA"},{"label":"-->","price":"120.000 DA"},{"label":"-->","price":"160.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'rym-el-wissem-22',
    'Rym El Wissem',
    '95, Lotissement Ben Hadadi, Dar Diaf, Cheraga',
    'Alger',
    4,
    180,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'La salle RYM EL WISSEM vous propose ses services de restauration avec un traiteur d&#039;excellente réputation pour tous vos événements, familiaux et profession...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":true,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"180 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"30 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"180.000 DA"},{"label":"-->","price":"3.500 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'el-boulboul-23',
    'El Boulboul',
    '35 Rue Mohamed Garidi, Kouba',
    'Alger',
    9,
    300,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'La Salle des fêtes El Boulboul récemment rénovée, elle offre une décoration moderne et élégante, idéale pour divers événements tels que mariages, fiançaill...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"300 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"36 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"170.000 DA"},{"label":"-->","price":"120.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'villa-beggar-24',
    'Villa Beggar',
    'Ain Naadja, Djasr Kasentina',
    'Alger',
    200000,
    270,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Villa Beggar située à Alger vous accueille pour vos événements.',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"270 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Parking","value":"100 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"200.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'khadidja-reception-25',
    'Khadidja Réception',
    '(A proximité de safssafa) cité vielle ain naadja, Djasr Kasentina',
    'Alger',
    130000,
    300,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    ' Vous voulez organiser un dîner ou bien une réception professionnel ou familiale? (Dîner de mariage, fiançailles, fatha, Akika, khtana, séminaire ou une ré...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"300 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"100 places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"130.000 DA"},{"label":"-->","price":"140.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'el-houssain-26',
    'El Houssain',
    'Birtouta, Birtouta',
    'Alger',
    150000,
    250,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'El Houssain située à Alger vous accueille pour vos événements.',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":true,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"250 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"50 places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"150.000 DA"},{"label":"-->","price":"180.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'koceila-by-beldi-park-27',
    'Koceila by Beldi Park',
    'Beldi Park hotel, Plage Khalloufi 1, Zeralda',
    'Alger',
    260000,
    400,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Située à l&#039;Ouest d&#039;Alger, plus exactement au niveau de Zeralda Plage, la salle Koceila est une magnifique salle de banquets ayant une vue directe sur la Me...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"400 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"150 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"260.000 DA"},{"label":"-->","price":"330.000 DA"},{"label":"-->","price":"350.000 DA"},{"label":"-->","price":"440.000 DA"},{"label":"-->","price":"490.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'gardenia-28',
    'Gardénia',
    'Route du cap N° 24, Bordj El Kiffan',
    'Alger',
    250000,
    300,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Gardénia, le lieu rêvé pour l&#039;organisation de vos fêtes et vivre vos plus belles célébrations; La salle Gardénia est l&#039;endroit parfait vous assurant toutes...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"300 invités","inclus":true}]'::jsonb,
    '[{"label":"Location de salle","price":"250000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'dar-el-bahdja-29',
    'Dar El Bahdja',
    '44 cooperative El Badhja Sefsafa, Birkhadem',
    'Alger',
    85000,
    230,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Dar El Bahdja a le plaisir de vous accueillir. Nous sommes à votre disposition pour vous satisfaire et faire en sorte que vos événements soient mémorables....',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"230 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"80 places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"85.000 DA"},{"label":"-->","price":"115.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'prestige-30',
    'Prestige',
    '25 rue aliane ahcene, Aïn Benian',
    'Alger',
    250000,
    300,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    '2 salles à votre disposition pour toute célébration.',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"300 invités","inclus":true}]'::jsonb,
    '[{"label":"Location de salle","price":"250000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'lydia-31',
    'Lydia',
    'Route Ouled fayet, vers Chéraga,, Cheraga',
    'Alger',
    200000,
    240,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'La salle des fêtes Lydia dispose d&#039;une grande salle magnifiquement décorée et d&#039;une capacité de 240 personnes en plus d&#039;une petite salle d&#039;une capacité 200...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"240 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"60 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"200.000 DA"},{"label":"-->","price":"400.000 DA"},{"label":"-->","price":"270.000 DA"},{"label":"-->","price":"350.000 DA"},{"label":"-->","price":"3.500 DA"},{"label":"-->","price":"350.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'dar-zerrouk-32',
    'Dar Zerrouk',
    'Cité said hamdine, villa N°08 (à coté de la fac de droit d&#039;Alger), Bir Mourad Raïs',
    'Alger',
    1,
    300,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Dar Zerrouk met a votre disposition une élégante salle pour vos divers événements: Fête de mariage, fatha, dîner d&#039;affaire, réception, réunions de travail....',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"300 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"40 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"200.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'restaurant-les-jasmins-33',
    'Restaurant Les Jasmins',
    'El sefsafa (en face chateau d&#039;eau), Birkhadem',
    'Alger',
    37,
    200,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Le restaurant Les Jasmins vous accueille à El Sefsafa (en face du château d’eau) dans un cadre élégant, idéal pour mariages et événements familiaux. La sal...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"200 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"100 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"100.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'el-hanna-34',
    'El Hanna',
    'Cité hayat, 17 octobre Lot N°9, Djasr Kasentina',
    'Alger',
    250000,
    330,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    '',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"330 invités","inclus":true}]'::jsonb,
    '[{"label":"Location de salle","price":"250000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'bague-dali-35',
    'Bague Dali',
    'Belle vue, Kouba',
    'Alger',
    169,
    340,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    '',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"340 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"40 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"120.000 DA"},{"label":"-->","price":"160.000 DA"},{"label":"-->","price":"145.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'bois-des-cars-36',
    'Bois des cars',
    'Bois des cars, Dely Ibrahim',
    'Alger',
    6,
    300,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'La salle des fêtes Bois des cars se trouve au milieu de la forêt du bois des cars dans un cadre naturel magnifique. Dotée d’une décoration chic, la grande ...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"300 invités","inclus":true}]'::jsonb,
    '[{"label":"Location de salle","price":"6 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'al-djazira-37',
    'Al Djazira',
    'Route N°41 ex souk el fellah (près du circuit d&#039;examen d&#039;auto-écoles), Cheraga',
    'Alger',
    130000,
    400,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Notre salle dinatoire et de réception est mise à votre disposition pour tous type d’évènements : “Diner de Mariages, Diner de fiançailles, réceptions, bapt...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"400 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"100 places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"130.000 DA"},{"label":"-->","price":"100 DA"},{"label":"-->","price":"2.500 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'lilya-38',
    'Lilya',
    'Cité des Annassers, Villa Cher Fils, Kouba',
    'Alger',
    4,
    180,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Une belle salle des fêtes d&#039;une capacité de 180 personnes, En plus de 2 salles dinatoires pour les hommes et les femmes. ',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"180 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"60 places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"160.000 DA"},{"label":"-->","price":"150.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'el-fath-39',
    'El Fath',
    '26 lot reguieg ain allah, Dely Ibrahim',
    'Alger',
    8,
    260,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'El Fath située à Alger vous accueille pour vos événements.',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"260 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"50 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"90.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'royaume-traiteur-40',
    'Royaume Traiteur',
    '36 Chem. Sidi Yahia,, Hydra',
    'Alger',
    160000,
    290,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Le Royaume traiteur vous accueil dans un cadre magnifique et met à votre disposition deux espaces joliement décoré d&#039;une capacité de 140 femmes et 150 homm...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"290 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"20 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"160.000 DA"},{"label":"-->","price":"240.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'la-rose-blanche-41',
    'la Rose Blanche',
    'Zone d’activité N°85 11 Décembre 1960, Aïn Benian',
    'Alger',
    120000,
    450,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'La rose blanche est une nouvelle salle des fêtes conçue selon des critères de qualité de manière à assurer la sérénité à vous et vous invités. Dispose des ...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"450 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"80 places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"120.000 DA"},{"label":"-->","price":"160.000 DA"},{"label":"-->","price":"170.000 DA"},{"label":"-->","price":"200.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'stand-all-42',
    'Stand&#039;All',
    'Route de la Rassauta, Bordj El Kiffan',
    'Alger',
    300000,
    500,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Stand&#039;ALL met à votre disposition une grande salle d&#039;une capacité de 500 personnes en plus d&#039;un espace (hall d&#039;accueil) d&#039;une capacité de 200 personnes. St...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"500 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"150 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"300.000 DA"},{"label":"-->","price":"500.000 DA"},{"label":"-->","price":"450.000 DA"},{"label":"-->","price":"3.800 DA"},{"label":"-->","price":"350.000 DA"},{"label":"-->","price":"400.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'beluga-43',
    'Beluga',
    'Cité Galoul, n°641, Bordj El Bahri',
    'Alger',
    160000,
    200,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'La salle de dîner Beluga est idéalement situé à Bordj el Bahri et offre un cadre et une décoration somptueuse qui ravira vos convives. Un grand espace de d...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"200 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"20 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"160.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'dar-el-saada-44',
    'Dar El Saada',
    'RN24 - 113 Route du cap, Bordj El Kiffan',
    'Alger',
    160000,
    200,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Traiteur Dar El Saada pour vos dîner de mariage, banquet, noces et réunions',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"200 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"120 places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"160.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'assinate-45',
    'Assinate',
    'Route national N 38, cité la montagne, Bourouba',
    'Alger',
    250000,
    480,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Salle de banquets pour vos mariages et autres cérémonies personnelles. Salle de conférence aussi pour vos événements professionnels. Nous mettons à votre d...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"480 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"120 places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"250.000 DA"},{"label":"-->","price":"350.000 DA"},{"label":"-->","price":"3.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'el-djenane-ex-catherine-47',
    'El Djenane ex Catherine',
    '22, rue des deux piliers, Bouzareah',
    'Alger',
    120000,
    300,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Pour tous vos mariages, fiançailles, baptêmes,conférences,... El Djenane ex Catherine doté d&#039;une décoration mauresque vous offre un espace magnifique dans ...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"300 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"140 places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"120.000 DA"},{"label":"-->","price":"150.000 DA"},{"label":"-->","price":"120.000 DA"},{"label":"-->","price":"150.000 DA"},{"label":"-->","price":"200.000 DA"},{"label":"-->","price":"250.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'el-djazairia-48',
    'El Djazairia',
    '05 rue mohamed naïli, El Harrach',
    'Alger',
    120000,
    200,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'La salle des fêtes El Djazairia vous accueil dans un cadre agréable et offre toutes les comodités pour que votre mariage soit réussi. Elle dispose d&#039;espace...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"200 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"40 places","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"120.000 DA"},{"label":"-->","price":"150.000 DA"},{"label":"-->","price":"240.000 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
    'imane-49',
    'Imane',
    'El Achour, El Achour',
    'Alger',
    55,
    250,
    4.8,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'Située à El Achour, la salle des fêtes Imane offre un espace raffiné et convivial pour accueillir vos événements, qu’il s’agisse de mariages, fiançailles, ...',
    '{"parking":true,"dj":true,"photographe":true,"traiteur":true,"serveurs":false,"decoration":true}'::jsonb,
    '[{"label":"Nombre d''invités","value":"250 invités","inclus":true},{"label":"Salon homme","value":"Disponible","inclus":true},{"label":"Boissons","value":"Inclus","inclus":true},{"label":"Traiteur","value":"Inclus","inclus":true},{"label":"Parking","value":"80 places","inclus":true},{"label":"Accès handicapés","value":"Inclus","inclus":true}]'::jsonb,
    '[{"label":"-->","price":"190.000 DA"},{"label":"-->","price":"2.200 DA"}]'::jsonb,
    '["Mariage","Alger"]'::jsonb
  );
