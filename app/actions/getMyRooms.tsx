"use server";

import { createSessionClient, createAdminClient } from "@/config/appwrite";
import {cookies} from "next/headers";
import { Query } from "node-appwrite";
import { Room } from "@/types/room";
import { redirect } from "next/navigation";
import { getCurrentUserRole } from "./getCurrentUserRole";

export default async function getMyRooms(): Promise<Room[]> {
    try{
    const sessionCookie = await cookies();
        const request = new Request("http://localhost", {
      headers: {
        cookie: sessionCookie.toString(),
      },
    });
    if (!sessionCookie) {
        redirect('/auth/login');
    }

    const { account, databases } = await createSessionClient(request);
    // Get the current user id and role
    const user = await account.get();
    const userId = user.$id;
    const userRole = await getCurrentUserRole();

    let rooms: Room[] = [];

    if (userRole === "admin") {
      // Admin can see all rooms created by admin and manager
      const { databases: adminDatabases } = createAdminClient();
      
      // Get all admin and manager user IDs
      const adminManagerIds = await getAdminManagerUserIds();
      
      if (adminManagerIds.length > 0) {
        const { documents: allRooms } = await adminDatabases.listDocuments<Room>(
          process.env.NEXT_APPWRITE_DATABASE_ID!,
          process.env.NEXT_APPWRITE_ROOMS_COLLECTION_ID!,
          [Query.equal("user_id", adminManagerIds)]
        );
        rooms = allRooms;
      }
    } else if (userRole === "manager") {
      // Manager can only see rooms they created
      const { documents: managerRooms } = await databases.listDocuments<Room>(
        process.env.NEXT_APPWRITE_DATABASE_ID!,
        process.env.NEXT_APPWRITE_ROOMS_COLLECTION_ID!,
        [Query.equal("user_id", userId)]
      );
      rooms = managerRooms;
    } else {
      // Regular users can only see rooms they created (if any)
      const { documents: userRooms } = await databases.listDocuments<Room>(
        process.env.NEXT_APPWRITE_DATABASE_ID!,
        process.env.NEXT_APPWRITE_ROOMS_COLLECTION_ID!,
        [Query.equal("user_id", userId)]
      );
      rooms = userRooms;
    }

    return rooms;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return [];
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

