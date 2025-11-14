"use server";

import { createSessionClient, createAdminClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { requireRole } from "./getCurrentUserRole";
import { Room } from "@/types/room";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function editRoom(
  roomId: string,
  data: Room
): Promise<{ success: boolean }> {
  try {
    const sessionCookie = await cookies();
    const request = new Request("http://localhost", {
      headers: {
        cookie: sessionCookie.toString(),
      },
    });
    const session = sessionCookie.get("my-custom-session");
    if (!session) {
      redirect("/auth/login");
    }

    const { role } = await requireRole(["admin", "manager"]);

    // Get user session for verification
    const { account } = createSessionClient(request);
    const user = await account.get();

    if (!user) {
      return { success: false };
    }

    // Use admin client for database operations to avoid permission issues
    const { databases } = createAdminClient();

    // Get the room to check ownership
    const roomToEdit = await databases.getDocument(
      process.env.NEXT_APPWRITE_DATABASE_ID!,
      process.env.NEXT_APPWRITE_ROOMS_COLLECTION_ID!,
      roomId
    );

    if (!roomToEdit) {
      return { success: false };
    }

    // Check permissions based on role
    if (role === "admin") {
      // Admin can edit rooms created by admin and manager
      const adminManagerIds = await getAdminManagerUserIds();
      if (!adminManagerIds.includes(roomToEdit.user_id)) {
        return { success: false };
      }
    } else if (role === "manager") {
      // Manager can only edit rooms they created
      if (roomToEdit.user_id !== user.$id) {
        return { success: false };
      }
    } else {
      // Regular users can only edit their own rooms (if they have any)
      if (roomToEdit.user_id !== user.$id) {
        return { success: false };
      }
    }

    //edit room if found
    if (roomToEdit) {
      await databases.updateDocument(
        process.env.NEXT_APPWRITE_DATABASE_ID!,
        process.env.NEXT_APPWRITE_ROOMS_COLLECTION_ID!,
        roomToEdit.$id,
        data
      );

      // Revalidate my rooms and all rooms page
      revalidatePath("/rooms/my", "layout");
      revalidatePath("/", "layout");
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating room:", error);
    return {
      success: false,
    };
  }
}

// Helper function to get all admin and manager user IDs
async function getAdminManagerUserIds(): Promise<string[]> {
  try {
    const { teams } = createAdminClient();
    const userIds: string[] = [];

    // Get admin team members
    try {
      const teamList = await teams.list();
      const adminTeam = teamList.teams.find(team => team.name === "Admins");
      if (adminTeam) {
        const adminMemberships = await teams.listMemberships(adminTeam.$id);
        userIds.push(...adminMemberships.memberships.map(m => m.userId));
      }
    } catch (error) {
      console.error("Error fetching admin team:", error);
    }

    // Get manager team members
    try {
      const teamList = await teams.list();
      const managerTeam = teamList.teams.find(team => team.name === "Managers");
      if (managerTeam) {
        const managerMemberships = await teams.listMemberships(managerTeam.$id);
        userIds.push(...managerMemberships.memberships.map(m => m.userId));
      }
    } catch (error) {
      console.error("Error fetching manager team:", error);
    }

    return [...new Set(userIds)]; // Remove duplicates
  } catch (error) {
    console.error("Error getting admin/manager user IDs:", error);
    return [];
  }
}
