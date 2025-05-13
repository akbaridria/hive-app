import { apiClient } from "../client";

const fetchAllPools = () => apiClient.get("/pools").then((res) => res.data);
const fetchPoolById = (id: string) =>
  apiClient.get(`/pools/${id}`).then((res) => res.data);
const fetchOrderbookById = (id: string) =>
  apiClient.get(`/pools/${id}/orderbook`).then((res) => res.data);
const fetchOrderById = (poolId: string, orderId: string) =>
  apiClient.get(`/pools/${poolId}/orders/${orderId}`).then((res) => res.data);
const fetchUserLimitOrders = (poolId: string, trader: string) =>
  apiClient.get(`/pools/${poolId}/${trader}/user`).then((res) => res.data);
const fetchUserMarketOrders = (poolId: string, trader: string) =>
  apiClient
    .get(`/pools/${poolId}/${trader}/market-orders`)
    .then((res) => res.data);
const getAmountOut = (poolId: string, orderType: string, amount: string) =>
  apiClient
    .get(`/pools/${poolId}/get-amount-out`, {
      params: {
        orderType,
        amount,
      },
    })
    .then((res) => res.data);

export {
  fetchAllPools,
  fetchPoolById,
  fetchOrderbookById,
  fetchOrderById,
  fetchUserLimitOrders,
  fetchUserMarketOrders,
  getAmountOut,
};
