"use client";

import BuyLimitOrder from "./place-buy-limit-order";
import SellLimitOrder from "./place-sell-limit-order";

const PlaceLimitOrder = () => {
  return (
    <div className="grid grid-cols-2 gap-8">
      <BuyLimitOrder />
      <SellLimitOrder />
    </div>
  );
};

export default PlaceLimitOrder;
