import type { MarketOrder } from "@/app/types";
import { formatDistanceToNow } from "date-fns";
import EmptyOrder from "./empty-order";

const orders: MarketOrder[] = [];

const MarketOrder = () => {
  if (orders.length === 0) return <EmptyOrder />;
  return (
    <div className="space-y-2">
      {orders.map((order, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-2 border-b border-dashed"
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium ${
                index % 2 === 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {index % 2 === 0 ? "BUY" : "SELL"}
            </span>
            <span className="text-sm">
              {(Math.random() * 0.01 + 10).toFixed(2)}
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
