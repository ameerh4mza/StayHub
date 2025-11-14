import { Models } from "node-appwrite";

export type Room = {
  user_id: string;
  name: string;
  address: string;
  availability: string;
  price_per_hour: number;
  description?: string;
  location?: string;
  sqft?: number;
  capacity?: number;
  amenities?: string;
  image?: string;
} & Models.Document;
