"use client";

import { Room } from "@/types/room";
import Image from "next/image";
import DeleteButton from "./DeleteButton";
import EditRoomModal from "./EditRoomModal";
import { useState, useEffect } from "react";
import { EyeIcon } from "lucide-react";
import Link from "next/link";

interface UserRoomCardProps {
  room: Room;
  showCreatorInfo?: boolean;
  currentUserId?: string;
  creatorInfo?: {
    name: string;
    role: "admin" | "manager" | "user";
  };
}

export default function UserRoomCard({
  room,
  showCreatorInfo = false,
  currentUserId,
  creatorInfo,
}: UserRoomCardProps) {
  const [isEditOpen, setEditOpen] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "manager" | "user">(
    "user"
  );

  useEffect(() => {
    async function getUserRole() {
      try {
        const res = await fetch("/api/user-role", { cache: "no-store" });
        const data = await res.json();
        setUserRole(data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    }
    getUserRole();
  }, []);

  const isOwnRoom = currentUserId === room.user_id;

  const getOwnershipBadge = () => {
    return (
      <span className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-2 py-1 rounded-md shadow-md">
        Your Room ({userRole})
      </span>
    );
  };

  return (
    <div className="relative max-w-md w-full bg-card border border-border rounded-xl overflow-hidden shadow-md hover:shadow-primary/20 transition-transform hover:scale-[1.01]">
      <div className="relative w-full aspect-4/3">
        <Image
          src={
            room.image?.replace("/upload/", "/upload/f_auto,q_auto,w_800/") ||
            "/placeholder-room.jpg"
          }
          alt={room.name}
          fill
          sizes="100"
          className="object-cover"
        />
      </div>

      <div className="p-4 flex flex-col justify-between min-h-60">
        <div>
          <h2 className="text-lg font-semibold text-foreground truncate">
            {room.name}
          </h2>
          <p className="text-sm text-muted mt-1 truncate">{room.address}</p>
          <p className="text-sm text-muted mt-1">
            Availability:{" "}
            <span className="font-medium">{room.availability}</span>
          </p>
          <p className="text-md font-bold text-primary mt-1">
            ${room.price_per_hour}{" "}
            <span className="text-xs font-normal text-gray-500">/hr</span>
          </p>

          {showCreatorInfo && creatorInfo && !isOwnRoom && (
            <p className="text-xs text-muted mt-2">
              Created by:{" "}
              <span className="font-medium">{creatorInfo.name}</span>
              <span
                className={`ml-1 px-1 py-0.5 rounded text-xs text-white ${
                  creatorInfo.role === "admin"
                    ? "bg-red-500"
                    : creatorInfo.role === "manager"
                    ? "bg-blue-500"
                    : "bg-green-500"
                }`}
              >
                {creatorInfo.role}
              </span>
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setEditOpen(true)}
            className="flex mt-4 text-blue-600 border border-blue-500 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-50 transition-all"
          >
            Edit
          </button>
          <DeleteButton roomId={room.$id} />
        </div>
      </div>

      {getOwnershipBadge()}

      <div className="absolute top-3 right-3">
        <Link href={`/rooms/${room.$id}`}>
          <EyeIcon className="bg-primary h-8 w-8 rounded-full p-2 text-white" />
        </Link>
      </div>

      <EditRoomModal
        room={room}
        open={isEditOpen}
        onClose={() => setEditOpen(false)}
        onUpdate={() => {
          setEditOpen(false);
          window.location.reload();
        }}
      />
    </div>
  );
}
