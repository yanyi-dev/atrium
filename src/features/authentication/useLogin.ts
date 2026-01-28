import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface useLoginProps {
  email: string;
  password: string;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: login, isLoading: isLogining } = useMutation({
    mutationFn: ({ email, password }: useLoginProps) =>
      loginApi({ email, password }),

    onSuccess: (data) => {
      //登陆的时候把数据存储，防止一到主页面又被踢出来
      queryClient.setQueryData(["user"], data.user);
      toast.success("Logining successfully");
      navigate("/dashboard", { replace: true });
    },
    onError: () => toast.error("Provided email or password are incorrect"),
  });

  return { login, isLogining };
}
