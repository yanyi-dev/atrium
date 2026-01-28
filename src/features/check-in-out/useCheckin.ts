import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BreakfastProps } from "../../types";

interface CheckinParams {
  bookingId: number;
  breakfast: BreakfastProps;
}

export function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isLoading: isCheckingIn, mutate: checkin } = useMutation({
    //箭头函数中的参数，只能是一个参数，或者是一个配置对象
    //在使用解构出来的mutate函数时，要传递箭头函数所需要的参数
    //这些参数即ui界面提供的，会变化的参数
    //函数体自带的参数即固定业务逻辑，不变
    mutationFn: ({ bookingId, breakfast }: CheckinParams) =>
      updateBooking(bookingId, {
        status: "checked-in",
        isPaid: true,
        ...breakfast,
      }),
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked in`);
      queryClient.invalidateQueries({ refetchType: "active" });
      navigate("/");
    },
    onError: () => toast.error("There was an error while checking in"),
  });

  return { checkin, isCheckingIn };
}
