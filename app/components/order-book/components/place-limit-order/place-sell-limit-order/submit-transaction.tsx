"use client";

import type React from "react";

import { queryKeys } from "@/api/constant/query-keys";
import { Button } from "@/components/ui/button";
import { CheckIcon, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import abiHiveCore from "@/config/abis/hive-core.json";

interface SubmitTransactionProps {
  pairAddress: `0x${string}`;
  price: number;
  amount: number;
  baseDecimal: number;
  quoteDecimal: number;
  isApproved: boolean;
  onSubmitSuccess: () => void;
  disabled?: boolean;
}

const SubmitTransaction: React.FC<SubmitTransactionProps> = ({
  pairAddress,
  price,
  amount,
  baseDecimal,
  quoteDecimal,
  isApproved,
  onSubmitSuccess,
  disabled = false,
}) => {
  const [txHash, setTxHash] = useState<string>("");
  const queryClient = useQueryClient();
  const { writeContract, isPending } = useWriteContract();
  const { address } = useAccount();

  const { isLoading } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
    confirmations: 1,
    query: {
      select(data) {
        if (data.status === "success") {
          toast.success("Place limit order successfully.");
          queryClient.invalidateQueries({
            queryKey: [
              queryKeys.ORDERBOOK(pairAddress),
              queryKeys.USER_LIMIT_ORDERS(pairAddress, address!),
            ],
          });
          onSubmitSuccess();
        } else {
          toast.error("Failed to place limit order.");
        }
        setTxHash("");
      },
    },
  });

  const handleSellLimitO = useCallback(() => {
    writeContract(
      {
        address: pairAddress,
        abi: abiHiveCore,
        functionName: "placeOrder",
        args: [[price * 10 ** quoteDecimal], [amount * 10 ** baseDecimal], [1]],
      },
      {
        onSuccess: (hash) => {
          setTxHash(hash);
        },
        onError: (error) => {
          toast.error(
            `Error to place limit order: ${
              error.message.slice(0, 30) || "Unknown"
            }`
          );
        },
      }
    );
  }, [amount, baseDecimal, price, quoteDecimal, pairAddress, writeContract]);

  const isTransactionInProgress = isPending || isLoading;

  return (
    <div className="relative pl-10 pb-12 last:pb-0">
      <div className="absolute left-px -translate-x-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-accent ring-8 ring-background">
        {isTransactionInProgress ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : txHash ? (
          <CheckIcon className="h-5 w-5" />
        ) : (
          <span className="h-5 w-5 flex items-center justify-center">2</span>
        )}
      </div>
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-medium">Place Sell Limit Order</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Place a sell limit order on the order book, specifying the price and
          amount of tokens to be purchased.
        </p>
        {isApproved && !txHash && (
          <Button
            size="sm"
            onClick={handleSellLimitO}
            disabled={disabled || isTransactionInProgress || !isApproved}
            className="mt-2"
          >
            {isTransactionInProgress ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Order"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SubmitTransaction;
