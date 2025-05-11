"use client";

import { ResizablePanelGroup, ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import ListPair from "./components/list-pair";
import OrderBook from "./components/order-book";
import PairInfo from "./components/pair-info";
import PlaceOrder from "./components/place-order";

const App = () => {
  return (
    <div className="hidden md:flex flex-col flex-1">
      <PairInfo />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ListPair />
        <ResizableHandle withHandle className="hidden md:flex" />
        <ResizablePanel defaultSize={50} className="hidden md:flex">
          <ResizablePanelGroup direction="vertical">
            <OrderBook />
            <ResizableHandle withHandle />
            <PlaceOrder />
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default App;
