"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";

export async function getUser() {
  try {
    const cookieStore = await cookies();
    const request = new Request("http://localhost", {
      headers: {
        cookie: cookieStore.toString(),
      },
    });

    const { account } = createSessionClient(request);
    const user = await account.get();
    const prefs = await account.getPrefs();

    return {
      success: true,
      user: {
        $id: user.$id,
        name: user.name,
        email: user.email,
        image: prefs.image || undefined,
      },
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      success: false,
      user: null,
    };
  }
}
