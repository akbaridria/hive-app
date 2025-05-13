import { useQuery } from "@tanstack/react-query";
import { fetchAllPools, fetchPoolById } from "@/api/endpoints/pools";
import { queryKeys } from "@/api/constant/query-keys";
import { PoolInfo } from "@/app/types";

const useGetAllPools = () => {
  return useQuery<PoolInfo[], Error>({
    queryKey: [queryKeys.POOLS],
    queryFn: fetchAllPools,
  });
};

const useGetPoolById = (id: string) => {
  return useQuery<PoolInfo, Error>({
    queryKey: [queryKeys.POOL(id)],
    queryFn: () => fetchPoolById(id),
    enabled: !!id,
  });
};

export { useGetAllPools, useGetPoolById };
