export const queryKeys = {
  ALL: "all",
  POOLS: "pools",
  POOL: (id: string) => ["pool", id],
  ORDERBOOK: (id: string) => ["orderbook", id],
  ORDER: (poolId: string, orderId: string) => ["order", poolId, orderId],
  USER_LIMIT_ORDERS: (poolId: string, trader: string) => [
    "user-limit-orders",
    poolId,
    trader,
  ],
  USER_MARKET_ORDERS: (poolId: string, trader: string) => [
    "user-market-orders",
    poolId,
    trader,
  ],
  GET_AMOUNT_OUT: (poolId: string, orderType: string, amount: string) => [
    "get-amount-out",
    poolId,
    orderType,
    amount,
  ],
};
