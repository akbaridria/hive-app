import type { MarketOrder } from "@/app/types";
import { formatDistanceToNow } from "date-fns";
import EmptyOrder from "./empty-order";
import { useGetUserMarketOrders } from "@/api/query/pools";
import { useAppContext } from "@/app/context/app";
import { useAccount } from "wagmi";
import { formatCurrency } from "@/lib/utils";

const MarketOrder = () => {
  const { selectedPair } = useAppContext();
  const { address } = useAccount();
  const { data } = useGetUserMarketOrders(
    selectedPair?.address as string,
    address as string
  );

  if ((data || []).length === 0) return <EmptyOrder />;
  return (
    <div className="space-y-2">
      {(data || []).sort((a, b) => b.timestamp - a.timestamp).map((order, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-2 border-b border-dashed"
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium ${
                order.ordertype === "BUY" ? "text-green-500" : "text-red-500"
              }`}
            >
              {order.ordertype}
            </span>
            <span className="text-sm">
              {formatCurrency(Number(order.amount || 0))}{" "}
              {order.ordertype === "SELL"
                ? "IDRX"
                : selectedPair?.baseToken.symbol}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(order.timestamp * 1000, { addSuffix: true })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketOrder;
