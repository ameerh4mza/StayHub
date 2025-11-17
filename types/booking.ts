import { Models } from "node-appwrite";
import { Room } from "./room";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "cancelled_by_user"
  | "cancelled_by_admin";

export type Booking = {
  user_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  status?: BookingStatus;
  cancelled_by?: "user" | "admin";
} & Models.Document;

export type BookingWithRoom = Booking & {
  room?: Room;
  name: string;
  address: string;
  location?: string;
  price_per_hour: number;
  image?: string;
  user_name?: string;
  user_email?: string;
};
