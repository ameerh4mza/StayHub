// app/profile/page.tsx
import { getUser } from "@/app/actions/getUser";
import { redirect } from "next/navigation";
import ProfileClient from "@/app/actions/profileClient";

export default async function ProfilePage() {
  const result = await getUser();

  if (!result.success || !result.user) {
    redirect("/login");
  }

  return <ProfileClient user={result.user} />;
}