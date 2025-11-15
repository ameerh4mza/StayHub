🏠 StayHub - Room Booking Management System
A comprehensive full-stack web application for managing room bookings with role-based access control, built with Next.js, TypeScript, and Appwrite.

📋 Table of Contents
Features
Tech Stack
Project Structure
Installation
Environment Variables
Database Schema
User Roles & Permissions
API Routes
Components
Deployment
✨ Features
🔐 Authentication & Authorization
User Registration/Login with email and password
Role-based Access Control (Admin, Manager, User)
Team-based Permissions using Appwrite Teams
Protected Routes with middleware
Session Management with secure cookies
🏢 Room Management
Create, Read, Update, Delete rooms (Admin & Manager only)
Image Upload to Cloudinary with preview
Advanced Room Details (capacity, amenities, square footage)
Availability Management
Location & Pricing information
📅 Booking System
Real-time Availability Checking
Booking Creation with date validation
Status Management (Pending, Confirmed, Rejected, Cancelled)
User Booking History
Admin/Manager Booking Oversight
🔔 Notification System
Real-time Notifications for booking updates
Email-style Notifications with read/unread status
Notification Bell with unread count
Auto-notifications on booking status changes
👤 Profile Management
User Profile with image upload
Profile Picture with circular display
User Information Management
🛠 Tech Stack
Frontend
Next.js 14 (App Router)
TypeScript for type safety
Tailwind CSS for styling
React Hook Form for form management
Zod for schema validation
React Hot Toast for notifications
Backend
Next.js API Routes
Appwrite for database and authentication
Cloudinary for image storage
Server Actions for data mutations
Database & Services
Appwrite Database (NoSQL)
Appwrite Authentication with Teams
Cloudinary for media management

📁 Project Structure
StayHub/
├── app/
│   ├── actions/                    # Server actions
│   │   ├── bookRoom.tsx           # Booking creation
│   │   ├── getAllBookings.tsx     # User bookings
│   │   ├── getAllRooms.tsx        # Room fetching
│   │   ├── getMyRooms.tsx         # User's rooms
│   │   ├── createRooms.tsx        # Room creation
│   │   ├── editRoom.tsx           # Room updates
│   │   ├── deleteRoom.tsx         # Room deletion
│   │   ├── manageBookings.tsx     # Admin/Manager actions
│   │   ├── cancelBooking.tsx      # User cancellation
│   │   ├── notifications.tsx      # Notification system
│   │   ├── getCurrentUserRole.tsx # Role detection
│   │   └── checkRoomAvailability.tsx
│   ├── api/                       # API routes
│   │   ├── register/route.ts      # User registration
│   │   ├── login/route.ts         # User login
│   │   ├── sign-out/route.ts      # Logout
│   │   ├── session/route.ts       # Session check
│   │   └── user-role/route.ts     # Role fetching
│   ├── auth/                      # Authentication pages
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── admin/                     # Admin dashboard
│   │   └── bookings/page.tsx
│   ├── manager/                   # Manager dashboard
│   │   └── bookings/page.tsx
│   ├── rooms/                     # Room pages
│   │   ├── [id]/page.tsx          # Room details
│   │   └── my/page.tsx            # User's rooms
│   ├── bookings/page.tsx          # User bookings
│   ├── profile/page.tsx           # User profile
│   ├── add-room/page.tsx          # Room creation
│   ├── page.tsx                   # Home page
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── components/                    # Reusable components
│   ├── BookingForm.tsx           # Room booking
│   ├── BookingRoomCard.tsx       # User booking display
│   ├── AdminBookingCard.tsx      # Admin booking management
│   ├── ManagerBookingCard.tsx    # Manager booking management
│   ├── RoomCard.tsx              # Room display
│   ├── UserRoomCard.tsx          # User's room card
│   ├── EditRoomModal.tsx         # Room editing
│   ├── CancelBookingButton.tsx   # Booking cancellation
│   ├── NotificationBell.tsx      # Notification system
│   ├── Navbar.tsx                # Navigation
│   └── Footer.tsx                # Footer
├── types/                        # TypeScript types
│   ├── room.ts                   # Room type definitions
│   └── booking.ts                # Booking type definitions
├── config/
│   └── appwrite.ts               # Appwrite configuration
├── lib/
│   └── getUserInfo.ts            # User utilities
└── proxy.ts                      # Route protection middleware


🚀 Installation
Clone the repository

Install dependencies

Set up environment variables (see Environment Variables)

Configure Appwrite (see Database Schema)

Run the development server

Open http://localhost:3000

🔧 Environment Variables
Create a .env.local file in the root directory:

🗄️ Database Schema
Appwrite Collections
1. Rooms Collection
2. Bookings Collection
3. Notifications Collection
Appwrite Teams
Admins: Full system access
Managers: Room and booking management
Users: Basic booking functionality
👥 User Roles & Permissions
🔑 Admin
Rooms: Create, edit, delete any room (admin + manager rooms)
Bookings: View, approve, reject, cancel all bookings
Users: Manage all user bookings
Access: All admin and manager features
🏢 Manager
Rooms: Create, edit, delete own rooms only
Bookings: View, approve, reject, cancel bookings for their rooms
Users: Manage bookings for their rooms
Access: Room management and booking oversight
👤 User
Rooms: View all available rooms
Bookings: Create bookings, view own bookings, cancel pending bookings
Profile: Manage own profile and preferences
Notifications: Receive booking status updates
🛣️ API Routes
Authentication
POST /api/register - User registration
POST /api/login - User login
POST /api/sign-out - User logout
GET /api/session - Session validation
GET /api/user-role - User role fetching
Server Actions
Rooms: createRooms, editRoom, deleteRoom, getAllRooms, getMyRooms, getSingleRoom
Bookings: bookRoom, getAllBookings, manageBookings, cancelBooking, checkRoomAvailability
Users: getUser, getCurrentUserRole
Notifications: createNotification, getUserNotifications, markNotificationAsRead
🧩 Components
Core Components
RoomCard: Displays room information with booking option
BookingForm: Room booking interface with availability checking
UserRoomCard: User's room management with edit/delete options
EditRoomModal: Modal for editing room details and images
Booking Management
BookingRoomCard: User booking display with status and cancel option
AdminBookingCard: Admin booking management with approve/reject/cancel
ManagerBookingCard: Manager booking oversight for their rooms
CancelBookingButton: User booking cancellation
UI Components
Navbar: Navigation with role-based menu items
NotificationBell: Real-time notification display
Loader: Loading spinner for async operations
Footer: Site footer information
🚀 Deployment
Vercel (Recommended)
Push to GitHub
Connect to Vercel
Add environment variables
Deploy
Manual Deployment
Build the application

Start production server

📝 Key Features Implementation
Real-time Availability
Checks overlapping bookings before creation
Prevents double-booking conflicts
UTC datetime handling for consistency
Image Management
Cloudinary integration for optimization
Real-time preview during upload
Automatic image optimization
Role-based Access
Middleware route protection
Component-level permission checking
API route authorization
Notification System
Auto-generated notifications on booking status changes
Real-time unread count display
Mark as read functionality
🤝 Contributing
Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Next.js for the React framework
Appwrite for backend services
Tailwind CSS for styling
Cloudinary for image management
StayHub - Making room booking simple and efficient! 🏠✨

