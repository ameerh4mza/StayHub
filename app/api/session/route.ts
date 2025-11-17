import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookiesList = await cookies();
  const session = cookiesList.get("my-custom-session");
  return NextResponse.json({ loggedIn: !!session });
}
