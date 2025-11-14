"use server";

import { createSessionClient } from "@/config/appwrite";
import { requireRole } from "@/app/actions/getCurrentUserRole";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { BookingStatus } from "@/types/booking";
import { createNotification } from "@/app/actions/notifications";

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    // Require manager or admin role
    await requireRole(["manager", "admin"]);

    const sessionCookie = await cookies();
    const request = new Request("http://localhost", {
      headers: {
        cookie: sessionCookie.toString(),
      },
    });
    const session = sessionCookie.get("my-custom-session");
    if (!session) {
      return {
        success: false,
        error: "Unauthorized: No active session",
      };
    }

    const { databases } = createSessionClient(request);

    // Get booking details first to get user_id for notification
    const booking = await databases.getDocument(
      process.env.NEXT_APPWRITE_DATABASE_ID!,
      process.env.NEXT_APPWRITE_BOOKINGS_COLLECTION_ID!,
      bookingId
    );

    // Update booking status (simplified - status enum contains cancellation source)
    await databases.updateDocument(
      process.env.NEXT_APPWRITE_DATABASE_ID!,
      process.env.NEXT_APPWRITE_BOOKINGS_COLLECTION_ID!,
      bookingId,
      { status }
    );

    // Create notification for the user
    let notificationMessage = "";
    let notificationType:
      | "booking_confirmed"
      | "booking_rejected"
      | "booking_cancelled" = "booking_confirmed";

    switch (status) {
      case "confirmed":
        notificationMessage =
          "Your booking has been confirmed! You can now enjoy your reserved room.";
        notificationType = "booking_confirmed";
        break;
      case "rejected":
        notificationMessage =
          "Unfortunately, your booking has been rejected. Please try booking another room or contact support.";
        notificationType = "booking_rejected";
        break;
      case "cancelled_by_admin":
        notificationMessage =
          "Your booking has been cancelled by administration. Please contact support for more information.";
        notificationType = "booking_cancelled";
        break;
      default:
        // Don't create notification for other status changes
        break;
    }

    // Create notification if message is set
    if (notificationMessage) {
      await createNotification(
        booking.user_id,
        bookingId,
        notificationMessage,
        notificationType
      );
    }

    // Revalidate all booking pages
    revalidatePath("/admin/bookings");
    revalidatePath("/manager/bookings");
    revalidatePath("/bookings");

    return { success: true };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update booking",
    };
  }
}
