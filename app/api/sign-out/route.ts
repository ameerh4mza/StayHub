import { NextResponse } from "next/server";
import { createSessionClient, SESSION_COOKIE } from "@/config/appwrite";

export async function POST(request: Request) {
  try {
    // Get session client and account
    const { account } = createSessionClient(request);

    // Delete the current Appwrite session
    await account.deleteSession("current");

    // Prepare response
    const res = NextResponse.json({ success: true });

    // Clear the cookie
    res.cookies.set(SESSION_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0, // delete immediately
    });

    return res;
  } catch (error) {
    console.error("Sign-out error:", error);
    // If session doesn't exist, still clear cookie
    const res = NextResponse.json({ success: true, message: "Logged out" });
    res.cookies.set(SESSION_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    return res;
  }
}
