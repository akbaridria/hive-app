import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import EmptyOrder from "./empty-order";
import { useGetUserLimitOrders } from "@/api/query/pools";
import { useAppContext } from "@/app/context/app";
import { useAccount } from "wagmi";
import { formatCurrency } from "@/lib/utils";

const LimitOrder = () => {
  const { selectedPair } = useAppContext();
  const { address } = useAccount();

  const { data } = useGetUserLimitOrders(
    selectedPair?.address as string,
    address as string
  );

  console.log("data", data);

  if (data?.length === 0) return <EmptyOrder />;
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
        {data?.map((order) => (
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
            <div className="col-span-2 font-medium">
              {formatCurrency(Number(order.price || 0))}
            </div>
            <div className="col-span-2">
              {formatCurrency(Number(order.amount || 0))}
            </div>
            <div className="col-span-2">
              {formatCurrency(Number(order.filled || 0))}
            </div>
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
