"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createRoom } from "../actions/createRooms";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image"; 
import Loader from "@/components/Loader";

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

export default function AddRoomPage() {

  const [isUploading, setIsUploading] = useState(false); 
  const [isCreating, setIsCreating] = useState(false);

  const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;
  if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
    throw new Error("Cloudinary environment variables are not set");
  }

  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setIsCreating(true);
    const result = await createRoom(data);
    if (result.success) {
      toast.success("Room created successfully");
      router.push("/");
    } else {
      toast.error("Failed to create room");
    }
    setIsCreating(false);
  }

  // Handle Image Upload to Cloudinary

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    //setting local url for preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Prepare form data for Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryUploadPreset!);

    try {
      toast.loading("Uploading image...");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        // Save permanent Cloudinary URL to the form
        setValue("image", data.secure_url);
        toast.dismiss();
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Cloudinary upload failed");
      }
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      toast.dismiss();
      toast.error("Image upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = ""; // Reset file input
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <h1 className="text-3xl font-bold text-foreground text-center mb-8">
        Add Room
      </h1>
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-5xl mx-auto bg-card border border-border rounded-2xl shadow-md p-10 md:p-12 space-y-8 transition-all duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Room Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Room Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter room name"
                {...register("name", { required: true })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  Room name is required
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                placeholder="Enter address"
                {...register("address", { required: true })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">Address is required</p>
              )}
            </div>

            {/* Availability */}
            <div>
              <label
                htmlFor="availability"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Availability <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="availability"
                placeholder="e.g., 9 AM - 6 PM"
                {...register("availability", { required: true })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              {errors.availability && (
                <p className="text-red-500 text-sm mt-1">
                  Availability is required
                </p>
              )}
            </div>

            {/* Price per Hour */}
            <div>
              <label
                htmlFor="price_per_hour"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Price per Hour <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price_per_hour"
                placeholder="Enter price per hour"
                {...register("price_per_hour", { valueAsNumber: true })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              {errors.price_per_hour && (
                <p className="text-red-500 text-sm mt-1">
                  Price per hour is required
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Location (Optional)
              </label>
              <input
                type="text"
                id="location"
                placeholder="Enter location"
                {...register("location")}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            {/* Square Footage */}
            <div>
              <label
                htmlFor="sqft"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Square Footage (Optional)
              </label>
              <input
                type="number"
                id="sqft"
                placeholder="Enter square footage"
                {...register("sqft", { valueAsNumber: true })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              {errors.sqft && (
                <p className="text-red-500 text-sm mt-1">
                  Square footage is required
                </p>
              )}
            </div>

            {/* Capacity */}
            <div>
              <label
                htmlFor="capacity"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Capacity (Optional)
              </label>
              <input
                type="number"
                id="capacity"
                placeholder="Enter capacity"
                {...register("capacity", { valueAsNumber: true })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            {/* Amenities */}
            <div>
              <label
                htmlFor="amenities"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Amenities (Optional)
              </label>
              <input
                type="text"
                id="amenities"
                placeholder="e.g., Wi-Fi, Projector, AC"
                {...register("amenities")}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              {errors.amenities && (
                <p className="text-red-500 text-sm mt-1">
                  Amenities are required
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Write a short description about the room..."
              {...register("description", { required: true })}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                Description is required
              </p>
            )}
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-all duration-300">
            <label
              htmlFor="image"
              className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <input
                type="file"
                id="image"
                accept="image/*"
                {...register("image")}
                className="hidden"
                disabled={isUploading || isCreating}
                onChange={handleImageChange}
              />
              {isUploading ? <Loader /> : "Click to upload room image"}
            </label>

            {preview && (
              <div className="mt-4 flex justify-center">
                <Image
                  src={preview}
                  alt="Preview"
                  sizes="100"
                  className="w-40 h-40 object-cover rounded-lg border"
                  unoptimized
                  width={600}
                  height={400}
                />
              </div>
            )}

            {errors.image && (
              <p className="text-red-500 text-sm mt-2">
                Please upload an image
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isCreating || isUploading}
            className="w-full md:w-auto min-w-[140px] bg-primary text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:bg-primary/90 hover:-translate-y-0.5 shadow-md hover:shadow-primary/30"
          >
            {isCreating ? (<Loader />) :
            isUploading ? <span className="flex items-center justify-center gap-2">
              Image Uploading <Loader />
            </span> :
            "Add Room"}
          </button>
        </form>
      </div>
    </div>
  );
}
