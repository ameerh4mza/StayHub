import { NextResponse } from "next/server";
import { getUser } from "@/app/actions/getUser";

export async function GET() {
  try {
    const result = await getUser();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({
      success: false,
      user: null,
    });
  }
}
