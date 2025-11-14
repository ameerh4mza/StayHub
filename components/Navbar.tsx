"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { UserRole } from "@/app/actions/getCurrentUserRole";
import NotificationBell from "./NotificationBell";
import {
  User,
  LogInIcon,
  UserCircle2Icon,
  PlusIcon,
  DoorOpen,
  BookIcon,
  Settings,
  Menu,
  X,
} from "lucide-react";

// Helper class for consistent link styling
const baseLinkStyle = "text-foreground hover:text-primary transition-colors duration-200 ease-in-out";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [userId, setUserId] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/session", { cache: "no-store" });
        const data = await res.json();
        setIsLoggedIn(data.loggedIn);

        if (data.loggedIn) {
          const roleRes = await fetch("/api/user-role", { cache: "no-store" });
          const roleData = await roleRes.json();
          setUserRole(roleData.role);

          // Get user ID for notifications
          const userRes = await fetch("/api/user", { cache: "no-store" });
          const userData = await userRes.json();
          if (userData.success) {
            setUserId(userData.user.$id);
          }
        }
      } catch (err) {
        console.error("Session check failed", err);
        setIsLoggedIn(false);
      }
    }

    checkSession();
    setIsOpen(false); // Close mobile menu on route change
  }, [pathname]);

  // // Disabling the rule here because the component needs to reset UI state (menu)
  // // based on external state (router path) changes, which is the intended behavior.
  // // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <nav className="bg-background/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.png"
              alt="StayHub Logo"
              width={100}
              height={60}
              sizes="100"
              priority={true}
              loading="eager"
              className="shrink-0 w-28 h-16 object-contain"
            />
          </Link>

          {/* Main Links (Desktop) */}
          <div className="hidden md:flex items-center justify-center grow">
            <div className="flex items-center space-x-8">
              <Link href="/" className={baseLinkStyle}>
                Rooms
              </Link>
              {isLoggedIn && (
                <>
                  <Link
                    href="/bookings"
                    className={`${baseLinkStyle} flex items-center gap-2`}
                  >
                    Bookings <BookIcon className="w-4 h-4" />
                  </Link>

                  {/* Manager/Admin links */}
                  {(userRole === "manager" || userRole === "admin") && (
                    <>
                      <Link
                        href="/manager/bookings"
                        className={`${baseLinkStyle} flex items-center gap-2`}
                      >
                        Manage Bookings <Settings className="w-4 h-4" />
                      </Link>
                      <Link
                        href="/add-room"
                        className={`${baseLinkStyle} flex items-center gap-2`}
                      >
                        Add Room <PlusIcon className="w-4 h-4" />
                      </Link>
                      <Link
                        href="/rooms/my"
                        className={`${baseLinkStyle} flex items-center gap-2`}
                      >
                        My Rooms <DoorOpen className="w-4 h-4" />
                      </Link>
                    </>
                  )}

                  {/* Admin only links */}
                  {userRole === "admin" && (
                    <Link
                      href="/admin/bookings"
                      className={`${baseLinkStyle} flex items-center gap-2`}
                    >
                      All Bookings <BookIcon className="w-4 h-4" />
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Auth Section (Desktop) */}
          <div className="hidden md:flex items-center space-x-6"> {/* Separated auth links and icons for better focus */}
            {!isLoggedIn ? (
              <>
                <Link
                  href="/auth/login"
                  className={`${baseLinkStyle} flex items-center gap-2`}
                >
                  Login <LogInIcon className="w-4 h-4" />
                </Link>
                <Link
                  href="/auth/register"
                  className={`${baseLinkStyle} flex items-center gap-2`}
                >
                  Register <User className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-6">
                {/* Notifications Bell - Only for regular users */}
                {userId && userRole === "user" && (
                  <NotificationBell userId={userId} />
                )}

                <Link
                  href="/profile"
                  className={`${baseLinkStyle} flex items-center gap-2`}
                >
                  Profile <UserCircle2Icon className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Menu (Mobile) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
        id="mobile-menu"
      >
        <div className="px-4 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
          <Link href="/" className={`${baseLinkStyle} block px-3 py-2 rounded-md text-base font-medium`}>
            Rooms
          </Link>

          {isLoggedIn && (
            <>
              {/* User Links */}
              <Link
                href="/bookings"
                className={`${baseLinkStyle} flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium`}
              >
                Bookings <BookIcon className="w-4 h-4" />
              </Link>

              {/* Manager/Admin mobile links */}
              {(userRole === "manager" || userRole === "admin") && (
                <>
                  <Link
                    href="/manager/bookings"
                    className={`${baseLinkStyle} flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium`}
                  >
                    Manage Bookings <Settings className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/add-room"
                    className={`${baseLinkStyle} flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium`}
                  >
                    Add Room <PlusIcon className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/rooms/my"
                    className={`${baseLinkStyle} flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium`}
                  >
                    My Rooms <DoorOpen className="w-4 h-4" />
                  </Link>
                </>
              )}

              {/* Admin only mobile links */}
              {userRole === "admin" && (
                <Link
                  href="/admin/bookings"
                  className={`${baseLinkStyle} flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium`}
                >
                  All Bookings <BookIcon className="w-4 h-4" />
                </Link>
              )}

              {/* Regular user mobile links (only show My Rooms if not admin/manager) */}
              {/* This conditional logic seems slightly redundant given the Admin/Manager block above, but kept for strict adherence to functionality */}
              {userRole === "user" && (
                <Link
                  href="/rooms/my"
                  className={`${baseLinkStyle} flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium`}
                >
                  My Rooms <DoorOpen className="w-4 h-4" />
                </Link>
              )}
            </>
          )}

          {/* Auth Links (Mobile) */}
          <div className="pt-2 border-t border-border">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/auth/login"
                  className={`${baseLinkStyle} flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium`}
                >
                  Login <LogInIcon className="w-4 h-4" />
                </Link>
                <Link
                  href="/auth/register"
                  className={`${baseLinkStyle} flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium`}
                >
                  Register <User className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <Link
                href="/profile"
                className={`${baseLinkStyle} flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium`}
              >
                Profile <UserCircle2Icon className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Mobile Notification Bell (Displayed last in mobile view) */}
          {userId && isLoggedIn && userRole === "user" && (
             <div className="flex justify-center py-4">
                <NotificationBell userId={userId} />
             </div>
          )}
        </div>
      </div>
    </nav>
  );
}