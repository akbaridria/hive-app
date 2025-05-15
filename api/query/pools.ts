import { useQuery } from "@tanstack/react-query";
import {
  fetchAllPools,
  fetchOrderbookById,
  fetchPoolById,
  fetchUserLimitOrders,
  fetchUserMarketOrders,
  getAmountOut,
} from "@/api/endpoints/pools";
import { queryKeys } from "@/api/constant/query-keys";
import {
  AmountOutResult,
  MarketOrder,
  Order,
  OrderBook,
  OrderType,
  PoolInfo,
} from "@/app/types";

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
    refetchInterval: 5000,
  });
};

const useGetUserLimitOrders = (id: string, trader: string) => {
  return useQuery<Order[], Error>({
    queryKey: [queryKeys.USER_LIMIT_ORDERS(id, trader)],
    queryFn: () => fetchUserLimitOrders(id, trader),
    refetchInterval: 5000,
  });
};

const useGetAmountOut = (
  poolId: string,
  orderType: OrderType,
  amount: string
) => {
  return useQuery<AmountOutResult, Error>({
    queryKey: [queryKeys.GET_AMOUNT_OUT],
    queryFn: () => getAmountOut(poolId, orderType, amount),
    enabled: !!amount,
  });
};

const useGetUserMarketOrders = (poolId: string, trader: string) => {
  return useQuery<MarketOrder[], Error>({
    queryKey: [queryKeys.USER_MARKET_ORDERS(poolId, trader)],
    queryFn: () => fetchUserMarketOrders(poolId, trader),
    enabled: !!poolId && !!trader,
    refetchInterval: 5000,
  });
};

export {
  useGetAllPools,
  useGetPoolById,
  useGetOrderBook,
  useGetUserLimitOrders,
  useGetAmountOut,
  useGetUserMarketOrders,
};
