import getAllRooms from './actions/getAllRooms';
import RoomCard from '@/components/RoomCard';

export default async function Home() {
  const rooms = await getAllRooms();

  return (
    <div className="min-h-screen">
      <h1 className='text-3xl font-bold text-foreground text-center mt-8 mb-8'>Available Rooms</h1>
      {rooms.length === 0 ? (
        <p>No rooms available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 place-items-center px-8 mb-12">
          {rooms.map((room) => (
            <RoomCard key={room.$id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}