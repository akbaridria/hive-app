import { Button } from "@/components/ui/button";
import InputWithAddon from "../../input-with-addon";

const PlaceLimitOrder = () => {
  return (
    <div className="grid grid-cols-2 gap-8">
      <BuyLimitOrder />
      <SellLimitOrder />
    </div>
  );
};

const BuyLimitOrder = () => {
  return (
    <div className="space-y-4">
      <InputWithAddon
        label="Price"
        placeholder="0.00"
        type="text"
        suffix="IDRX"
      />
      <InputWithAddon
        label="Amount"
        placeholder="0.00"
        type="text"
        suffix="BTC"
      />
      <div className="text-xs space-y-1">
        <div>
          <span className="text-muted-foreground">Avaialble Balance </span>
          <span>100 IDRX</span>
        </div>
        <div>
          <span className="text-muted-foreground">Total IDRX amount </span>
          <span>0 IDRX</span>
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
        label="Price"
        placeholder="0.00"
        type="text"
        suffix="IDRX"
      />
      <InputWithAddon
        label="Amount"
        placeholder="0.00"
        type="text"
        suffix="BTC"
      />
      <div className="text-xs space-y-1">
        <div>
          <span className="text-muted-foreground">Avaialble Balance </span>
          <span>100 BTC</span>
        </div>
        <div>
          <span className="text-muted-foreground">Total IDRX amount </span>
          <span>0 BTC</span>
        </div>
      </div>
      <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
        Sell
      </Button>
    </div>
  );
};

export default PlaceLimitOrder;
