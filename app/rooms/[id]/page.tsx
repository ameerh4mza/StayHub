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
        {/* Room Header */}
        <h1 className="text-3xl font-bold text-foreground text-center mb-8">
          {room.name}
        </h1>

        {/* Room Info Section */}
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
            // unoptimized
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

        {/* Booking Form */}
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




// {/*  
//   import Image from "next/image";
// import BookingForm from "@/components/BookingForm";
// import getSingleRoom from "@/app/actions/getSingleRoom";
// import ContactForm from "@/components/ContactForm";
// import { MapPin, Users, Ruler, Clock, DollarSign, TextSelect, Home } from 'lucide-react'; 
// import type { ComponentType, SVGProps } from "react";


// const SpecificationItem = ({ icon: Icon, label, value }: { icon: ComponentType<SVGProps<SVGSVGElement>> , label: string, value: string | number | undefined }) => (
//   <div className="flex flex-col items-center space-y-2 p-4 bg-background border border-border rounded-lg shadow-md text-center">
//     <Icon className="w-6 h-6 text-primary shrink-0" />
//     <p className="text-sm font-medium text-muted-foreground">{label}</p>
//     <p className="text-xl font-bold text-foreground">{value || 'N/A'}</p>
//   </div>
// );

// // ------------------------------------------------------------------

// export default async function RoomPage({ params }: { params: { id: string } }) {
//   const { id } = await params;
//   const room = await getSingleRoom(id);

//   return room ? (
//     <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto space-y-12">
        
//         {/* Main Content Card */}
//         <div className="bg-card border border-border rounded-3xl shadow-2xl p-6 md:p-10 lg:p-12">
          
//           {/* Room Header */}
//           <div className="text-center mb-10">
//             <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-2 leading-tight">
//               {room.name}
//             </h1>
//             <p className="text-lg text-muted-foreground flex items-center justify-center space-x-2">
//               <MapPin className="w-5 h-5 text-primary" />
//               <span>{room.address}</span>
//             </p>
//           </div>

//           {/* Image & Key Details Section */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//             {/* Image */}
//             <div className="relative w-full aspect-video md:aspect-4/3 rounded-xl overflow-hidden shadow-xl">
//               <Image
//                 src={
//                   room.image?.replace("/upload/", "/upload/f_auto,q_auto,w_1200/") ||
//                   "/placeholder-room.jpg"
//                 }
//                 alt={room.name}
//                 fill
//                 className="object-cover"
//                 sizes="(max-width: 768px) 100vw, 50vw"
//               />
//             </div>

//             {/* Key Details & Price */}
//             <div className="flex-1 space-y-6">
              
//               {/* Description */}
//               <div>
//                 <h2 className="text-xl font-bold text-foreground mb-2 border-b border-border pb-1 flex items-center space-x-2">
//                   <TextSelect className="w-5 h-5 text-primary" />
//                   <span>Description</span>
//                 </h2>
//                 <p className="text-lg text-muted-foreground leading-relaxed">
//                   {room.description}
//                 </p>
//               </div>

//               {/* Price & Availability */}
//               <div className="p-4 bg-primary/10 rounded-lg flex justify-between items-center shadow-inner">
//                 <p className="text-xl font-bold text-primary flex items-center space-x-2">
//                   <DollarSign className="w-6 h-6" />
//                   <span>
//                     {room.availability === 'booked' ? 'Currently Booked' : `\$${room.price_per_hour}`}
//                     <span className="text-muted-foreground font-medium text-base ml-1">
//                       {room.availability !== 'booked' && '/ hour'}
//                     </span>
//                   </span>
//                 </p>
//                  <p className="text-sm text-foreground font-semibold flex items-center space-x-2">
//                   <Clock className="w-5 h-5 text-primary" />
//                   <span className="text-muted-foreground font-normal">Available:</span>
//                   <span>{room.availability}</span>
//                 </p>
//               </div>

//               {/* General Info List */}
//               <div className="space-y-3 text-base pt-2 border-t border-border">
//                 <p className="flex items-start space-x-2">
//                   <Home className="w-5 h-5 text-primary shrink-0 mt-0.5" />
//                   <span className="font-semibold text-foreground w-28 shrink-0">Property ID:</span>
//                   <span className="text-muted-foreground">{room.$id}</span>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* --- Specifications Section (Grid with Icons) --- */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             <SpecificationItem icon={Ruler} label="Area (Sq. Ft.)" value={room.sqft || 'N/A'} />
//             <SpecificationItem icon={Users} label="Capacity" value={room.capacity || 'N/A'} />
//             <SpecificationItem icon={TextSelect} label="Amenities" value={room.amenities ? 'View List' : 'Basic'} />
//             <SpecificationItem icon={MapPin} label="Location" value={room.location} />
//         </div>
        
//         {/* --- Booking Form Section --- */}
//         <div className="bg-card border border-border rounded-3xl shadow-xl p-8">
//           <h2 className="text-3xl font-bold text-primary mb-6 border-b border-border pb-3">
//             Book this Room
//           </h2>
//           <BookingForm room={room} />
//         </div>
        
//         {/* --- Contact Form Section --- */}
//         <div className="bg-card border border-border rounded-3xl shadow-xl p-8">
//           <h2 className="text-3xl font-bold text-primary mb-6 border-b border-border pb-3">
//             Contact Us / Ask a Query
//           </h2>
//           <ContactForm />
//         </div>
        
//       </div>
//     </div>
//   ) : (
//     <div className="text-center text-3xl font-bold text-foreground py-20">Room not found.</div>
//   );
// }
  
  
//   */}