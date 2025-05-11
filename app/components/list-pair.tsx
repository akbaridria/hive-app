import { SearchInput } from "@/components/search-input";
import { TokenIcon } from "@/components/token-icon";
import { ResizablePanel } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DUMMY_LIST_TOKENS } from "../constant";

const ListPair = () => {
  return (
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
  );
};

export default ListPair;
