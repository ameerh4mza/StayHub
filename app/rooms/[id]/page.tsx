import Image from "next/image";
import BookingForm from "@/components/BookingForm";
import getSingleRoom from "@/app/actions/getSingleRoom";
import ContactForm from "@/components/ContactForm";

export default async function RoomPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const room = await getSingleRoom(id);
  return room ? (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto bg-card border border-border rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8">
        <h1 className="text-3xl font-bold text-foreground text-center mb-8">
          {room.name}
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <Image
            src={
              room.image?.replace("/upload/", "/upload/f_auto,q_auto,w_800/") ||
              "/placeholder-room.jpg"
            }
            alt={room.name}
            className="rounded-xl object-cover w-full md:w-1/2 h-72 md:h-96"
            width={600}
            height={400}
            sizes="100"
          />

          <div className="flex-1 space-y-4">
            <p className="text-lg text-foreground font-semibold">
              {room.description}
            </p>
            <p>
              <span className="font-semibold text-foreground">Address:</span>{" "}
              {room.address}
            </p>
            <p>
              <span className="font-semibold text-foreground">Location:</span>{" "}
              {room.location}
            </p>
            <p>
              <span className="font-semibold text-foreground">
                Availability:
              </span>{" "}
              {room.availability}
            </p>
            <p className="text-primary font-bold text-xl">
              ${room.price_per_hour}{" "}
              <span className="text-muted font-medium text-base">/ hour</span>
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Book this Room
          </h2>
          <BookingForm room={room} />
        </div>
        <div className="mt-10 border-t border-border pt-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Contact Us / Ask a Query
          </h2>
          <ContactForm />
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center text-foreground">Rooms not found.</div>
  );
}
