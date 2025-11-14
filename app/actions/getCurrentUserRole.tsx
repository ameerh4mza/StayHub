import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type UserRole = "admin" | "manager" | "user";

export async function getCurrentUserRole(): Promise<UserRole> {
  try {
    const cookieStore = await cookies();
    const request = new Request("http://localhost", {
      headers: {
        cookie: cookieStore.toString(),
      },
    });
    const session = cookieStore.get("my-custom-session");
    if (!session) {
      redirect("/auth/login");
    }

    const { account, teams } = createSessionClient(request);
    const user = await account.get();

    // Get all teams and check if user is a member
    const teamList = await teams.list();

    // Check if user is a member of admin team
    for (const team of teamList.teams) {
      if (team.name === "Admins") {
        try {
          // Try to get membership details for this team
          const memberships = await teams.listMemberships(team.$id);
          const userMembership = memberships.memberships.find(
            (membership) => membership.userId === user.$id
          );
          if (userMembership) return "admin";
        } catch {
          // User is not a member of this team, continue
        }
      }
    }

    // Check if user is a member of manager team
    for (const team of teamList.teams) {
      if (team.name === "Managers") {
        try {
          // Try to get membership details for this team
          const memberships = await teams.listMemberships(team.$id);
          const userMembership = memberships.memberships.find(
            (membership) => membership.userId === user.$id
          );
          if (userMembership) return "manager";
        } catch {
          // User is not a member of this team, continue
        }
      }
    }

    // Default to user
    return "user";
  } catch (error) {
    console.error("getCurrentUserRole error:", error);
    return "user"; // Default role
  }
}

export async function requireRole(allowedRoles: UserRole[]) {
  const userRole = await getCurrentUserRole();

  // Role hierarchy: admin > manager > user
  const roleHierarchy = { admin: 3, manager: 2, user: 1 };
  const userLevel = roleHierarchy[userRole];
  const requiredLevels = allowedRoles.map((role) => roleHierarchy[role]);

  if (!requiredLevels.some((level) => userLevel >= level)) {
    throw new Error("Insufficient permissions");
  }

  return { role: userRole };
}
