# 🏠 **StayHub** - Complete Room Booking Management System

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Appwrite](https://img.shields.io/badge/Appwrite-FD366E?style=for-the-badge&logo=appwrite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

**A comprehensive full-stack room booking platform with advanced role-based access control**

[🚀 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Issues](#) • [⭐ Star on GitHub](#)

</div>

---

## 📋 **Table of Contents**

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Environment Setup](#️-environment-setup)
- [🗄️ Database Schema](#️-database-schema)
- [👥 Role Management](#-role-management)
- [🔧 API Reference](#-api-reference)
- [🧩 Components](#-components)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

---

## ✨ **Features**

### 🔐 **Advanced Authentication & Security**

- **Multi-tier Authentication**: Secure email/password with session management
- **Role-Based Access Control**: Three-level hierarchy (Admin → Manager → User)
- **Team-Based Permissions**: Appwrite Teams integration for scalable role management
- **Route Protection**: Middleware-based authentication with automatic redirects
- **Session Persistence**: Secure cookie-based session handling

### 🏢 **Comprehensive Room Management**

- **Full CRUD Operations**: Create, read, update, delete rooms with permission checks
- **Advanced Room Details**: Capacity, amenities, square footage, pricing, availability
- **Image Management**: Cloudinary integration with real-time preview and optimization
- **Smart Availability**: Real-time availability checking with conflict prevention
- **Location Services**: Address and location management for room discovery

### 📅 **Intelligent Booking System**

- **Real-Time Availability**: Dynamic availability checking with date/time validation
- **Status Workflow**: Complete booking lifecycle (Pending → Confirmed/Rejected → Completed/Cancelled)
- **Conflict Prevention**: Automatic overlap detection and prevention
- **Multi-Role Management**: Different booking controls for each user role
- **History Tracking**: Comprehensive booking history with status tracking

### 🔔 **Smart Notification System**

- **Real-Time Notifications**: Instant updates on booking status changes
- **Read/Unread Tracking**: Visual indicators and notification management
- **Auto-Generated Messages**: Contextual notifications based on booking events
- **Role-Based Delivery**: Targeted notifications based on user permissions
- **Interactive Bell UI**: Notification counter with dropdown management

### 👤 **Complete Profile Management**

- **Profile Customization**: Full user profile with image upload capabilities
- **Cloudinary Integration**: Optimized profile picture handling with circular display
- **Preference Management**: User settings and preference storage
- **Role Indicators**: Visual role badges and permission displays

---

## 🏗️ **Architecture**

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Frontend Layer                             │
├─────────────────────────────────────────────────────────────────────┤
│ Next.js 16 App Router → TypeScript → Tailwind CSS → React Hook Form │
└─────────────────────┬───────────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────────┐
│                      Authentication Layer                           │
├─────────────────────────────────────────────────────────────────────┤
│  Appwrite Auth → Session Management → Role-Based Access → Middleware │
└─────────────────────┬───────────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────────┐
│                       Backend Layer                                 │
├─────────────────────────────────────────────────────────────────────┤
│   Server Actions → Appwrite Database → API Routes → Collections     │
└─────────────────────┬───────────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────────┐
│                    External Services                                │
├─────────────────────────────────────────────────────────────────────┤
│        Cloudinary CDN → Image Optimization → Appwrite Teams         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ **Tech Stack**

<table>
<tr>
<td width="50%">

### **🎨 Frontend**

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom theme
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React icons
- **Notifications**: React Hot Toast
- **Date/Time**: Luxon for date handling

</td>
<td width="50%">

### **⚡ Backend**

- **Database**: Appwrite Database (NoSQL)
- **Authentication**: Appwrite Auth + Teams
- **Storage**: Cloudinary for images
- **API**: Next.js API Routes + Server Actions
- **Validation**: Zod schema validation
- **Email**: Nodemailer integration
- **File Upload**: Next-Cloudinary

</td>
</tr>
</table>

---

## 📁 **Project Structure**

<details>
<summary>🔍 <strong>Detailed Project Tree</strong></summary>

```
🏠 StayHub/
├── 📁 app/                           # Next.js 16 App Directory
│   ├── 📁 actions/                   # Server Actions (Business Logic)
│   │   ├── 📄 bookRoom.tsx           # Booking creation with validation
│   │   ├── 📄 getAllBookings.tsx     # User booking retrieval
│   │   ├── 📄 getAllRooms.tsx        # Room data fetching
│   │   ├── 📄 getMyRooms.tsx         # Role-based room access
│   │   ├── 📄 createRooms.tsx        # Room creation logic
│   │   ├── 📄 editRoom.tsx           # Room update operations
│   │   ├── 📄 deleteRoom.tsx         # Room deletion with permissions
│   │   ├── 📄 manageBookings.tsx     # Admin/Manager booking control
│   │   ├── 📄 cancelBooking.tsx      # User cancellation logic
│   │   ├── 📄 notifications.tsx      # Notification CRUD operations
│   │   ├── 📄 getCurrentUserRole.tsx # Role detection & validation
│   │   ├── 📄 getUser.tsx            # User profile retrieval
│   │   ├── 📄 profileClient.tsx      # Profile management client
│   │   └── 📄 checkRoomAvailability.tsx # Availability validation
│   │
│   ├── 📁 api/                       # API Routes
│   │   ├── 📁 register/route.ts      # User registration endpoint
│   │   ├── 📁 login/route.ts         # Authentication endpoint
│   │   ├── 📁 sign-out/route.ts      # Logout functionality
│   │   ├── 📁 session/route.ts       # Session validation
│   │   ├── 📁 user/route.ts          # User data API
│   │   ├── 📁 user-role/route.ts     # Role fetching API
│   │   └── 📁 send-query/route.ts    # Contact form handler
│   │
│   ├── 📁 auth/                      # Authentication Pages
│   │   ├── 📄 login/page.tsx         # Login interface
│   │   └── 📄 register/page.tsx      # Registration interface
│   │
│   ├── 📁 admin/                     # Admin Dashboard
│   │   └── 📄 bookings/page.tsx      # Admin booking management
│   │
│   ├── 📁 manager/                   # Manager Dashboard
│   │   └── 📄 bookings/page.tsx      # Manager booking oversight
│   │
│   ├── 📁 rooms/                     # Room Management
│   │   ├── 📄 [id]/page.tsx          # Individual room details
│   │   └── 📄 my/page.tsx            # User's room management
│   │
│   ├── 📄 bookings/page.tsx          # User booking history
│   ├── 📄 profile/page.tsx           # User profile page
│   ├── 📄 add-room/page.tsx          # Room creation form
│   ├── 📄 page.tsx                   # Homepage/Room discovery
│   ├── 📄 layout.tsx                 # Root layout with providers
│   └── 📄 globals.css                # Global styles & Tailwind config
│
├── 📁 components/                    # Reusable UI Components
│   ├── 📄 BookingForm.tsx           # Room booking interface
│   ├── 📄 BookingRoomCard.tsx       # User booking display
│   ├── 📄 AdminBookingCard.tsx      # Admin booking management
│   ├── 📄 ManagerBookingCard.tsx    # Manager booking controls
│   ├── 📄 RoomCard.tsx              # Room display component
│   ├── 📄 UserRoomCard.tsx          # User's room management
│   ├── 📄 EditRoomModal.tsx         # Room editing interface
│   ├── 📄 CancelBookingButton.tsx   # Booking cancellation
│   ├── 📄 NotificationBell.tsx      # Notification system UI
│   ├── 📄 Navbar.tsx                # Navigation with role-based menu
│   ├── 📄 Footer.tsx                # Site footer
│   ├── 📄 LayoutWrapper.tsx         # Layout component wrapper
│   └── 📄 Loader.tsx                # Loading spinner component
│
├── 📁 types/                        # TypeScript Type Definitions
│   ├── 📄 room.ts                   # Room entity types
│   └── 📄 booking.ts                # Booking entity types
│
├── 📁 config/                       # Configuration Files
│   └── 📄 appwrite.ts               # Appwrite client configuration
│
├── 📁 lib/                          # Utility Functions
│   └── 📄 getUserInfo.ts            # User information utilities
│
├── 📄 proxy.ts                      # Route protection middleware
├── 📄 next.config.ts                # Next.js configuration
├── 📄 postcss.config.mjs            # PostCSS configuration
├── 📄 eslint.config.mjs             # ESLint configuration
└── 📄 package.json                  # Dependencies & scripts
```

</details>

---

## 🚀 **Quick Start**

### **📋 Prerequisites**

- **Node.js 18+** installed on your system
- **Appwrite Cloud** account (free tier available)
- **Cloudinary** account for image storage
- **Git** for version control

### **⚡ Installation Steps**

```bash
# 1️⃣ Clone the repository
git clone https://github.com/yourusername/stayhub.git
cd stayhub

# 2️⃣ Install dependencies
npm install

# 3️⃣ Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4️⃣ Start development server
npm run dev

# 🎉 Open http://localhost:3000
```

---

## ⚙️ **Environment Setup**

### **📝 Environment Variables**

Create a `.env.local` file:

```env
# 🔑 Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id

# 🔐 Appwrite Admin API Key
NEXT_APPWRITE_KEY=your_api_key

# 🗄️ Database Collections
NEXT_APPWRITE_DATABASE_ID=your_database_id
NEXT_APPWRITE_ROOMS_COLLECTION_ID=your_rooms_collection
NEXT_APPWRITE_BOOKINGS_COLLECTION_ID=your_bookings_collection
NEXT_APPWRITE_NOTIFICATIONS_COLLECTION_ID=your_notifications_collection

# 🖼️ Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_PRESET=your_upload_preset
```

### **☁️ Appwrite Setup Guide**

1. **Create Project**

   - Sign up at [Appwrite Cloud](https://cloud.appwrite.io)
   - Create new project → Copy Project ID

2. **Configure Authentication**

   - Enable Email/Password provider
   - Set up domains (localhost:3000 for development)

3. **Create Database Collections**

   - Rooms, Bookings, Notifications collections
   - Set appropriate permissions for each role

4. **Set up Teams**
   - Create "Admins" team
   - Create "Managers" team
   - Regular users don't need teams

### **📦 Cloudinary Setup**

1. **Create Account** at [Cloudinary](https://cloudinary.com)
2. **Get Credentials** from Dashboard → Settings
3. **Create Upload Preset**:
   - Settings → Upload → Add upload preset
   - Set to "Unsigned" mode
   - Name: `stayhub-uploads`

---

## 🗄️ **Database Schema**

### **🏠 Rooms Collection**

```typescript
interface Room {
  $id: string; // Auto-generated ID
  user_id: string; // Creator ID
  name: string; // Room name
  address: string; // Physical address
  availability: string; // Available hours (e.g., "9 AM - 6 PM")
  price_per_hour: number; // Hourly rate in USD
  description?: string; // Room description
  location?: string; // Specific location details
  sqft?: number; // Square footage
  capacity?: number; // Maximum occupancy
  amenities?: string; // Available amenities
  image?: string; // Cloudinary URL
  $createdAt: string; // Auto timestamp
  $updatedAt: string; // Auto timestamp
}
```

### **📅 Bookings Collection**

```typescript
interface Booking {
  $id: string;
  user_id: string; // Booking user
  room_id: string; // Booked room
  check_in: string; // ISO datetime string
  check_out: string; // ISO datetime string
  status:
    | "pending"
    | "confirmed"
    | "rejected"
    | "cancelled_by_user"
    | "cancelled_by_admin";
  $createdAt: string;
  $updatedAt: string;
}
```

### **🔔 Notifications Collection**

```typescript
interface Notification {
  $id: string;
  user_id: string; // Notification recipient
  booking_id: string; // Related booking
  message: string; // Notification content
  type:
    | "booking_confirmed"
    | "booking_rejected"
    | "booking_cancelled"
    | "booking_created";
  is_read: boolean; // Read status
  $createdAt: string;
  $updatedAt: string;
}
```

---

## 👥 **Role Management System**

<table>
<thead>
<tr>
<th width="15%">🎭 Role</th>
<th width="25%">🏠 Room Permissions</th>
<th width="25%">📅 Booking Permissions</th>
<th width="20%">🔔 Notifications</th>
<th width="15%">🎯 Dashboard</th>
</tr>
</thead>
<tbody>
<tr>
<td>

**🔴 Admin**  
_System Owner_

</td>
<td>

✅ **Full Access**

- Create/Edit/Delete any room
- View admin & manager rooms
- Override any restrictions
- Bulk operations

</td>
<td>

✅ **Complete Control**

- Approve/Reject all bookings
- Cancel any booking
- View system analytics
- Override decisions

</td>
<td>

❌ **No Bell**

- Manages via dashboard
- Email notifications only
- System alerts

</td>
<td>

🎛️ **Admin Panel**

- All bookings view
- User management
- System metrics
- Role assignments

</td>
</tr>
<tr>
<td>

**🟡 Manager**  
_Room Owner_

</td>
<td>

✅ **Own Rooms Only**

- Create unlimited rooms
- Edit/Delete own rooms
- Cannot modify admin rooms
- Room analytics

</td>
<td>

✅ **Own Bookings**

- Approve/Reject for own rooms
- Cancel bookings
- Customer communication
- Revenue tracking

</td>
<td>

❌ **No Bell**

- Dashboard notifications
- Email alerts for bookings
- SMS notifications

</td>
<td>

🏢 **Manager Panel**

- Own room bookings
- Revenue analytics
- Customer management
- Room performance

</td>
</tr>
<tr>
<td>

**🟢 User**  
_Customer_

</td>
<td>

✅ **View Only**

- Browse all rooms
- View room details
- Check availability
- Save favorites

</td>
<td>

✅ **Own Bookings**

- Create bookings
- Cancel pending bookings
- View booking history
- Request modifications

</td>
<td>

✅ **Full Notifications**

- Real-time bell notifications
- Email confirmations
- SMS reminders
- Status updates

</td>
<td>

👤 **User Dashboard**

- Booking history
- Profile management
- Notification center
- Favorites list

</td>
</tr>
</tbody>
</table>

---

## 🔧 **API Reference**

### **🔐 Authentication Endpoints**

| Method | Endpoint         | Description       | Body                      | Response             |
| ------ | ---------------- | ----------------- | ------------------------- | -------------------- |
| `POST` | `/api/register`  | User registration | `{email, password, name}` | `{success, user}`    |
| `POST` | `/api/login`     | User login        | `{email, password}`       | `{success, session}` |
| `POST` | `/api/sign-out`  | User logout       | None                      | `{success}`          |
| `GET`  | `/api/session`   | Session check     | None                      | `{loggedIn, user}`   |
| `GET`  | `/api/user-role` | Get user role     | None                      | `{role}`             |
| `GET`  | `/api/user`      | Get user data     | None                      | `{success, user}`    |

### **⚡ Server Actions**

#### **Room Management**

```typescript
// Create new room
createRoom(data: FormData): Promise<{success: boolean}>

// Update room
editRoom(roomId: string, data: Room): Promise<{success: boolean}>

// Delete room
deleteRoom(roomId: string): Promise<{success: boolean}>

// Get all rooms
getAllRooms(): Promise<Room[]>

// Get user's rooms (role-based)
getMyRooms(): Promise<Room[]>

// Check availability
checkRoomAvailability(roomId: string, checkIn: string, checkOut: string): Promise<boolean>
```

#### **Booking Operations**

```typescript
// Create booking
bookRoom({data}: {data: BookingData}): Promise<{success: boolean}>

// Get user bookings
getAllBookings(): Promise<BookingWithRoom[]>

// Manage booking (admin/manager)
manageBookings(bookingId: string, status: string): Promise<{success: boolean}>

// Cancel booking
cancelBooking(bookingId: string): Promise<{success: boolean}>
```

#### **User & Profile**

```typescript
// Get current user
getUser(): Promise<{success: boolean, user: User | null}>

// Get user role
getCurrentUserRole(): Promise<UserRole>

// Update profile
updateProfile(data: ProfileData): Promise<{success: boolean}>
```

---

## 🧩 **Component Architecture**

### **🏠 Room Components**

- **`RoomCard`**: Public room display with booking button
- **`UserRoomCard`**: User's room with edit/delete controls
- **`EditRoomModal`**: Room editing interface with image upload
- **`BookingForm`**: Room booking with availability checking

### **📅 Booking Components**

- **`BookingRoomCard`**: User booking display with status
- **`AdminBookingCard`**: Admin booking management
- **`ManagerBookingCard`**: Manager booking controls
- **`CancelBookingButton`**: Booking cancellation interface

### **🔔 Notification Components**

- **`NotificationBell`**: Real-time notification dropdown
- **`NotificationItem`**: Individual notification display

### **🎛️ Navigation & Layout**

- **`Navbar`**: Role-based navigation with responsive design
- **`Footer`**: Site footer with links and information
- **`LayoutWrapper`**: Layout component with conditional footer
- **`Loader`**: Loading spinner for async operations

### **👤 User Components**

- **`ProfileClient`**: User profile management with image upload

---

## 🚀 **Deployment**

### **🌟 Recommended: Vercel Deployment**

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **Deploy to Vercel**

   - Visit [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy automatically

3. **Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Ensure production Appwrite/Cloudinary credentials

### **🔧 Manual Deployment**

```bash
# Build the application
npm run build

# Start production server
npm start

# Or use PM2 for production
npm install -g pm2
pm2 start npm --name "stayhub" -- start
```

---

## 🤝 **Contributing**

### **🔄 Development Workflow**

1. **Fork & Clone**

   ```bash
   git clone https://github.com/yourusername/stayhub.git
   cd stayhub
   git checkout -b feature/amazing-feature
   ```

2. **Setup Development**

   ```bash
   npm install
   cp .env.example .env.local
   # Configure your environment
   npm run dev
   ```

3. **Code Standards**

   - Follow TypeScript best practices
   - Use Tailwind CSS for styling
   - Write descriptive commit messages
   - Add tests for new features

4. **Submit Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   git push origin feature/amazing-feature
   ```

---

## 📊 **Key Features Highlights**

- **⚡ Performance**: Optimized for Core Web Vitals with automatic image optimization
- **📱 Responsive**: Mobile-first design with Tailwind CSS
- **🔒 Security**: Input validation, authentication, and role-based access control
- **♿ Accessibility**: WCAG 2.1 AA compliant with semantic HTML
- **🔍 SEO**: Optimized meta tags and structured data
- **🌐 Scalable**: Appwrite backend with team-based role management

---

## 🚨 **Troubleshooting**

### **Image Upload Issues**

```bash
# Check Cloudinary preset
Error: "Upload preset must be specified"
Solution: Verify NEXT_PUBLIC_CLOUDINARY_PRESET in .env.local
```

### **Authentication Problems**

```bash
# Session not found
Error: "Session cookie not found"
Solution: Check NEXT_PUBLIC_APPWRITE_ENDPOINT configuration
```

### **Database Permissions**

```bash
# Permission denied
Error: "User does not have access"
Solution: Verify Appwrite collection permissions and team memberships
```

---

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🌟 **Acknowledgments**

- **[Next.js Team](https://nextjs.org/)** - For the amazing React framework
- **[Appwrite](https://appwrite.io/)** - For the comprehensive backend platform
- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework
- **[Cloudinary](https://cloudinary.com/)** - For powerful image management
- **[Vercel](https://vercel.com/)** - For seamless deployment platform

---

<div align="center">

**Built with ❤️ using Next.js 16, TypeScript, Appwrite, and Tailwind CSS**

[⭐ Star this project](#) • [🐛 Report Issues](#) • [💡 Request Features](#)

**StayHub** - _Making room booking simple, secure, and scalable_ 🚀

</div>
