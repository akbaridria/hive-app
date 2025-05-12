"use client";

import { ResizablePanel } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import LimitOrder from "./components/limit-order";
import MarketOrder from "./components/market-order";
import TabsOrder from "../tab-orders";

const OrderHistory = () => {
  return (
    <ResizablePanel>
      <ScrollArea className="h-full">
        <div className="h-full p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Trade History</h3>
          </div>
          <TabsOrder
            limitOrder={<LimitOrder />}
            marketOrder={<MarketOrder />}
          />
        </div>
      </ScrollArea>
    </ResizablePanel>
  );
};

export default OrderHistory;
