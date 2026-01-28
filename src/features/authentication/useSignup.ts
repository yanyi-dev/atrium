import { useMutation } from "@tanstack/react-query";
import { signup as signApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useSignup() {
  const { mutate: signup, isLoading } = useMutation({
    mutationFn: signApi,
    onSuccess: () => {
      toast.success(
        "A user has been created successfully! Please verify the new account from the user's email address"
      );
    },
    onError: () => {
      toast.error("Error to create a new user");
    },
  });

  return { signup, isLoading };
}
