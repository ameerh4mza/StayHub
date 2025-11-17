import { NextResponse } from "next/server";
import { createAdminClient } from "@/config/appwrite";

export async function POST(req: Request) {
  try {
    const { userId, imageUrl } = await req.json();

    if (!userId || !imageUrl) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const { users } = createAdminClient();

    await users.updatePrefs(userId, { image: imageUrl });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile image:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
