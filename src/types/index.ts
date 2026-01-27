import { Database } from "./supabaseTypes";

//数据库实体类型定义
type Tables = Database["public"]["Tables"];

//Booking
export type Booking = Tables["bookings"]["Row"];
export type UpdateBooking = Tables["bookings"]["Update"];

//Cabin
export type Cabin = Tables["cabins"]["Row"];
export type NewCabin = Tables["cabins"]["Insert"];

//Guest
export type Guest = Tables["guests"]["Row"];
export type NewGuest = Tables["guests"]["Insert"];
export type UpdateGuest = Tables["guests"]["Update"];

//Setting
export type Setting = Tables["settings"]["Row"];
export type UpdateSetting = Tables["settings"]["Update"];

export interface Options {
  value: string;
  label: string;
}
