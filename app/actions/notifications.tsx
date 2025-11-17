"use server";

import { createAdminClient } from "@/config/appwrite";
import { ID, Query } from "node-appwrite";

export interface BookingNotification {
  user_id: string;
  booking_id: string;
  message: string;
  type: "booking_confirmed" | "booking_rejected" | "booking_cancelled";
  is_read: boolean;
}

export async function createNotification(
  userId: string,
  bookingId: string,
  message: string,
  type: BookingNotification["type"]
): Promise<{ success: boolean; error?: string }> {
  try {
    const { databases } = createAdminClient();

    await databases.createDocument(
      process.env.NEXT_APPWRITE_DATABASE_ID!,
      process.env.NEXT_APPWRITE_NOTIFICATIONS_COLLECTION_ID!,
      ID.unique(),
      {
        user_id: userId,
        booking_id: bookingId,
        message,
        type,
        is_read: false,
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Error creating notification:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create notification",
    };
  }
}

export async function getUserNotifications(userId: string) {
  try {
    const { databases } = createAdminClient();

    const { documents: notifications } = await databases.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_ID!,
      process.env.NEXT_APPWRITE_NOTIFICATIONS_COLLECTION_ID!,
      [Query.equal("user_id", userId), Query.equal("is_read", false)]
    );

    return { success: true, notifications };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, notifications: [] };
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const { databases } = createAdminClient();

    await databases.updateDocument(
      process.env.NEXT_APPWRITE_DATABASE_ID!,
      process.env.NEXT_APPWRITE_NOTIFICATIONS_COLLECTION_ID!,
      notificationId,
      { is_read: true }
    );

    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false };
  }
}
