import { createAdminClient } from "@/config/appwrite";

export interface UserInfo {
  $id: string;
  name: string;
  email: string;
}

// Cache to avoid making too many API calls
const userCache = new Map<string, UserInfo>();

export async function getUserInfo(userId: string): Promise<UserInfo> {
  // Check if we already have this user in cache
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

    // Cache the user info
    userCache.set(userId, userInfo);

    return userInfo;
  } catch (error) {
    console.error(`Error fetching user info for ID ${userId}:`, error);

    // Return fallback info
    const fallbackInfo: UserInfo = {
      $id: userId,
      name: `User ${userId.slice(-8)}`,
      email: "Not available",
    };

    return fallbackInfo;
  }
}

// Function to get multiple users at once
export async function getUsersInfo(
  userIds: string[]
): Promise<Map<string, UserInfo>> {
  const userInfoMap = new Map<string, UserInfo>();

  // Process all user IDs in parallel
  const userPromises = userIds.map(async (userId) => {
    const userInfo = await getUserInfo(userId);
    userInfoMap.set(userId, userInfo);
  });

  await Promise.all(userPromises);

  return userInfoMap;
}
