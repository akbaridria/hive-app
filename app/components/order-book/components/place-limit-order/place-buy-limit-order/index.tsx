import CurrencyInput from "@/app/components/currency-input";
import { useAppContext } from "@/app/context/app";
import { formatCurrency } from "@/lib/utils";
import { useState, useMemo, useEffect } from "react";
import { erc20Abi } from "viem";

import { useAccount, useReadContracts } from "wagmi";
import ModalConfirmationTx from "./modal-confirm-tx";

const BuyLimitOrder = () => {
  const { selectedPair } = useAppContext();
  const { address } = useAccount();

  const [price, setPrice] = useState<number | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [total, setTotal] = useState<{
    original: number;
    display: number;
  } | null>(null);

  const result = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        address: selectedPair?.quoteToken.address as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address!],
      },
      {
        address: selectedPair?.quoteToken.address as `0x${string}`,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: selectedPair?.baseToken.address as `0x${string}`,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: selectedPair?.quoteToken.address as `0x${string}`,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address!, selectedPair?.address as `0x${string}`],
      },
    ],
  });

  useMemo(() => {
    if (!result?.data?.[3]?.result) return 0;
    return Number(result.data[3].result);
  }, [result]);

  const irdxBalance = useMemo(() => {
    if (result?.data?.[0]?.result && result?.data?.[1]?.result) {
      const balance = BigInt(result.data[0].result);
      const decimals = Number(result.data[1].result);
      return Number(balance) / Math.pow(10, decimals);
    }
    return 0;
  }, [result.data]);

  useEffect(() => {
    if (price && amount && result?.data?.[1].result) {
      setTotal({
        original: amount * price * 10 ** result.data[1].result,
        display: amount * price,
      });
      return;
    }
  }, [amount, price, result.data]);

  return (
    <div className="space-y-4">
      <CurrencyInput
        label="Price"
        placeholder="0.00"
        currency="IDRX"
        onChange={(e) => setPrice(e)}
      />
      <CurrencyInput
        label="Amount"
        placeholder="0.00"
        currency={selectedPair?.baseToken?.symbol}
        onChange={(e) => setAmount(e)}
      />
      <div className="text-xs space-y-1">
        <div>
          <span className="text-muted-foreground">Avaialble Balance </span>
          <span>{formatCurrency(irdxBalance)} IDRX</span>
        </div>
        <div>
          <span className="text-muted-foreground">Total IDRX amount </span>
          <span>{total?.display ? formatCurrency(total.display) : 0} IDRX</span>
        </div>
      </div>
      <ModalConfirmationTx
        price={price}
        amount={amount}
        total={total}
        baseDecimal={result?.data?.[2]?.result || 0}
        quoteDecimal={result?.data?.[1]?.result || 0}
      />
    </div>
  );
};

export default BuyLimitOrder;
