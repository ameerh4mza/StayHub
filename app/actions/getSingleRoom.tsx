"use server";

import { createAdminClient } from "@/config/appwrite";
import { Room } from "@/types/room";

export default async function getSingleRoom(id: string): Promise<Room | null> {
  try {
    const { databases } = await createAdminClient();
    const { documents: rooms } = await databases.listDocuments<Room>(
      process.env.NEXT_APPWRITE_DATABASE_ID!,
      process.env.NEXT_APPWRITE_ROOMS_COLLECTION_ID!
    );
    return rooms.find((room) => room.$id === id) || null;
  } catch (error) {
    console.error("Error fetching room:", error);
    return null;
  }
}
