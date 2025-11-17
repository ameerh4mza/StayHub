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

    const teamList = await teams.list();

    for (const team of teamList.teams) {
      if (team.name === "Admins") {
        try {
          const memberships = await teams.listMemberships(team.$id);
          const userMembership = memberships.memberships.find(
            (membership) => membership.userId === user.$id
          );
          if (userMembership) return "admin";
        } catch {
          throw new Error("Failed to verify admin membership");
        }
      }
    }

    for (const team of teamList.teams) {
      if (team.name === "Managers") {
        try {
          const memberships = await teams.listMemberships(team.$id);
          const userMembership = memberships.memberships.find(
            (membership) => membership.userId === user.$id
          );
          if (userMembership) return "manager";
        } catch {
          throw new Error("Failed to verify manager membership");
        }
      }
    }

    return "user";
  } catch (error) {
    console.error("getCurrentUserRole error:", error);
    return "user";
  }
}

export async function requireRole(allowedRoles: UserRole[]) {
  const userRole = await getCurrentUserRole();

  const roleHierarchy = { admin: 3, manager: 2, user: 1 };
  const userLevel = roleHierarchy[userRole];
  const requiredLevels = allowedRoles.map((role) => roleHierarchy[role]);

  if (!requiredLevels.some((level) => userLevel >= level)) {
    throw new Error("Insufficient permissions");
  }

  return { role: userRole };
}
