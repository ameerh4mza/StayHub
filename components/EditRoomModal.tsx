"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import Image from "next/image";
import editRoom from "@/app/actions/editRoom";
import { Room } from "@/types/room";
import Loader from "./Loader";

type FormData = {
  name: string;
  description: string;
  address: string;
  availability: string;
  price_per_hour: number;
  image?: string;
  location?: string;
  sqft?: number;
  capacity?: number;
  amenities?: string;
};

const schema = z.object({
  name: z.string().min(1, "Room name is required"),
  description: z.string().min(1, "Description is required"),
  address: z.string().min(1, "Address is required"),
  availability: z.string().min(1, "Please specify availability"),
  price_per_hour: z.number().min(1, "Price per hour must be at least 1$"),
  image: z.string().optional(),
  location: z.string().optional(),
  sqft: z.number().optional(),
  capacity: z.number().optional(),
  amenities: z.string().optional(),
});

export default function EditRoomModal({
  room,
  open,
  onClose,
  onUpdate,
}: {
  room: Room;
  open: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [visible, setVisible] = useState(open); // For smooth animation

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      availability: "",
      price_per_hour: 0,
      image: "",
      location: "",
      sqft: 0,
      capacity: 0,
      amenities: "",
    },
  });

  // Sync form values when modal opens
  useEffect(() => {
    if (open && room) {
      setValue("name", room.name);
      setValue("description", room.description || "");
      setValue("address", room.address);
      setValue("availability", room.availability);
      setValue("price_per_hour", room.price_per_hour);
      setValue("image", room.image || "");
      setValue("location", room.location || "");
      setValue("sqft", room.sqft || 0);
      setValue("capacity", room.capacity || 0);
      setValue("amenities", room.amenities || "");
      setPreview(room.image || null);
      setVisible(true); // Show modal for animation
    } else if (!open) {
      // Animate close
      setVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

    try {
      toast.loading("Uploading image...");
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        setValue("image", data.secure_url);
        toast.dismiss();
        toast.success("Image uploaded successfully!");
      } else throw new Error("Cloudinary upload failed");
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Image upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  const onSubmit = async (formData: FormData) => {
    try {
      toast.loading("Updating room...");
      const payload = { ...room, ...formData } as Room;
      const result = await editRoom(room.$id, payload);
      toast.dismiss();

      if (result.success) {
        toast.success("Room updated successfully!");
        onClose();
        onUpdate?.();
      } else toast.error("Failed to update room");
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred while updating the room");
      console.error("Edit room error:", error);
    }
  };

  const modalContent = (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-card w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
          visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold z-10 transition"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold mb-6 text-primary text-center">
          Edit Room
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Room Name", field: "name" },
              { label: "Address", field: "address" },
              { label: "Availability", field: "availability" },
              { label: "Price per Hour", field: "price_per_hour", type: "number" },
              { label: "Location", field: "location" },
              { label: "Capacity", field: "capacity", type: "number" },
            ].map((item) => (
              <div key={item.field}>
                <label className="text-sm font-medium mb-1 block">{item.label}</label>
                <input
                  type={item.type || "text"}
                  {...register(item.field as keyof FormData, item.type === "number" ? { valueAsNumber: true } : {})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition shadow-sm"
                />
                {errors[item.field as keyof FormData] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[item.field as keyof FormData]?.message as string}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition shadow-sm resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-accent transition relative">
            <label htmlFor="image" className="cursor-pointer text-sm text-muted-foreground">
              {isUploading ? "Uploading..." : "Click to upload image"}
              <input
                type="file"
                id="image"
                className="hidden"
                disabled={isUploading}
                accept="image/*"
                {...register("image")}
                onChange={handleImageChange}
              />
            </label>
            {preview && (
              <div className="mt-3 flex justify-center">
                <Image
                  src={preview}
                  alt="Preview"
                  width={150}
                  height={150}
                  sizes="100"
                  className="rounded-lg object-cover shadow-md"
                  unoptimized
                />
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? <Loader /> : "Update Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
