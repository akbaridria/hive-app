"use client";

import type React from "react";

import { SearchInput } from "@/components/search-input";
import { TokenIcon } from "@/components/token-icon";
import { ResizablePanel } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PoolInfo } from "../types";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/app";
import { cn, formatCurrency } from "@/lib/utils";
import { useDebounce } from "@uidotdev/usehooks";
import { SearchX, Star, Coins } from "lucide-react";
import { getItem } from "@/lib/local-storage";

const tabs = ["Favorites", "All"];

interface ListPairProps {
  listPools: PoolInfo[];
}

const ListPair: React.FC<ListPairProps> = ({ listPools }) => {
  const { selectedPair, setSelectedPair } = useAppContext();
  const [searchPair, setSearchPair] = useState("");
  const [selectedTab, setSelectedTab] = useState(tabs[1]);
  const search = useDebounce(searchPair, 500);

  const filteredPools = listPools.filter(
    (item) => {
      return (
        item.baseToken.symbol.toLowerCase().includes(search.toLowerCase()) ||
        item.quoteToken.symbol.toLowerCase().includes(search.toLowerCase())
      );
    },
    [search]
  );

  const displayedPools = useMemo(() => {
    const listFavorites = getItem<string[]>("favorites") || [];
    return selectedTab === "Favorites"
      ? filteredPools.filter((item) => listFavorites.includes(item.address))
      : filteredPools;
  }, [filteredPools, selectedTab]);

  useEffect(() => {
    if (!selectedPair && listPools.length > 0) {
      setSelectedPair(listPools[0]);
    }
  }, [listPools, selectedPair, setSelectedPair]);

  return (
    <ResizablePanel defaultSize={20}>
      <div className="p-4 border-b border-dashed">
        <SearchInput
          placeholder="Search tokens"
          className="!text-xs"
          onChange={(v) => {
            setSearchPair(v.target.value);
          }}
          value={searchPair}
        />
        <div className="flex items-center gap-4 mt-4 text-xs">
          {tabs.map((tab) => (
            <div
              key={tab}
              className={cn(
                "cursor-pointer hover:text-foreground transition-colors",
                { "text-foreground": selectedTab === tab },
                { "text-muted-foreground": selectedTab !== tab }
              )}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh_-_243px)] overflow-y-auto">
        {displayedPools.length > 0 ? (
          displayedPools
            .sort((a, b) => Number(b.latestPrice) - Number(a.latestPrice))
            .map((item, index) => {
              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between py-2 px-4 border-b border-dashed cursor-pointer hover:bg-accent/50 transition-colors",
                    {
                      "bg-accent/50":
                        !!selectedPair &&
                        selectedPair.baseToken.address ===
                          item.baseToken.address,
                    }
                  )}
                  onClick={() => setSelectedPair(item)}
                >
                  <div className="flex items-center gap-2">
                    <TokenIcon address={item.baseToken.address} />
                    <div className="font-semibold tracking-wider text-sm">
                      {item.baseToken.symbol} / {item.quoteToken.symbol}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-right">Latest Price</div>
                    <div className="font-bold tracking-wider text-right">
                      {formatCurrency(Number(item.latestPrice))}
                    </div>
                  </div>
                </div>
              );
            })
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            {search ? (
              <>
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <SearchX className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-base mb-1">No results found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  No tokens match your search &quot;{search}&quot;
                </p>
                <button
                  className="text-xs text-primary hover:underline"
                  onClick={() => setSearchPair("")}
                >
                  Clear search
                </button>
              </>
            ) : selectedTab === "Favorites" ? (
              <>
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-base mb-1">No favorites yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add pairs to your favorites to see them here
                </p>
                <button
                  className="text-xs text-primary hover:underline"
                  onClick={() => setSelectedTab("All")}
                >
                  Browse all pairs
                </button>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Coins className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-base mb-1">
                  No pairs available
                </h3>
                <p className="text-sm text-muted-foreground">
                  There are no trading pairs available at the moment
                </p>
              </>
            )}
          </div>
        )}
      </ScrollArea>
    </ResizablePanel>
  );
};

export default ListPair;
