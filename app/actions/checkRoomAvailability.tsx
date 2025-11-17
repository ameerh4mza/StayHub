"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";
import { BookingWithRoom } from "@/types/booking";
import { redirect } from "next/navigation";
import { DateTime } from "luxon";

function toUTCDateTime(dateStr: string): DateTime {
  return DateTime.fromISO(dateStr, { zone: "utc" }).toUTC();
}

function doDateRangesOverlap(
  start1: DateTime,
  end1: DateTime,
  start2: DateTime,
  end2: DateTime
): boolean {
  return start1 < end2 && end1 > start2;
}
export default async function checkRoomAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string
) {
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
      redirect("/auth/login");
    }

    const checkInDate = toUTCDateTime(checkIn);
    const checkOutDate = toUTCDateTime(checkOut);

    const { documents: bookings } =
      await databases.listDocuments<BookingWithRoom>(
        process.env.NEXT_APPWRITE_DATABASE_ID!,
        process.env.NEXT_APPWRITE_BOOKINGS_COLLECTION_ID!,
        [Query.equal("room_id", roomId)]
      );

    for (const booking of bookings) {
      const bookingCheckIn = toUTCDateTime(booking.check_in);
      const bookingCheckOut = toUTCDateTime(booking.check_out);

      if (
        doDateRangesOverlap(
          checkInDate,
          checkOutDate,
          bookingCheckIn,
          bookingCheckOut
        )
      ) {
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error("Error checking room availability:", error);
    return false;
  }
}
