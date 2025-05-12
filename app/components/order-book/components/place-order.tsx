import TabsOrder from "../../tab-orders";
import PlaceLimitOrder from "./place-limit-order";
import PlaceMarketOrder from "./place-market-order";

const PlaceOrder = () => {
  return (
    <div className="space-y-4 h-full p-4">
      <h3 className="text-lg font-semibold">Place Order</h3>
      <TabsOrder
        limitOrder={<PlaceLimitOrder />}
        marketOrder={<PlaceMarketOrder />}
      />
    </div>
  );
};

export default PlaceOrder;
