"use client";

import { useTransition } from "react";
import { toast } from "react-hot-toast";
import deleteRoom from "@/app/actions/deleteRoom";
import Loader from "./Loader";

export default function DeleteButton({ roomId }: { roomId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteRoom(roomId);
        toast.success("Room deleted successfully");
      } catch (error) {
        console.error("Error deleting room:", error);
        toast.error("Failed to delete room");
      }
    });
  };

  return (
    <div className="flex justify-end gap-3 mt-4">
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-red-600 border border-red-500 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-red-50 transition-all disabled:opacity-50"
      >
        {isPending ? <Loader /> : "Delete"}
      </button>
    </div>
  );
}
