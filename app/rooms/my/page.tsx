import getMyRooms from "@/app/actions/getMyRooms";
import UserRoomCard from "@/components/UserRoomCard";
import { getCurrentUserRole } from "@/app/actions/getCurrentUserRole";
import { getUser } from "@/app/actions/getUser";
import { getUsersInfo, UserInfo } from "@/lib/getUserInfo";
import { createAdminClient } from "@/config/appwrite";

export default async function MyRoomsPage() {
  const rooms = await getMyRooms();
  const userRole = await getCurrentUserRole();
  const currentUser = await getUser();
  
  // Get creator information for admin view
  let creatorsInfo: Map<string, UserInfo> = new Map();
  const adminManagerIds: string[] = [];
  
  if (userRole === "admin" && rooms.length > 0) {
    // Get all unique user IDs from the rooms
    const uniqueUserIds = [...new Set(rooms.map(room => room.user_id))];
    
    // Get creator info for all rooms
    creatorsInfo = await getUsersInfo(uniqueUserIds);
    
    // Get admin and manager IDs to determine roles
    const { teams } = createAdminClient();
    
    try {
      const teamList = await teams.list();
      
      // Get admin team members
      const adminTeam = teamList.teams.find(team => team.name === "Admins");
      if (adminTeam) {
        const adminMemberships = await teams.listMemberships(adminTeam.$id);
        adminManagerIds.push(...adminMemberships.memberships.map(m => m.userId));
      }
      
      // Get manager team members
      const managerTeam = teamList.teams.find(team => team.name === "Managers");
      if (managerTeam) {
        const managerMemberships = await teams.listMemberships(managerTeam.$id);
        adminManagerIds.push(...managerMemberships.memberships.map(m => m.userId));
      }
    } catch (error) {
      console.error("Error fetching team information:", error);
    }
  }
  
  // Dynamic title based on user role
  const getPageTitle = () => {
    switch (userRole) {
      case "admin":
        return "Admin & Manager Rooms";
      case "manager":
        return "My Rooms";
      default:
        return "My Rooms";
    }
  };

  // Dynamic empty message based on user role
  const getEmptyMessage = () => {
    switch (userRole) {
      case "admin":
        return "No rooms created by admins or managers";
      case "manager":
        return "You haven't created any rooms yet";
      default:
        return "You haven't created any rooms yet";
    }
  };

  const getUserRole = (userId: string): 'admin' | 'manager' | 'user' => {
    if (adminManagerIds.includes(userId)) {
      return 'manager';
    }
    return 'user';
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-foreground text-center mt-8 mb-8">
        {getPageTitle()}
      </h1>
      {rooms.length === 0 ? (
        <p className="text-center text-muted mt-8">{getEmptyMessage()}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 place-items-center px-8 mb-12">
          {rooms.map((room) => {
            const creatorInfo = creatorsInfo.get(room.user_id);
            const creatorRole = getUserRole(room.user_id);
            
            return (
              <UserRoomCard 
                key={room.$id} 
                room={room}
                showCreatorInfo={userRole === "admin"}
                currentUserId={currentUser.user?.$id}
                creatorInfo={creatorInfo ? {
                  name: creatorInfo.name,
                  role: creatorRole
                } : undefined}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
