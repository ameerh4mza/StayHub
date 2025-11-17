import { requireRole } from "@/app/actions/getCurrentUserRole";
import { createAdminClient } from "@/config/appwrite";
import { Query } from "node-appwrite";
import { BookingWithRoom } from "@/types/booking";
import AdminBookingCard from "@/components/AdminBookingCard";

export default async function AdminBookingsPage() {
  await requireRole(["admin"]);

  const { databases } = createAdminClient();

  const { documents: bookings } = await databases.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_ID!,
    process.env.NEXT_APPWRITE_BOOKINGS_COLLECTION_ID!,
    [Query.orderDesc("$createdAt")]
  );

  const enrichedBookings = await Promise.all(
    bookings.map(async (booking) => {
      try {
        const room = await databases.getDocument(
          process.env.NEXT_APPWRITE_DATABASE_ID!,
          process.env.NEXT_APPWRITE_ROOMS_COLLECTION_ID!,
          booking.room_id
        );

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

  const pendingBookings = enrichedBookings.filter(
    (b) => b.status === "pending"
  );
  const confirmedBookings = enrichedBookings.filter(
    (b) => b.status === "confirmed"
  );
  const cancelledBookings = enrichedBookings.filter(
    (b) => b.status === "cancelled_by_user" || b.status === "cancelled_by_admin"
  );

  return (
    <div className="min-h-screen  py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground text-center mb-8">
          Admin - All Bookings Overview
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <h3 className="text-2xl font-bold text-primary">
              {enrichedBookings.length}
            </h3>
            <p className="text-muted">Total Bookings</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <h3 className="text-2xl font-bold text-yellow-600">
              {pendingBookings.length}
            </h3>
            <p className="text-muted">Pending</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <h3 className="text-2xl font-bold text-green-600">
              {confirmedBookings.length}
            </h3>
            <p className="text-muted">Confirmed</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <h3 className="text-2xl font-bold text-red-600">
              {cancelledBookings.length}
            </h3>
            <p className="text-muted">Cancelled</p>
          </div>
        </div>

        {enrichedBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted mb-4">No bookings found</p>
            <p className="text-muted">All system bookings will appear here.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {pendingBookings.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Pending Bookings ({pendingBookings.length})
                </h2>
                <div className="grid gap-6">
                  {pendingBookings.map((booking) => (
                    <AdminBookingCard key={booking.$id} booking={booking} />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                All Bookings
              </h2>
              <div className="grid gap-6">
                {enrichedBookings.map((booking) => (
                  <AdminBookingCard key={booking.$id} booking={booking} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
