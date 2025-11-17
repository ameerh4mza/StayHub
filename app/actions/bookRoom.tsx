"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import checkRoomAvailability from "./checkRoomAvailability";

type BookingData = {
  checkIn: string;
  checkOut: string;
  room_id: string;
};

export default async function bookRoom({ data }: { data: BookingData }) {
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
    const user = await account.get();

    if (!user) {
      return {
        success: false,
      };
    }
    const isAvailable = await checkRoomAvailability(
      data.room_id,
      data.checkIn,
      data.checkOut
    );

    if (!isAvailable) {
      return {
        error: "The room is not available for the selected dates.",
      };
    }

    const bookingData = {
      user_id: user.$id,
      room_id: data.room_id,
      check_in: data.checkIn,
      check_out: data.checkOut,
      status: "pending",
    };

    const newBooking = await databases.createDocument(
      process.env.NEXT_APPWRITE_DATABASE_ID!,
      process.env.NEXT_APPWRITE_BOOKINGS_COLLECTION_ID!,
      ID.unique(),
      bookingData
    );

    revalidatePath("/bookings", "layout");

    return {
      success: true,
      booking: newBooking,
    };
  } catch (error) {
    console.log("Error in booking room action:", error);
    return {
      error: "An error occurred while booking the room.",
    };
  }
}
