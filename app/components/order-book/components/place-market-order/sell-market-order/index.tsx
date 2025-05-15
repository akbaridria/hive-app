import { useGetAmountOut } from "@/api/query/pools";
import CurrencyInput from "@/app/components/currency-input";
import { useAppContext } from "@/app/context/app";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useMemo, useState } from "react";
import { erc20Abi } from "viem";
import { useAccount, useReadContract } from "wagmi";
import ModalConfirmationTx from "./modal-confirm-tx";
import { formatCurrency } from "@/lib/utils";

const SellMarketOrder = () => {
  const { selectedPair } = useAppContext();
  const { address } = useAccount();
  const [amount, setAmount] = useState<number | null>(null);
  const debouncedAmount = useDebounce(amount, 500);
  const { data, refetch } = useGetAmountOut(
    selectedPair?.address as `0x${string}`,
    "SELL",
    String(debouncedAmount || 0)
  );

  useEffect(() => {
    if (data?.isError) {
      setAmount(null);
    }
  }, [data?.isError]);

  const balance = useReadContract({
    address: selectedPair?.baseToken.address as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address!],
    query: {
      refetchInterval: 3000,
    },
  });

  const baseAmount = useMemo(() => {
    return balance.data
      ? Number(balance.data) /
          Math.pow(10, selectedPair?.baseToken?.decimals || 0)
      : 0;
  }, [balance.data, selectedPair?.baseToken?.decimals]);

  useEffect(() => {
    if (debouncedAmount) {
      refetch();
    }
  }, [debouncedAmount, refetch]);

  return (
    <div className="space-y-4">
      <CurrencyInput
        label="From amount"
        placeholder="0.00"
        currency={selectedPair?.baseToken.symbol}
        onChange={(e) => setAmount(e)}
      />
      <CurrencyInput
        label="To amount"
        placeholder={data?.outputAmount}
        disabled={true}
        currency="IDRX"
      />
      <div className="text-xs space-y-1">
        <div>
          <span className="text-muted-foreground">Avaialble Balance </span>
          <span>{formatCurrency(baseAmount)} {selectedPair?.baseToken?.symbol}</span>
        </div>
      </div>
      <ModalConfirmationTx
        amount={debouncedAmount}
        baseDecimal={selectedPair?.baseToken?.decimals || 0}
        prices={(data?.prices || []).map((item) => Number(item))}
        quoteDecimal={selectedPair?.quoteToken?.decimals || 0}
        toAmount={Number(data?.outputAmount || 0)}
      />
    </div>
  );
};

export default SellMarketOrder;
