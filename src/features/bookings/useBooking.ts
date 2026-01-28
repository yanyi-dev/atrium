import { useQuery } from "@tanstack/react-query";
import { getBooking } from "../../services/apiBookings";
import { useParams } from "react-router-dom";

export function useBooking() {
  const { bookingId } = useParams();

  const {
    data: booking,
    isLoading,
    error,
  } = useQuery({
    // 任何出现在 queryFn 内部的变量，都必须出现在 queryKey 中
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(Number(bookingId)),
    retry: false,
    enabled: !!bookingId,
  });

  return { booking, isLoading, error };
}
