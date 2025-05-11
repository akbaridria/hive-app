import { ResizablePanel } from "@/components/ui/resizable";

const OrderBook = () => {
  return (
    <ResizablePanel defaultSize={50}>
      <div className="flex h-full items-center justify-center p-6">
        <span className="font-semibold">This is order book</span>
      </div>
    </ResizablePanel>
  );
};

export default OrderBook;
