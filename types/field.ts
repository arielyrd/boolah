export interface FieldData {
  id: string; // UUID
  name: string;
  sport_type: string;
  location: string;
  description: string;
  price_per_hour: number;
  image_url: string;
  amenities?: string[]; // opsional, jika ada relasi/kolom amenities
}
