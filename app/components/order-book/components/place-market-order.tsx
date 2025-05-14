import { Button } from "@/components/ui/button";
import InputWithAddon from "../../currency-input";

const PlaceMarketOrder = () => {
  return (
    <div className="grid grid-cols-2 gap-8">
      <BuyMarketOrder />
      <SellLimitOrder />
    </div>
  );
};

const BuyMarketOrder = () => {
  return (
    <div className="space-y-4">
      <InputWithAddon
        label="From amount"
        placeholder="0.00"
      />
      <InputWithAddon
        label="To amount"
        placeholder="0.00"
        disabled={true}
      />
      <div className="text-xs space-y-1">
        <div>
          <span className="text-muted-foreground">Avaialble Balance </span>
          <span>100 IDRX</span>
        </div>
      </div>
      <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
        Buy
      </Button>
    </div>
  );
};

const SellLimitOrder = () => {
  return (
    <div className="space-y-4">
      <InputWithAddon
        label="From amount"
        placeholder="0.00"
      />
      <InputWithAddon
        label="To amount"
        placeholder="0.00"
      />
      <div className="text-xs space-y-1">
        <div>
          <span className="text-muted-foreground">Avaialble Balance </span>
          <span>100 BTC</span>
        </div>
      </div>
      <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
        Sell
      </Button>
    </div>
  );
};

export default PlaceMarketOrder;
