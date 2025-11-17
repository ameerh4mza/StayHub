"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import cancelBooking from "@/app/actions/cancelBooking";
import Loader from "./Loader";

export default function CancelBookingButton({
  bookingId,
}: {
  bookingId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const deleteBooking = () => {
    startTransition(async () => {
      try {
        const result = await cancelBooking(bookingId);
        if (result.success) {
          toast.success("Booking cancelled successfully");
          router.refresh();
        } else {
          toast.error(result.error || "Failed to cancel booking");
        }
      } catch (error) {
        console.error("Error cancelling booking:", error);
        toast.error("Failed to cancel booking");
      }
    });
  };

  return (
    <div className=" justify-end gap-3">
      <button
        onClick={deleteBooking}
        disabled={isPending}
        className="flex text-white bg-red-500 px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-300
            hover:translate-y-px transition-all disabled:opacity-50"
      >
        {isPending ? <Loader /> : "Cancel Booking"}
      </button>
    </div>
  );
}
