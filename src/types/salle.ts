export interface Salle {
  id: string;
  nom: string;
  localisation: string;
  prix: number;
  capacite: number;
  description: string | null;
  services: string[] | null;
  image_url: string | null;
  photos: string[] | null;
  equipements: string[] | null;
  prestations: string[] | null;
  created_at: string;
}

export type SalleInsert = Omit<Salle, 'id' | 'created_at'>;
