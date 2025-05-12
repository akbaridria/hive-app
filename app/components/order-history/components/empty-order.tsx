import { HistoryIcon } from "lucide-react";

const EmptyOrder = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-muted p-2 mb-4">
        <HistoryIcon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-1">No trade history</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        There are no trades to display at the moment. Trades will appear here
        once they are executed.
      </p>
    </div>
  );
};
export default EmptyOrder;
