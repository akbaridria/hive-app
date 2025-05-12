import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import PlaceOrder from "./components/place-order";
import OrderBookChart from "./components/orderbook";

const OrderBook = () => {
  return (
    <ResizablePanel defaultSize={50}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={75}>
          <PlaceOrder />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25}>
          <OrderBookChart />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  );
};

export default OrderBook;
