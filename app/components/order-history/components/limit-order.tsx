"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  XCircleIcon,
  ArrowDownUp,
} from "lucide-react";
import EmptyOrder from "./empty-order";
import { useGetUserLimitOrders } from "@/api/query/pools";
import { useAppContext } from "@/app/context/app";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/app/types";
import { toast } from "sonner";
import abiHiveCore from "@/config/abis/hive-core.json";

const LimitOrder = () => {
  const [txHash, setTxHash] = useState<string>("");
  const { selectedPair } = useAppContext();
  const { address } = useAccount();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { writeContract, isPending } = useWriteContract();

  const { data, refetch } = useGetUserLimitOrders(
    selectedPair?.address as string,
    address as string
  );

  const { isLoading } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
    confirmations: 1,
    query: {
      select(data) {
        if (data.status === "success") {
          toast.success("Place market order successfully.");
          setIsDialogOpen(false);
          refetch();
        } else {
          toast.error("Failed to place market order.");
        }
        setTxHash("");
      },
    },
  });

  const handleCancelOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const confirmCancelOrder = async () => {
    try {
      writeContract(
        {
          address: selectedPair?.address as `0x${string}`,
          abi: abiHiveCore,
          functionName: "cancelOrder",
          args: [selectedOrder?.id],
        },
        {
          onSuccess: (hash) => {
            setTxHash(hash);
          },
          onError: (error) => {
            toast.error(
              `Error to place market order: ${error.message || "Unknown"}`
            );
          },
        }
      );
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const sortedData = data
    ? [...data].sort((a, b) => {
        if (sortDirection === "asc") {
          return a.timestamp - b.timestamp;
        } else {
          return b.timestamp - a.timestamp;
        }
      })
    : [];

  if (sortedData?.length === 0) return <EmptyOrder />;

  return (
    <>
      <div className="grid grid-cols-12 gap-2 px-2 py-2 text-xs font-medium text-muted-foreground border-b">
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-2">Amount</div>
        <div className="col-span-2">Filled</div>
        <div className="col-span-2">Remaining</div>
        <div
          className="col-span-2 text-right flex items-center justify-end cursor-pointer group"
          onClick={toggleSortDirection}
        >
          <span>Time</span>
          <ArrowDownUp className="h-3.5 w-3.5 ml-1 opacity-70 group-hover:opacity-100" />
        </div>
      </div>

      <div className="space-y-1 mt-2">
        {sortedData?.map((order) => (
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
            <div className="col-span-2 flex items-center justify-end gap-2">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(order.timestamp * 1000, {
                  addSuffix: true,
                })}
              </span>
              {order.active && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-red-100 hover:text-red-500"
                  onClick={() => handleCancelOrder(order)}
                >
                  <XCircleIcon className="h-4 w-4" />
                  <span className="sr-only">Cancel order</span>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium">Type:</div>
                <div
                  className={
                    selectedOrder.orderType === "BUY"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {selectedOrder.orderType}
                </div>

                <div className="font-medium">Price:</div>
                <div>{formatCurrency(Number(selectedOrder.price || 0))}</div>

                <div className="font-medium">Amount:</div>
                <div>{formatCurrency(Number(selectedOrder.amount || 0))}</div>

                <div className="font-medium">Remaining:</div>
                <div>{selectedOrder.remainingAmount}</div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isPending || isLoading}
            >
              Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancelOrder}
              disabled={isPending || isLoading}
            >
              {isPending || isLoading ? "Cancelling..." : "Cancel Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LimitOrder;
