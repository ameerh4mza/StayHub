"use client";

import { useState, useEffect } from "react";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "@/app/actions/notifications";
import { Bell, ThumbsUp, Ban, X } from "lucide-react";
import Loader from "./Loader";

interface Notification {
  $id: string;
  user_id: string;
  booking_id: string;
  message: string;
  type: "booking_confirmed" | "booking_rejected" | "booking_cancelled";
  is_read: boolean;
  $createdAt: string;
}

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      try {
        const result = await getUserNotifications(userId);
        if (result.success) {
          setNotifications(result.notifications as unknown as Notification[]);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [userId]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.filter((notif) => notif.$id !== notificationId)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "booking_confirmed":
        return <ThumbsUp className="w-5 h-5 text-green-500" />;
      case "booking_rejected":
        return <X className="w-5 h-5 text-red-500" />;
      case "booking_cancelled":
        return <Ban className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-foreground" />;
    }
  };

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-foreground hover:text-primary transition-colors"
      >
        <Bell className="w-5 h-5" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Notifications</h3>
          </div>

          {loading ? (
            <div className="p-4 text-center text-muted">
              <Loader />
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted">
              No new notifications
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.$id}
                  className="p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted mt-1">
                        {new Date(notification.$createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleMarkAsRead(notification.$id)}
                      className="text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      Mark Read
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {notifications.length > 0 && (
            <div className="p-2 border-t border-border">
              <button
                onClick={() => {
                  notifications.forEach((notif) => handleMarkAsRead(notif.$id));
                }}
                className="w-full text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
