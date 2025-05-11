import { ResizablePanel } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";

const PlaceOrder = () => {
  return (
    <ResizablePanel defaultSize={50}>
      <ScrollArea className="h-full overflow-y-auto">
        <div className="h-full p-4">
          <h3 className="font-semibold mb-4">Trade History</h3>
          <div className="space-y-2">
            {Array.from({ length: 20 }).map((_, index) => (
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
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </ResizablePanel>
  );
};

export default PlaceOrder;
