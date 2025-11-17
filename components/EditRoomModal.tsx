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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
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
    }
  }, [open]); // eslint-disable-line

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Starting image upload...");
    console.log(
      "Cloudinary preset:",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
    );
    console.log(
      "Cloudinary cloud name:",
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    );

    setIsUploading(true);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
    );

    try {
      toast.loading("Uploading image...");

      console.log("Making request to Cloudinary...");
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Cloudinary error response:", errorText);
        throw new Error(`Upload failed: ${res.status}`);
      }

      const data = await res.json();
      console.log("Cloudinary response:", data);

      if (data.secure_url) {
        setValue("image", data.secure_url);
        URL.revokeObjectURL(previewUrl);
        setPreview(data.secure_url);
        toast.dismiss();
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("No secure_url in response");
      }
    } catch (err) {
      console.error("Upload error:", err);
      URL.revokeObjectURL(previewUrl);
      setPreview(room.image || null);
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

      const payload = {
        ...room,
        ...formData,
      } as Room;

      const result = await editRoom(room.$id, payload);

      toast.dismiss();

      if (result.success) {
        toast.success("Room updated successfully!");
        onClose();
        onUpdate?.();
      } else {
        toast.error("Failed to update room");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred while updating the room");
      console.error("Edit room error:", error);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-card w-full max-w-2xl rounded-xl shadow-lg p-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold z-10"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Edit Room
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Room Name</label>
              <input
                {...register("name")}
                className="w-full border px-3 py-2 rounded-md bg-background"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Address</label>
              <input
                {...register("address")}
                className="w-full border px-3 py-2 rounded-md bg-background"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Availability</label>
              <input
                {...register("availability")}
                className="w-full border px-3 py-2 rounded-md bg-background"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Price per Hour</label>
              <input
                {...register("price_per_hour", { valueAsNumber: true })}
                className="w-full border px-3 py-2 rounded-md bg-background"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Location</label>
              <input
                {...register("location")}
                className="w-full border px-3 py-2 rounded-md bg-background"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Capacity</label>
              <input
                {...register("capacity", { valueAsNumber: true })}
                className="w-full border px-3 py-2 rounded-md bg-background"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full border px-3 py-2 rounded-md bg-background"
            />
          </div>

          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <label
              htmlFor="image"
              className="cursor-pointer text-sm text-muted-foreground"
            >
              Click to upload image
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
                  width={120}
                  height={120}
                  sizes="100"
                  className="rounded-md object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white px-5 py-2 rounded-md hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
