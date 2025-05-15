import BuyMarketOrder from "./buy-market-order";
import SellLimitOrder from "./sell-market-order";

const PlaceMarketOrder = () => {
  return (
    <div className="grid grid-cols-2 gap-8">
      <BuyMarketOrder />
      <SellLimitOrder />
    </div>
  );
};

export default PlaceMarketOrder;
