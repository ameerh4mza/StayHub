import Image from "next/image";
import Link from "next/link";
import { Room } from "@/types/room";

export default function RoomCard({ room }: { room: Room }) {
  return (
    <div className="w-full max-w-sm mx-auto bg-card border border-border rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.03]">
      <div className="relative w-full aspect-video">
        <Image
          src={
            room.image?.replace("/upload/", "/upload/f_auto,q_auto,w_800/") ||
            "/placeholder-room.jpg"
          }
          sizes="(max-width: 640px) 100vw, 33vw"
          alt={room.name}
          fill
          className="object-cover"
        />

        <div className="absolute top-3 left-3 bg-primary text-primary-foreground font-extrabold px-3 py-1 rounded-full text-sm shadow-md">
          ${room.price_per_hour}
          <span className="text-xs font-medium ml-1">/hr</span>
        </div>
      </div>

      <div className="p-4 space-y-3 h-[200px] flex flex-col justify-between">
        <div className="space-y-1">
          {" "}
          {/* Reduced inner spacing from space-y-2 to space-y-1 */}
          <h2 className="text-xl font-extrabold text-foreground truncate">
            {room.name}
          </h2>
          <p className="text-sm text-muted line-clamp-2">
            <span className="font-semibold text-primary">Address:</span>{" "}
            {room.address}
          </p>
          <p className="text-sm text-muted">
            <span className="font-semibold text-primary">Available: </span>
            {room.availability}
          </p>
        </div>

        <div className="border-t border-border pt-3 flex items-center justify-end">
          <Link
            href={`/rooms/${room.$id}`}
            className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-2 rounded-lg text-base font-semibold transition-all duration-300 shadow-md hover:bg-primary/80 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
