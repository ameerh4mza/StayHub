"use server";

import { createAdminClient } from "@/config/appwrite";
import { getUser } from "./getUser";
import { requireRole } from "./getCurrentUserRole";
import { revalidatePath } from "next/cache";
import { ID, Permission, Role } from "node-appwrite";

type FormData = {
  name: string;
  description: string;
  address: string;
  availability: string;
  price_per_hour: number;
  location?: string;
  sqft?: number;
  capacity?: number;
  amenities?: string;
  image?: string;
};

export async function createRoom(data: FormData) {
  try {
    await requireRole(["admin", "manager"]);

    const databaseId = process.env.NEXT_APPWRITE_DATABASE_ID;
    const collectionId = process.env.NEXT_APPWRITE_ROOMS_COLLECTION_ID;

    if (!databaseId || !collectionId) {
      console.log("No environment variables for Appwrite setup");
      throw new Error("Database ID or Collection ID is not defined");
    }

    const user = await getUser();
    const userId = user.success && user.user ? user.user.$id : null;

    if (!userId) {
      return { success: false, room: null };
    }
    const { databases } = await createAdminClient();

    const newRoom = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        ...data,
        user_id: userId,
      },
      [
        Permission.read(Role.any()),
        Permission.update(Role.user(userId)),
        Permission.update(Role.team("admins")),
        Permission.update(Role.team("managers")),
        Permission.delete(Role.user(userId)),
        Permission.delete(Role.team("admins")),
      ]
    );

    revalidatePath("/", "layout");
    return {
      success: true,
      room: newRoom,
    };
  } catch (error: unknown) {
    console.error("Error creating room:", error);
    const message = error instanceof Error ? error.message : String(error);
    console.log("Error message:", message);
    throw error;
  }
}
