import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";

export function useCabins() {
  const {
    data: cabins,
    isLoading,
    error,
  } = useQuery({
    //缓存的key，辨别缓存的内容
    queryKey: ["cabin"],
    //数据获取函数，需要返回一个promise
    queryFn: getCabins,
  });
  return { cabins, isLoading, error };
}
