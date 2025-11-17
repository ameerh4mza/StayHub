"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";
import { redirect } from "next/navigation";
import { BookingWithRoom } from "@/types/booking";

export default async function getAllBookings(): Promise<BookingWithRoom[]> {
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
    const userId = user.$id;

    const { documents: bookings } = await databases.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_ID!,
      process.env.NEXT_APPWRITE_BOOKINGS_COLLECTION_ID!,
      [Query.equal("user_id", userId)]
    );

    const bookingsWithRoomDetails = await Promise.all(
      bookings.map(async (booking) => {
        try {
          const room = await databases.getDocument(
            process.env.NEXT_APPWRITE_DATABASE_ID!,
            process.env.NEXT_APPWRITE_ROOMS_COLLECTION_ID!,
            booking.room_id
          );

          return {
            ...booking,
            room: room,
            name: room.name as string,
            address: room.address as string,
            location: (room.location as string) || "",
            price_per_hour: room.price_per_hour as number,
            image: (room.image as string) || "",
          } as unknown as BookingWithRoom;
        } catch (error) {
          console.error(`Error fetching room ${booking.room_id}:`, error);
          return {
            ...booking,
            name: "Room not found",
            address: "N/A",
            location: "N/A",
            price_per_hour: 0,
            image: "",
          } as unknown as BookingWithRoom;
        }
      })
    );

    return bookingsWithRoomDetails;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}
