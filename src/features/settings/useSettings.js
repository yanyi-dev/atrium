import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../services/apiSettings";

export function useSettings() {
  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["settings"],
    //数据获取函数，需要返回一个promise
    queryFn: getSettings,
  });

  return { settings, isLoading, error };
}
