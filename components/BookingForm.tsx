"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import bookRoom from "@/app/actions/bookRoom";
import { Room } from "@/types/room";
import toast from "react-hot-toast";

type BookingData = {
  checkIn: string;
  checkOut: string;
  room_id: string;
};

const schema = z.object({
  checkIn: z.string().min(1, "Check-in time is required"),
  checkOut: z.string().min(1, "Check-out time is required"),
  room_id: z.string().min(1),
});

export default function BookingForm({ room }: { room: Room }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: BookingData) => {
    const roomBooking = await bookRoom({ data });
    if (roomBooking.success) {
      toast.success("Room booked successfully!");
    } else {
      toast.error(
        (roomBooking as { error?: string }).error || "Failed to book room."
      );
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <input type="hidden" {...register("room_id")} value={room.$id} />

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Check-in Time
          </label>
          <input
            type="datetime-local"
            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition"
            {...register("checkIn")}
          />
          {errors.checkIn && (
            <p className="text-red-500 text-sm mt-1">
              {errors.checkIn.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Check-out Time
          </label>
          <input
            type="datetime-local"
            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition"
            {...register("checkOut")}
          />
          {errors.checkOut && (
            <p className="text-red-500 text-sm mt-1">
              {errors.checkOut.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-primary text-white px-8 py-3 rounded-lg cursor-pointer font-semibold hover:bg-primary-light hover:scale-105 transition-all duration-300"
          >
            Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
}
