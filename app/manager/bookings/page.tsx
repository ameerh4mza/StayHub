import { requireRole } from "@/app/actions/getCurrentUserRole";
import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";
import { BookingWithRoom } from "@/types/booking";
import ManagerBookingCard from "@/components/ManagerBookingCard";
import { createAdminClient } from "@/config/appwrite";

export default async function ManagerBookingsPage() {
  // Require manager or admin role
  await requireRole(["manager", "admin"]);

  const sessionCookie = await cookies();
  const request = new Request("http://localhost", {
    headers: {
      cookie: sessionCookie.toString(),
    },
  });

  const { databases } = createSessionClient(request);

  // Fetch all bookings (managers can see all)
  const { documents: bookings } = await databases.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_ID!,
    process.env.NEXT_APPWRITE_BOOKINGS_COLLECTION_ID!,
    [Query.orderDesc("$createdAt")]
  );

  // Enrich bookings with room details and user information
  const enrichedBookings = await Promise.all(
    bookings.map(async (booking) => {
      try {
        const room = await databases.getDocument(
          process.env.NEXT_APPWRITE_DATABASE_ID!,
          process.env.NEXT_APPWRITE_ROOMS_COLLECTION_ID!,
          booking.room_id
        );

        // Get real user information using Appwrite Users API
        const { users } = createAdminClient();
        let userName = "Unknown User";
        let userEmail = "Not available";

        try {
          const user = await users.get(booking.user_id);
          userName = user.name || "Unknown User";
          userEmail = user.email || "No email provided";
        } catch (userError) {
          console.error(`Error fetching user ${booking.user_id}:`, userError);
        }

        return {
          ...booking,
          name: room.name,
          address: room.address,
          location: room.location || "",
          price_per_hour: room.price_per_hour,
          image: room.image || "",
          user_name: userName,
          user_email: userEmail,
        } as unknown as BookingWithRoom;
      } catch (error) {
        console.error(`Error enriching booking ${booking.$id}:`, error);
        return {
          ...booking,
          name: "Room not found",
          address: "N/A",
          location: "",
          price_per_hour: 0,
          image: "",
          user_name: `User ${booking.user_id.slice(-8)}`,
          user_email: "Not available",
        } as unknown as BookingWithRoom;
      }
    })
  );

  return (
    <div className="min-h-screen  py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground text-center mb-8">
          Manage All Bookings
        </h1>

        {enrichedBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted mb-4">No bookings found</p>
            <p className="text-muted">
              All customer bookings will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {enrichedBookings.map((booking) => (
              <ManagerBookingCard key={booking.$id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
