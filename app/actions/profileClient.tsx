"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { toast } from "react-hot-toast";
import SignOutModal from "@/components/SignOutModal";
import Loader from "@/components/Loader";

interface ProfileClientProps {
  user: {
    $id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const [preview, setPreview] = useState<string | null>(user.image || null);
  const [isUploading, setIsUploading] = useState(false);

  const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

  if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
    throw new Error("Cloudinary environment variables are not set");
  }

  // handle image upload
  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

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
        toast.dismiss();
        toast.success("Image uploaded successfully!");

        // Save new image URL to Appwrite user profile
        const updateRes = await fetch("/api/update-profile-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.$id,
            imageUrl: data.secure_url,
          }),
        });

        if (!updateRes.ok) throw new Error("Failed to update profile image");

        setPreview(data.secure_url);
      } else {
        throw new Error("Cloudinary upload failed");
      }
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      toast.dismiss();
      toast.error("Image upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
          My Profile
        </h1>

        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-8 relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary mb-4">
              {preview ? (
                <Image
                  src={preview}
                  alt="Profile picture"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <User className="w-16 h-16 text-foreground" />
                </div>
              )}
            </div>

            <label
              htmlFor="profilePic"
              className={`text-sm font-medium text-primary cursor-pointer ${
                isUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isUploading ? <Loader /> : "Change Profile Picture"}
            </label>
            <input
              id="profilePic"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={isUploading}
            />
          </div>

          {/* User Information */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Name
              </label>
              <div className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground">
                {user.name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email
              </label>
              <div className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground">
                {user.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                User ID
              </label>
              <div className="w-full px-4 py-3 border border-border rounded-lg bg-background text-muted text-sm font-mono">
                {user.$id}
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="mt-8 flex justify-center">
            <SignOutModal />
          </div>
        </div>
      </div>
    </div>
  );
}
