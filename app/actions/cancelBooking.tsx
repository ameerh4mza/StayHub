"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function cancelBooking(
  bookingId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const sessionCookie = await cookies();
    const request = new Request("http://localhost", {
      headers: {
        cookie: sessionCookie.toString(),
      },
    });
    const session = sessionCookie.get("my-custom-session");
    if (!session) {
      redirect("/auth/login");
    }

    const { account, databases } = await createSessionClient(request);
    // Get the current user id
    const user = await account.get();
    const userId = user.$id;

    // First, get the specific booking to verify it belongs to the user
    try {
      const booking = await databases.getDocument(
        process.env.NEXT_APPWRITE_DATABASE_ID!,
        process.env.NEXT_APPWRITE_BOOKINGS_COLLECTION_ID!,
        bookingId
      );

      // Verify the booking belongs to the current user
      if (booking.user_id !== userId) {
        return {
          success: false,
          error: "You can only cancel your own bookings",
        };
      }

      await databases.updateDocument(
        process.env.NEXT_APPWRITE_DATABASE_ID!,
        process.env.NEXT_APPWRITE_BOOKINGS_COLLECTION_ID!,
        bookingId,
        {
          status: "cancelled_by_user",
        }
      );

      // Revalidate the bookings page
      revalidatePath("/bookings", "layout");

      return {
        success: true,
      };
    } catch (error) {
      console.error("Booking not found or access denied:", error);
      return {
        success: false,
        error: "Booking not found or access denied",
      };
    }
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return {
      success: false,
      error: "An error occurred while cancelling the booking",
    };
  }
}
