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

    const { account } = createSessionClient(request);
    const user = await account.get();

    if (!user) {
      return { success: false };
    }

    const { databases } = createAdminClient();

    const roomToEdit = await databases.getDocument(
      process.env.NEXT_APPWRITE_DATABASE_ID!,
      process.env.NEXT_APPWRITE_ROOMS_COLLECTION_ID!,
      roomId
    );

    if (!roomToEdit) {
      return { success: false };
    }

    if (role === "admin") {
      const adminManagerIds = await getAdminManagerUserIds();
      if (!adminManagerIds.includes(roomToEdit.user_id)) {
        return { success: false };
      }
    } else if (role === "manager") {
      if (roomToEdit.user_id !== user.$id) {
        return { success: false };
      }
    } else {
      if (roomToEdit.user_id !== user.$id) {
        return { success: false };
      }
    }

    if (roomToEdit) {
      await databases.updateDocument(
        process.env.NEXT_APPWRITE_DATABASE_ID!,
        process.env.NEXT_APPWRITE_ROOMS_COLLECTION_ID!,
        roomToEdit.$id,
        data
      );

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
