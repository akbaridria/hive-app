import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import EmptyOrder from "./empty-order";
import { Order } from "@/app/types";

const orders: Order[] = [];

const LimitOrder = () => {
  if (orders.length === 0) return <EmptyOrder />;
  return (
    <>
      <div className="grid grid-cols-12 gap-2 px-2 py-2 text-xs font-medium text-muted-foreground border-b">
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-2">Amount</div>
        <div className="col-span-2">Filled</div>
        <div className="col-span-2">Remaining</div>
        <div className="col-span-2 text-right">Time</div>
      </div>

      <div className="space-y-1 mt-2">
        {orders.map((order) => (
          <div
            key={order.id}
            className="grid grid-cols-12 gap-2 px-2 py-2 text-sm rounded-md hover:bg-muted/50 transition-colors"
          >
            <div className="col-span-2 flex items-center gap-1.5">
              {order.orderType === "BUY" ? (
                <ArrowUpIcon className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <ArrowDownIcon className="h-3.5 w-3.5 text-red-500" />
              )}
              <span
                className={
                  order.orderType === "BUY" ? "text-green-500" : "text-red-500"
                }
              >
                {order.orderType}
              </span>
            </div>
            <div className="col-span-2 font-medium">{order.price}</div>
            <div className="col-span-2">{order.amount}</div>
            <div className="col-span-2">{order.filled}</div>
            <div className="col-span-2 flex items-center gap-2">
              {order.remainingAmount}
              {order.active && (
                <Badge variant="outline" className="h-5 px-1 text-xs">
                  Active
                </Badge>
              )}
            </div>
            <div className="col-span-2 text-xs text-muted-foreground text-right">
              {formatDistanceToNow(order.timestamp * 1000, { addSuffix: true })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LimitOrder;
