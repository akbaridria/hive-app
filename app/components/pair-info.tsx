import { TokenIcon } from "@/components/token-icon";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";

const PairInfo = () => {
  return (
    <div className="border-b border-dashed p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TokenIcon address="btc" />
          <div className="font-semibold tracking-wider text-sm">BTC/IDRX</div>
          <Button variant="outline" size="icon" className="w-6 h-6">
            <StarIcon />
          </Button>
        </div>
        <div>
          <div className="text-xs text-right">Latest Price</div>
          <div className=" font-bold tracking-wider">10,000.34</div>
        </div>
      </div>
    </div>
  );
};

export default PairInfo;
