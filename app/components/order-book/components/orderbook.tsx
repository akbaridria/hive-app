"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo } from "react";

const dummyOrderBook = {
  baseToken: {
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    address: "0xBaseTokenAddress",
  },
  quoteToken: {
    symbol: "USDT",
    name: "Tether",
    decimals: 6,
    address: "0xQuoteTokenAddress",
  },
  latestPrice: "2000",
  bids: [
    { price: "1995", orders: [], totalVolume: "10" },
    { price: "1990", orders: [], totalVolume: "15" },
    { price: "1985", orders: [], totalVolume: "20" },
    { price: "1980", orders: [], totalVolume: "25" },
    { price: "1975", orders: [], totalVolume: "30" },
    { price: "1970", orders: [], totalVolume: "35" },
    { price: "1965", orders: [], totalVolume: "40" },
    { price: "1960", orders: [], totalVolume: "45" },
    { price: "1955", orders: [], totalVolume: "50" },
    { price: "1950", orders: [], totalVolume: "55" },
  ],
  asks: [
    { price: "2005", orders: [], totalVolume: "12" },
    { price: "2010", orders: [], totalVolume: "18" },
    { price: "2015", orders: [], totalVolume: "24" },
    { price: "2020", orders: [], totalVolume: "30" },
    { price: "2025", orders: [], totalVolume: "36" },
    { price: "2030", orders: [], totalVolume: "42" },
    { price: "2035", orders: [], totalVolume: "48" },
    { price: "2040", orders: [], totalVolume: "54" },
    { price: "2045", orders: [], totalVolume: "60" },
    { price: "2050", orders: [], totalVolume: "66" },
  ],
};

const OrderBook = () => {
  const maxBidVolume = useMemo(() => {
    return Math.max(
      ...dummyOrderBook.bids.map((bid) => Number.parseFloat(bid.totalVolume))
    );
  }, []);

  const maxAskVolume = useMemo(() => {
    return Math.max(
      ...dummyOrderBook.asks.map((ask) => Number.parseFloat(ask.totalVolume))
    );
  }, []);

  return (
    <div className="h-full p-4 space-y-4">
      <h3 className="text-lg font-semibold">Order Book</h3>
      <ScrollArea className="h-[calc(100%_-_30px)] overflow-y-auto">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Price(IDRX)</div>
            <div className="text-muted-foreground text-right">Amount(BTC)</div>
          </div>
          {dummyOrderBook.bids.map((bid, index) => {
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
                <div className="text-green-500 relative z-10">{bid.price}</div>
                <div className="text-right relative z-10">
                  {bid.totalVolume}
                </div>
              </div>
            );
          })}
          <div className="text-lg font-semibold">1990</div>
          {dummyOrderBook.asks.map((ask, index) => {
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
                <div className="text-red-500 relative z-10">{ask.price}</div>
                <div className="text-right relative z-10">
                  {ask.totalVolume}
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
