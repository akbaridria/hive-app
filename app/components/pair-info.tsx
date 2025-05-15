import { TokenIcon } from "@/components/token-icon";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { useAppContext } from "../context/app";
import { useCallback, useEffect, useMemo, useState } from "react";
import { setItem } from "@/lib/local-storage";
import { formatCurrency } from "@/lib/utils";

const PairInfo = () => {
  const { selectedPair } = useAppContext();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToFavorites = useCallback((id: string) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (!favorites.includes(id)) {
      favorites.push(id);
      setItem("favorites", favorites);
      setIsFavorite(true);
      return;
    }
    const newFavorites = favorites.filter((item: string) => item !== id);
    setItem("favorites", newFavorites);
    setIsFavorite(false);
    return;
  }, []);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (selectedPair) {
      setIsFavorite(favorites.includes(selectedPair.address));
    }
  }, [selectedPair]);

  const pairName = useMemo(
    () =>
      `${selectedPair?.baseToken?.symbol} / ${selectedPair?.quoteToken?.symbol}`,
    [selectedPair]
  );
  return (
    <div className="border-b border-dashed p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TokenIcon address={selectedPair?.baseToken?.address || ""} />
          <div className="font-semibold tracking-wider text-sm">{pairName}</div>
          <Button
            variant={isFavorite ? "secondary" : "outline"}
            size="icon"
            className="w-6 h-6"
            onClick={() => {
              if (!selectedPair) return;
              handleAddToFavorites(selectedPair.address);
            }}
          >
            <StarIcon stroke={isFavorite ? 'transparent' : 'gray'} fill={isFavorite ? 'white' : 'transparent'} />
          </Button>
        </div>
        <div>
          <div className="text-xs text-right">Latest Price</div>
          <div className=" font-bold tracking-wider text-right">
            {formatCurrency(Number(selectedPair?.latestPrice || 0))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PairInfo;
