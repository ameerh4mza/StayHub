import { NextResponse } from "next/server";
import { createAdminClient, SESSION_COOKIE } from "@/config/appwrite";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const { account } = createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    const res = NextResponse.json({ success: true, userId: session.userId });
    res.cookies.set(SESSION_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err: unknown) {
    console.error("Login error:", err);
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : "An unexpected error occurred";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
