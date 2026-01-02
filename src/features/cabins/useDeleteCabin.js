import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCabin as deleteCabinApi } from "../../services/apiCabins";

export function useDeleteCabin() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteCabin } = useMutation({
    mutationFn: deleteCabinApi,
    //成功回调
    onSuccess: () => {
      toast.success("Cabin successfully deleted");
      //成功后，让缓存中特定数据失效，重新获取
      queryClient.invalidateQueries({
        queryKey: ["cabin"],
      });
    },
    //失败回调，接收从mutation函数中抛出的错误对象
    onError: (err) => toast.error(err.message),
  });
  return { isDeleting, deleteCabin };
}
