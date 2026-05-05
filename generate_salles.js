const fs = require('fs');

const sql = fs.readFileSync('setup_database.sql', 'utf8');
const lines = sql.split('\n');

const salles = [];
let currentSalle = null;
let capture = false;

// We know the insert format:
// INSERT INTO public.salles (id, nom, localisation, commune, prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags) VALUES (
//     'id-here',
//     'Name here',
//     'Location here',
// ... etc

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.startsWith("INSERT INTO public.salles")) {
    // skip the one from supabase-setup.sql if it exists
    if(line.includes("gen_random_uuid")) continue;
    
    // next lines contain the values
    const id = lines[i+1].trim().replace(/^'|',$/g, '');
    const nom = lines[i+2].trim().replace(/^'|',$/g, '').replace(/&#039;/g, "'");
    const localisation = lines[i+3].trim().replace(/^'|',$/g, '').replace(/&#039;/g, "'");
    const commune = lines[i+4].trim().replace(/^'|',$/g, '');
    const prix = Number(lines[i+5].trim().replace(/,$/, ''));
    const capacite = Number(lines[i+6].trim().replace(/,$/, ''));
    const rating = Number(lines[i+7].trim().replace(/,$/, ''));
    const image_url = lines[i+8].trim().replace(/^'|',$/g, '');
    
    let imagesRaw = lines[i+9].trim();
    if(imagesRaw.endsWith("::jsonb,")) imagesRaw = imagesRaw.replace("::jsonb,", "");
    imagesRaw = imagesRaw.replace(/^'|'$/g, "");
    let images = [];
    try { images = JSON.parse(imagesRaw); } catch(e){}

    const description = lines[i+10].trim().replace(/^'|',$/g, '').replace(/&#039;/g, "'");

    let servicesRaw = lines[i+11].trim();
    if(servicesRaw.endsWith("::jsonb,")) servicesRaw = servicesRaw.replace("::jsonb,", "");
    servicesRaw = servicesRaw.replace(/^'|'$/g, "");
    let services = {};
    try { services = JSON.parse(servicesRaw); } catch(e){}

    let equipementsRaw = lines[i+12].trim();
    if(equipementsRaw.endsWith("::jsonb,")) equipementsRaw = equipementsRaw.replace("::jsonb,", "");
    equipementsRaw = equipementsRaw.replace(/^'|'$/g, "");
    let equipements = [];
    try { equipements = JSON.parse(equipementsRaw); } catch(e){}

    let prestationsRaw = lines[i+13].trim();
    if(prestationsRaw.endsWith("::jsonb,")) prestationsRaw = prestationsRaw.replace("::jsonb,", "");
    prestationsRaw = prestationsRaw.replace(/^'|'$/g, "");
    let prestations = [];
    try { prestations = JSON.parse(prestationsRaw); } catch(e){}

    let tagsRaw = lines[i+14].trim();
    if(tagsRaw.endsWith("::jsonb")) tagsRaw = tagsRaw.replace("::jsonb", "");
    tagsRaw = tagsRaw.replace(/^'|'$/g, "");
    let tags = [];
    try { tags = JSON.parse(tagsRaw); } catch(e){}

    if(id && !id.includes("gen_random_uuid")) {
      salles.push({
        id, nom, localisation, commune, prix: prix < 100 ? prix * 1000 : prix, capacite, rating, image_url, images, description, services, equipements, prestations, tags
      });
    }
  }
}

const fileContent = `export interface Salle {
  id: string;
  nom: string;
  localisation: string;
  commune: string;
  prix: number;
  capacite: number;
  rating: number;
  image_url: string;
  images: string[];
  description: string;
  services: Record<string, boolean>;
  equipements: { label: string; value: string; inclus: boolean }[];
  prestations: { label: string; price: string }[];
  tags: string[];
}

export const sallesData: Salle[] = ${JSON.stringify(salles, null, 2)};
`;

fs.writeFileSync('src/data/sallesData.ts', fileContent);
console.log('Successfully wrote ' + salles.length + ' salles to src/data/sallesData.ts');
