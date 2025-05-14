import CurrencyInput from "@/app/components/currency-input";
import { useAppContext } from "@/app/context/app";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useMemo } from "react";
import { erc20Abi } from "viem";
import { useAccount, useReadContracts } from "wagmi";

const SellLimitOrder = () => {
  const { selectedPair } = useAppContext();
  const { address } = useAccount();

  const result = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        address: selectedPair?.baseToken.address as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address!],
      },
      {
        address: selectedPair?.baseToken.address as `0x${string}`,
        abi: erc20Abi,
        functionName: "decimals",
      },
    ],
  });

  const baseBalance = useMemo(() => {
    if (result?.data?.[0]?.result && result?.data?.[1]?.result) {
      const balance = BigInt(result.data[0].result);
      const decimals = Number(result.data[1].result);
      return Number(balance) / Math.pow(10, decimals);
    }
    return 0;
  }, [result.data]);
  return (
    <div className="space-y-4">
      <CurrencyInput label="Price" placeholder="0.00" currency="IDRX" />
      <CurrencyInput
        label="Amount"
        placeholder="0.00"
        currency={selectedPair?.baseToken?.symbol}
      />
      <div className="text-xs space-y-1">
        <div>
          <span className="text-muted-foreground">Avaialble Balance </span>
          <span>
            {formatCurrency(baseBalance)} {selectedPair?.baseToken?.symbol}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Total IDRX amount </span>
          <span>0 {selectedPair?.baseToken?.symbol}</span>
        </div>
      </div>
      <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
        Sell
      </Button>
    </div>
  );
};

export default SellLimitOrder;
