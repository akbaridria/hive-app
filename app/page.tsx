import { SearchInput } from "@/components/search-input";
import { TokenIcon } from "@/components/token-icon";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StarIcon } from "lucide-react";

const DUMMY_LIST_TOKENS = [
  {
    id: 1,
    pairName: "BTC/IDRX",
    latestPrice: "10,000.34",
    isFavorite: false,
    icon: "btc",
  },
  {
    id: 2,
    pairName: "ETH/IDRX",
    latestPrice: "2,845.67",
    isFavorite: true,
    icon: "eth",
  },
  {
    id: 3,
    pairName: "SOL/IDRX",
    latestPrice: "123.45",
    isFavorite: false,
    icon: "sol",
  },
  {
    id: 4,
    pairName: "ADA/IDRX",
    latestPrice: "0.56",
    isFavorite: true,
    icon: "ada",
  },
  {
    id: 5,
    pairName: "DOT/IDRX",
    latestPrice: "7.89",
    isFavorite: false,
    icon: "dot",
  },
  {
    id: 6,
    pairName: "XRP/IDRX",
    latestPrice: "0.78",
    isFavorite: true,
    icon: "xrp",
  },
  {
    id: 7,
    pairName: "AVAX/IDRX",
    latestPrice: "35.67",
    isFavorite: false,
    icon: "avax",
  },
  {
    id: 8,
    pairName: "MATIC/IDRX",
    latestPrice: "0.89",
    isFavorite: true,
    icon: "matic",
  },
  {
    id: 9,
    pairName: "LINK/IDRX",
    latestPrice: "15.23",
    isFavorite: false,
    icon: "link",
  },
  {
    id: 10,
    pairName: "UNI/IDRX",
    latestPrice: "5.67",
    isFavorite: true,
    icon: "uni",
  },
];

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Mobile message */}
      <div className="md:hidden flex flex-col items-center justify-center h-screen">
        Mobile view is not supported yet
        <div className="text-sm text-muted-foreground">
          Please use a desktop browser for the full experience.
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:flex flex-col flex-1">
        <div className="border-b border-dashed p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TokenIcon address="btc" />
              <div className="font-semibold tracking-wider text-sm">
                BTC/IDRX
              </div>
              <Button variant="outline" size="icon" className="w-6 h-6">
                <StarIcon />
              </Button>
            </div>
            <div>
              <div className="text-xs text-right">Latest Price</div>
              <div className=" font-bold tracking-wider">10,000.34</div>
            </div>
          </div>
        </div>
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={20}>
            <div className="p-4 border-b border-dashed">
              <SearchInput placeholder="Search tokens" className="!text-xs" />
              <div className="flex items-center gap-4 mt-4 text-xs">
                <div className="cursor-pointer hover:text-foreground transition-colors text-muted-foreground">
                  Favorites
                </div>
                <div className="cursor-pointer text-foreground transition-colors">
                  All
                </div>
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh_-_243px)] overflow-y-auto">
              {Array.from({ length: 10 }, () => DUMMY_LIST_TOKENS)
                .flat()
                .map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-4 border-b border-dashed cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <TokenIcon address={item.icon} />
                        <div className="font-semibold tracking-wider text-sm">
                          {item.pairName}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-right">Latest Price</div>
                        <div className=" font-bold tracking-wider text-right">
                          {item.latestPrice}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle withHandle className="hidden md:flex" />
          <ResizablePanel defaultSize={50} className="hidden md:flex">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={50}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">This is order book</span>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
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
                                index % 2 === 0
                                  ? "text-green-500"
                                  : "text-red-500"
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
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
