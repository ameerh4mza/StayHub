import getAllBookings from "@/app/actions/getAllBookings";
import BookingRoomCard from "@/components/BookingRoomCard";

export default async function BookingsPage() {
  const bookings = await getAllBookings();
  
  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-foreground text-center mt-8 mb-8">
        My Bookings
      </h1>

     <BookingRoomCard bookings={bookings} />
    </div>
    );
}
