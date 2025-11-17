import Image from "next/image";
import { BookingWithRoom } from "@/types/booking";
import Link from "next/link";
import CancelBookingButton from "./CancelBookingButton";

export default function BookingRoomCard({
  bookings,
}: {
  bookings: BookingWithRoom[];
}) {
  const activeBookings = bookings.filter(
    (booking) =>
      booking.status !== "cancelled_by_user" &&
      booking.status !== "cancelled_by_admin"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "PENDING APPROVAL";
      case "confirmed":
        return "CONFIRMED";
      case "rejected":
        return "REJECTED";
      default:
        return "UNKNOWN";
    }
  };

  return (
    <div className="relative">
      {activeBookings.length === 0 ? (
        <p className="text-center text-muted">You have no active bookings.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 place-items-center px-8 mb-12">
          {activeBookings.map((booking) => (
            <div
              key={booking.$id}
              className="bg-card border border-border rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 w-110 h-[500px] flex flex-col"
            >
              {booking.image && (
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={booking.image}
                    alt={booking.name}
                    fill
                    sizes="100"
                    className="object-cover"
                  />
                </div>
              )}

              <h2 className="text-2xl font-semibold text-foreground mb-2 truncate">
                {booking.name}
              </h2>

              <div className="mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    booking.status || "pending"
                  )}`}
                >
                  {getStatusLabel(booking.status || "pending")}
                </span>
              </div>

              <div className="flex-1 overflow-hidden">
                <p className="text-foreground mb-1 truncate">
                  <span className="font-semibold">Address:</span>{" "}
                  {booking.address}
                </p>
                {booking.location && (
                  <p className="text-foreground mb-1 truncate">
                    <span className="font-semibold">Location:</span>{" "}
                    {booking.location}
                  </p>
                )}
                <p className="text-foreground mb-1">
                  <span className="font-semibold">Check In:</span>{" "}
                  {new Date(booking.check_in).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
                <p className="text-foreground mb-1">
                  <span className="font-semibold">Check Out:</span>{" "}
                  {new Date(booking.check_out).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>

              <p className="text-primary font-bold text-xl mt-2">
                ${booking.price_per_hour}{" "}
                <span className="text-muted font-medium text-base">/ hour</span>
              </p>

              <div className="flex gap-3 mt-4 justify-end">
                <Link href={`/rooms/${booking.room_id}`}>
                  <button className="flex-1 bg-primary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary-light hover:-translate-y-px transition-all">
                    View
                  </button>
                </Link>

                {(booking.status === "pending" || !booking.status) && (
                  <CancelBookingButton bookingId={booking.$id} />
                )}

                {booking.status === "confirmed" && (
                  <div className="flex-1 text-center py-2 px-3 bg-green-50 text-green-700 rounded-md text-sm font-medium">
                    Enjoy your booking!
                  </div>
                )}

                {booking.status === "rejected" && (
                  <div className="flex-1 text-center py-2 px-3 bg-red-50 text-red-700 rounded-md text-sm font-medium">
                    Booking rejected
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
