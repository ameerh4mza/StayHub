import { NextResponse } from "next/server";
import { getCurrentUserRole } from "@/app/actions/getCurrentUserRole";

export async function GET() {
  try {
    const role = await getCurrentUserRole();
    return NextResponse.json({ role });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json({ role: "user" });
  }
}
