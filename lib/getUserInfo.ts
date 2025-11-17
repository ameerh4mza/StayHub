import { createAdminClient } from "@/config/appwrite";

export interface UserInfo {
  $id: string;
  name: string;
  email: string;
}

const userCache = new Map<string, UserInfo>();

export async function getUserInfo(userId: string): Promise<UserInfo> {
  if (userCache.has(userId)) {
    return userCache.get(userId)!;
  }

  try {
    const { users } = createAdminClient();
    const user = await users.get(userId);

    const userInfo: UserInfo = {
      $id: user.$id,
      name: user.name || "Unknown User",
      email: user.email || "No email provided",
    };

    userCache.set(userId, userInfo);

    return userInfo;
  } catch (error) {
    console.error(`Error fetching user info for ID ${userId}:`, error);

    const fallbackInfo: UserInfo = {
      $id: userId,
      name: `User ${userId.slice(-8)}`,
      email: "Not available",
    };

    return fallbackInfo;
  }
}

export async function getUsersInfo(
  userIds: string[]
): Promise<Map<string, UserInfo>> {
  const userInfoMap = new Map<string, UserInfo>();

  const userPromises = userIds.map(async (userId) => {
    const userInfo = await getUserInfo(userId);
    userInfoMap.set(userId, userInfo);
  });

  await Promise.all(userPromises);

  return userInfoMap;
}
