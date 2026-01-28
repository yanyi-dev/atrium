import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

//useUserhook和getCurrentUser函数即确保了登陆期间的合法性，以及各个设备的同步性，也确保了用户许久未登录时可以通过本地登陆数据做到一键登陆
export function useUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  return { isLoading, user, isAuthenticated: user?.role === "authenticated" };
}
