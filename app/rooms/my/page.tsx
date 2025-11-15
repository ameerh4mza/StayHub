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
  
  let creatorsInfo: Map<string, UserInfo> = new Map();
  const adminManagerIds: string[] = [];
  
  if (userRole === "admin" && rooms.length > 0) {
    const uniqueUserIds = [...new Set(rooms.map(room => room.user_id))];
    
    creatorsInfo = await getUsersInfo(uniqueUserIds);
    console.log("Fetched creators info:", creatorsInfo);
    
    const { teams } = createAdminClient();
    
    try {
      const teamList = await teams.list();
      
      const adminTeam = teamList.teams.find(team => team.name === "Admins");
      if (adminTeam) {
        const adminMemberships = await teams.listMemberships(adminTeam.$id);
        adminManagerIds.push(...adminMemberships.memberships.map(m => m.userId));
      }
      
      const managerTeam = teamList.teams.find(team => team.name === "Managers");
      if (managerTeam) {
        const managerMemberships = await teams.listMemberships(managerTeam.$id);
        adminManagerIds.push(...managerMemberships.memberships.map(m => m.userId));
      }
    } catch (error) {
      console.error("Error fetching team information:", error);
    }
  }
  
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
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-2">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-foreground text-center mb-12 border-b border-border pb-4">
          {getPageTitle()}
        </h1>
        
        {rooms.length === 0 ? (
          <div className="bg-muted/30 p-10 rounded-xl shadow-inner max-w-lg mx-auto">
            <p className="text-center text-lg text-muted-foreground font-medium">
              {getEmptyMessage()}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16"> 
            {rooms.map((room) => {
              const creatorInfo = creatorsInfo.get(room.user_id);
              const creatorRole = getUserRole(room.user_id);
              
              return (
                <div key={room.$id} className="w-full"> 
                  <UserRoomCard 
                    room={room}
                    showCreatorInfo={userRole === "admin"}
                    currentUserId={currentUser.user?.$id}
                    creatorInfo={creatorInfo ? {
                      name: creatorInfo.name,
                      role: creatorRole
                    } : undefined}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}