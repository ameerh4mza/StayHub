🏠 StayHub – Room Booking Management System

A comprehensive full-stack room booking management system with role-based access control, built using Next.js, TypeScript, and Appwrite.

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

Key Features Implementation

Contributing

License

✨ Features
🔐 Authentication & Authorization

User registration/login with Appwrite Authentication

Role-based access (Admin, Manager, User)

Appwrite Teams for permission control

Protected routes & middleware

Secure session cookies

🏢 Room Management

Create, edit, delete rooms

Cloudinary image uploads

Advanced room info: capacity, amenities, price, location

Availability & scheduling

📅 Booking System

Real-time availability validation

Request booking, cancel booking

Status: Pending, Confirmed, Rejected, Cancelled

User booking history

Admin/Manager booking controls

🔔 Notification System

Real-time notifications on status change

Read/unread status

Notification bell with counter

👤 Profile Management

Update user information

Profile picture upload

View role & account details

🛠 Tech Stack
Frontend

Next.js 14 (App Router)

TypeScript

Tailwind CSS

React Hook Form

Zod

React Hot Toast

Backend

Next.js Server Actions

Appwrite (Database + Auth + Teams)

Cloudinary for media storage

📁 Project Structure
StayHub/
├── app/
│   ├── actions/
│   │   ├── bookRoom.tsx
│   │   ├── getAllBookings.tsx
│   │   ├── getAllRooms.tsx
│   │   ├── getMyRooms.tsx
│   │   ├── createRooms.tsx
│   │   ├── editRoom.tsx
│   │   ├── deleteRoom.tsx
│   │   ├── manageBookings.tsx
│   │   ├── cancelBooking.tsx
│   │   ├── notifications.tsx
│   │   ├── getCurrentUserRole.tsx
│   │   └── checkRoomAvailability.tsx
│   ├── api/
│   │   ├── register/route.ts
│   │   ├── login/route.ts
│   │   ├── sign-out/route.ts
│   │   ├── session/route.ts
│   │   └── user-role/route.ts
│   ├── auth/
│   ├── admin/
│   ├── manager/
│   ├── rooms/
│   ├── bookings/
│   ├── profile/
│   ├── add-room/
│   ├── page.tsx
│   └── layout.tsx
├── components/
│   ├── BookingForm.tsx
│   ├── BookingRoomCard.tsx
│   ├── AdminBookingCard.tsx
│   ├── ManagerBookingCard.tsx
│   ├── RoomCard.tsx
│   ├── UserRoomCard.tsx
│   ├── EditRoomModal.tsx
│   ├── CancelBookingButton.tsx
│   ├── NotificationBell.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── types/
│   ├── room.ts
│   └── booking.ts
├── config/appwrite.ts
├── lib/getUserInfo.ts
└── proxy.ts

🚀 Installation
1. Clone Repo
git clone https://github.com/yourusername/stayhub.git
cd stayhub

2. Install Dependencies
npm install

3. Set Up Environment Variables

Create .env.local (see below).

4. Configure Appwrite

Create database & collections

Create teams (Admin, Manager, User)

5. Run Dev Server
npm run dev


Open:
👉 http://localhost:3000

🔧 Environment Variables

Create a .env.local file:

NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT_ID=

APPWRITE_API_KEY=
APPWRITE_DATABASE_ID=
APPWRITE_ROOMS_COLLECTION=
APPWRITE_BOOKINGS_COLLECTION=
APPWRITE_NOTIFICATIONS_COLLECTION=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

🗄️ Database Schema
Collections

Rooms

Bookings

Notifications

Appwrite Teams
Team	Permissions
Admins	Full system access
Managers	Manage rooms & bookings for their own rooms
Users	View rooms & create bookings
👥 User Roles & Permissions
🔑 Admin

Full CRUD on all rooms

Manage all bookings

Access all dashboards

🏢 Manager

Manage their own rooms

Approve/reject bookings

View bookings for their rooms

👤 User

View rooms

Create & cancel own bookings

Manage profile

Receive notifications

🛣️ API Routes
Authentication

POST /api/register

POST /api/login

POST /api/sign-out

GET /api/session

GET /api/user-role

Server Actions

Rooms: createRooms, editRoom, deleteRoom, getAllRooms, getMyRooms

Bookings: bookRoom, getAllBookings, manageBookings, cancelBooking

Users: getCurrentUserRole

Notifications: createNotification, getUserNotifications, markNotificationAsRead

🧩 Components Overview
Rooms

RoomCard

UserRoomCard

EditRoomModal

Bookings

BookingForm

BookingRoomCard

AdminBookingCard

ManagerBookingCard

CancelBookingButton

UI

Navbar

NotificationBell

Footer

🚀 Deployment
Vercel (Recommended)

Push code to GitHub

Connect repo to Vercel

Add all environment variables

Deploy

Manual
npm run build
npm start

📝 Key Features Implementation
✅ Real-time Availability

Prevents double-booking

Uses date overlap validation

🌇 Image Uploads

Cloudinary storage

Preview before upload

🔐 Role-Based Access

Middleware protected routes

Component-level checks

🔔 Notification System

Auto-notifications on status change

Read/unread tracking

🤝 Contributing

Fork repository

Create feature branch

Commit changes

Push branch

Open Pull Request

📄 License

Licensed under the MIT License.
