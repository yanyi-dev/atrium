import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useEditCabin() {
  const queryClient = useQueryClient();
  const { isLoading: isEditing, mutate: editCabin } = useMutation({
    //{ newCabinData, id }为参数解构，因为mutate 函数只能接收一个参数
    mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("A Cabin has been edited successfully");
      queryClient.invalidateQueries({ queryKey: ["cabin"] });
    },
  });
  return { isEditing, editCabin };
}
