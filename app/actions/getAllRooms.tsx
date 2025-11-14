"use server";

import { createAdminClient } from "@/config/appwrite";
import { Room } from "@/types/room";

export default async function getAllRooms(): Promise<Room[]> {
  try {
    const { databases } = await createAdminClient();
    const { documents: rooms } = await databases.listDocuments<Room>(
      process.env.NEXT_APPWRITE_DATABASE_ID!,
      process.env.NEXT_APPWRITE_ROOMS_COLLECTION_ID!
    );
    return rooms;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }
}
