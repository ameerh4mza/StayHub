import { NextResponse } from "next/server";
import { createSessionClient, SESSION_COOKIE } from "@/config/appwrite";

export async function POST(request: Request) {
  try {
    const { account } = createSessionClient(request);

    await account.deleteSession("current");

    const res = NextResponse.json({ success: true });

    res.cookies.set(SESSION_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    return res;
  } catch (error) {
    console.error("Sign-out error:", error);
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
