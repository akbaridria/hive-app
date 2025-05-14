import { useQuery } from "@tanstack/react-query";
import {
  fetchAllPools,
  fetchOrderbookById,
  fetchPoolById,
  fetchUserLimitOrders,
} from "@/api/endpoints/pools";
import { queryKeys } from "@/api/constant/query-keys";
import { Order, OrderBook, PoolInfo } from "@/app/types";

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

const useGetOrderBook = (id: string) => {
  return useQuery<OrderBook, Error>({
    queryKey: [queryKeys.ORDERBOOK(id)],
    queryFn: () => fetchOrderbookById(id),
    enabled: !!id,
  });
};

const useGetUserLimitOrders = (id: string, trader: string) => {
  return useQuery<Order[], Error>({
    queryKey: [queryKeys.USER_LIMIT_ORDERS(id, trader)],
    queryFn: () => fetchUserLimitOrders(id, trader),
    // enabled: !!id && !!trader,
  });
};

export {
  useGetAllPools,
  useGetPoolById,
  useGetOrderBook,
  useGetUserLimitOrders,
};
