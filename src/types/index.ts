import { Database } from "./supabaseTypes";

//数据库实体类型定义
type Tables = Database["public"]["Tables"];

//Booking
export type Booking = Tables["bookings"]["Row"];
export type UpdateBooking = Tables["bookings"]["Update"];
export type BookingDetail = Booking & {
  cabins: Cabin | null;
  guests: Guest | null;
};
export type BookingWithSelection = Pick<
  Booking,
  "id" | "startDate" | "endDate" | "numNights" | "status" | "totalPrice"
> & {
  cabins: Pick<Cabin, "name"> | null; // 关联查询可能会返回 null
  guests: Pick<Guest, "fullName" | "email"> | null;
};
export type BreakfastProps = Pick<
  UpdateBooking,
  "hasBreakfast" | "extrasPrice" | "totalPrice"
>;
export type StaysTodayActivity = Booking & {
  guests: Pick<Guest, "fullName" | "nationality" | "countryFlag"> | null;
};
export type BookingsAfterDate = Pick<
  Booking,
  "created_at" | "totalPrice" | "extrasPrice"
>;
export type StaysAfterDate = Booking & {
  guests: Pick<Guest, "fullName"> | null;
};

//Cabin
export type Cabin = Tables["cabins"]["Row"];
export type NewCabin = Tables["cabins"]["Insert"];
export type CreateCabin = Omit<NewCabin, "image"> & { image: string | File };
export type CreateFormData = Omit<NewCabin, "image" | "id" | "created_at"> & {
  image: string | FileList;
};

//Guest
export type Guest = Tables["guests"]["Row"];
export type NewGuest = Tables["guests"]["Insert"];
export type UpdateGuest = Tables["guests"]["Update"];

//Setting
export type Setting = Tables["settings"]["Row"];
export type UpdateSetting = Tables["settings"]["Update"];

//过滤器选项定义
export interface Options {
  value: string;
  label: string;
}

//注册用户表单类型
export interface SignUpParams {
  fullName: string;
  email: string;
  password: string;
}

//更新用户表单类型
export interface UpdateCurrentUserParams {
  password?: string;
  fullName?: string;
  avatar?: File | null;
}
