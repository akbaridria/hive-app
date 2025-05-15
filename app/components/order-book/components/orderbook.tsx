"use client";

import { useGetOrderBook } from "@/api/query/pools";
import { useAppContext } from "@/app/context/app";
import type { OrderBook } from "@/app/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/lib/utils";
import { BarChart3 } from "lucide-react";
import { useMemo } from "react";

const OrderBook = () => {
  const { selectedPair } = useAppContext();
  const { data } = useGetOrderBook(selectedPair?.address || "");

  const maxBidVolume = useMemo(() => {
    return Math.max(
      ...(data?.bids || []).map((bid) => Number.parseFloat(bid.totalVolume))
    );
  }, [data]);

  const maxAskVolume = useMemo(() => {
    return Math.max(
      ...(data?.asks || []).map((ask) => Number.parseFloat(ask.totalVolume))
    );
  }, [data]);

  const EmptyOrderBook = () => (
    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="bg-muted/30 rounded-full p-2 w-10 h-10 flex items-center justify-center">
        <BarChart3 className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h4 className="text-lg font-medium">No Order Book Data</h4>
        <p className="text-sm text-muted-foreground max-w-[250px]">
          There are currently no orders in the order book for this trading pair.
        </p>
      </div>
    </div>
  );

  if (!data?.bids.length && !data?.asks.length) {
    return <EmptyOrderBook />;
  }

  return (
    <div className="h-full p-4 space-y-4">
      <h3 className="text-lg font-semibold">Order Book</h3>
      <ScrollArea className="h-[calc(100%_-_30px)] overflow-y-auto">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Price(IDRX)</div>
            <div className="text-muted-foreground text-right">Amount({selectedPair?.baseToken?.symbol})</div>
          </div>
          {data.bids.map((bid, index) => {
            const volumePercentage =
              (Number.parseFloat(bid.totalVolume) / maxBidVolume) * 100;

            return (
              <div
                key={index}
                className="grid grid-cols-2 gap-2 text-sm relative"
              >
                <div
                  className="absolute inset-0 bg-green-500/20 z-0"
                  style={{ width: `${volumePercentage}%` }}
                />
                <div className="text-green-500 relative z-10">
                  {formatCurrency(Number(bid.price || 0))}
                </div>
                <div className="text-right relative z-10">
                  {formatCurrency(Number(bid.totalVolume || 0))}
                </div>
              </div>
            );
          })}
          <div className="text-lg font-semibold">
            {formatCurrency(Number(data.latestPrice || 0))}
          </div>
          {data.asks.map((ask, index) => {
            const volumePercentage =
              (Number.parseFloat(ask.totalVolume) / maxAskVolume) * 100;

            return (
              <div
                key={index}
                className="grid grid-cols-2 gap-2 text-sm relative"
              >
                <div
                  className="absolute inset-0 bg-red-500/20 z-0"
                  style={{ width: `${volumePercentage}%` }}
                />
                <div className="text-red-500 relative z-10">
                  {formatCurrency(Number(ask.price || 0))}
                </div>
                <div className="text-right relative z-10">
                  {formatCurrency(Number(ask.totalVolume || 0))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default OrderBook;
