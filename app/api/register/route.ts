import { NextResponse } from "next/server";
import { createAdminClient, SESSION_COOKIE } from "@/config/appwrite";
import { ID } from "node-appwrite";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    const { account, teams } = createAdminClient();

    // Create user in Appwrite
     await account.create(ID.unique(), email, password, name);

    // Get or create the "Users" team
    let userTeam;
    try {
      const teamsList = await teams.list();
      userTeam = teamsList.teams.find((team) => team.name === "Users");

      if (!userTeam) {
        userTeam = await teams.create(ID.unique(), "Users");
      }
    } catch (error) {
      userTeam = await teams.create(ID.unique(), "Users");
      console.log("Error getting or creating Users team:", error);
    }

    await teams.createMembership(userTeam.$id, ["member"], email);

    const session = await account.createEmailPasswordSession(email, password);

    // Save session in cookie
    const res = NextResponse.json({ success: true, userId: session.userId });
    res.cookies.set(SESSION_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err: unknown) {
    console.error("Register error:", err);
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : "An unexpected error occurred";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
