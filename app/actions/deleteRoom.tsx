"use server";

import { createSessionClient, createAdminClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { requireRole } from "./getCurrentUserRole";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function deleteRoom(
  roomId: string
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

    const { account } = createSessionClient(request);
    const user = await account.get();
    if (!user) return { success: false };

    const { databases } = createAdminClient();

    const roomToDelete = await databases.getDocument(
      process.env.NEXT_APPWRITE_DATABASE_ID!,
      process.env.NEXT_APPWRITE_ROOMS_COLLECTION_ID!,
      roomId
    );

    if (role === "admin") {
      const adminManagerIds = await getAdminManagerUserIds();
      if (!adminManagerIds.includes(roomToDelete.user_id)) {
        throw new Error(
          "Admins can only delete rooms created by admins or managers."
        );
      }
    } else if (role === "manager") {
      if (roomToDelete.user_id !== user.$id) {
        throw new Error("Managers can only delete their own rooms.");
      }
    } else {
      if (roomToDelete.user_id !== user.$id) {
        throw new Error("You can only delete your own rooms.");
      }
    }

    await databases.deleteDocument(
      process.env.NEXT_APPWRITE_DATABASE_ID!,
      process.env.NEXT_APPWRITE_ROOMS_COLLECTION_ID!,
      roomId
    );

    revalidatePath("/rooms/my", "layout");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Error deleting room:", error);
    return { success: false };
  }
}

async function getAdminManagerUserIds(): Promise<string[]> {
  try {
    const { teams } = createAdminClient();
    const userIds: string[] = [];

    try {
      const teamList = await teams.list();
      const adminTeam = teamList.teams.find((team) => team.name === "Admins");
      if (adminTeam) {
        const adminMemberships = await teams.listMemberships(adminTeam.$id);
        userIds.push(...adminMemberships.memberships.map((m) => m.userId));
      }
    } catch (error) {
      console.error("Error fetching admin team:", error);
    }

    try {
      const teamList = await teams.list();
      const managerTeam = teamList.teams.find(
        (team) => team.name === "Managers"
      );
      if (managerTeam) {
        const managerMemberships = await teams.listMemberships(managerTeam.$id);
        userIds.push(...managerMemberships.memberships.map((m) => m.userId));
      }
    } catch (error) {
      console.error("Error fetching manager team:", error);
    }

    return [...new Set(userIds)];
  } catch (error) {
    console.error("Error getting admin/manager user IDs:", error);
    return [];
  }
}
