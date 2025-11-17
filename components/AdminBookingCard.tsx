"use client";

import { useState } from "react";
import Image from "next/image";
import { BookingWithRoom } from "@/types/booking";
import { updateBookingStatus } from "@/app/actions/manageBookings";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  cancelled_by_user: "bg-blue-100 text-blue-800 border-blue-200",
  cancelled_by_admin: "bg-red-100 text-red-800 border-red-200",
  rejected: "bg-gray-100 text-gray-800 border-gray-200",
};

const statusLabels = {
  pending: "PENDING",
  confirmed: "CONFIRMED",
  cancelled_by_user: "CANCELLED BY USER",
  cancelled_by_admin: "CANCELLED BY ADMIN",
  rejected: "REJECTED",
};

export default function AdminBookingCard({
  booking,
}: {
  booking: BookingWithRoom;
}) {
  const [currentStatus, setCurrentStatus] = useState(
    booking.status || "pending"
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleStatusUpdate = async (
    newStatus: "confirmed" | "rejected" | "cancelled_by_admin"
  ) => {
    setIsUpdating(true);

    try {
      const result = await updateBookingStatus(booking.$id, newStatus);

      if (result.success) {
        setCurrentStatus(newStatus);
        toast.success(`Booking ${newStatus} successfully`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update booking");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("An error occurred while updating the booking");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex flex-col xl:flex-row gap-6">
        {booking.image && (
          <div className="relative w-full xl:w-64 h-48 rounded-lg overflow-hidden shrink-0">
            <Image
              src={booking.image}
              alt={booking.name}
              fill
              className="object-cover"
              sizes="100"
            />
          </div>
        )}

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h3 className="text-xl font-semibold text-foreground">
              {booking.name}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                statusColors[currentStatus as keyof typeof statusColors]
              }`}
            >
              {statusLabels[currentStatus as keyof typeof statusLabels]}
            </span>
          </div>

          <div className="bg-muted/30 rounded-lg p-3 mb-3">
            <h4 className="font-semibold text-foreground mb-2">
              Customer Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p className="text-muted">
                <span className="font-semibold text-foreground">Name:</span>{" "}
                {booking.user_name || "N/A"}
              </p>
              <p className="text-muted">
                <span className="font-semibold text-foreground">Email:</span>{" "}
                {booking.user_email || "N/A"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <p className="text-muted">
              <span className="font-semibold text-foreground">Address:</span>{" "}
              {booking.address}
            </p>
            {booking.location && (
              <p className="text-muted">
                <span className="font-semibold text-foreground">Location:</span>{" "}
                {booking.location}
              </p>
            )}
            <p className="text-muted">
              <span className="font-semibold text-foreground">Check-in:</span>{" "}
              {new Date(booking.check_in).toLocaleString()}
            </p>
            <p className="text-muted">
              <span className="font-semibold text-foreground">Check-out:</span>{" "}
              {new Date(booking.check_out).toLocaleString()}
            </p>
            <p className="text-muted">
              <span className="font-semibold text-foreground">Created:</span>{" "}
              {new Date(booking.$createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="pt-2">
            <p className="text-lg font-bold text-primary">
              ${booking.price_per_hour}/hour
            </p>
          </div>
        </div>

        <div className="flex flex-row xl:flex-col gap-3 xl:min-w-[180px]">
          {currentStatus === "pending" && (
            <>
              <button
                onClick={() => handleStatusUpdate("confirmed")}
                disabled={isUpdating}
                className="flex-1 xl:flex-none bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => handleStatusUpdate("rejected")}
                disabled={isUpdating}
                className="flex-1 xl:flex-none bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                Reject
              </button>
            </>
          )}

          {currentStatus === "confirmed" && (
            <button
              onClick={() => handleStatusUpdate("cancelled_by_admin")}
              disabled={isUpdating}
              className="flex-1 xl:flex-none bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Cancel
            </button>
          )}

          {currentStatus === "rejected" && (
            <div className="flex-1 xl:flex-none text-center py-3 px-4 bg-red-50 text-red-700 rounded-lg font-medium">
              ✗ Rejected
            </div>
          )}

          {currentStatus === "cancelled_by_user" && (
            <div className="flex-1 xl:flex-none text-center py-3 px-4 bg-blue-50 text-blue-700 rounded-lg font-medium">
              Cancelled by User
            </div>
          )}

          {currentStatus === "cancelled_by_admin" && (
            <div className="flex-1 xl:flex-none text-center py-3 px-4 bg-red-50 text-red-700 rounded-lg font-medium">
              Cancelled by Admin
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
