"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAccount, useReadContract } from "wagmi";
import { erc20Abi } from "viem";
import { useCallback, useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { useAppContext } from "@/app/context/app";
import SubmitTransaction from "./submit-transaction";
import ApproveTransaction from "./approve-transaction";

interface IModalConfirmationTxProps {
  prices: number[] | null;
  amount: number | null;
  toAmount: number | null;
  baseDecimal: number;
  quoteDecimal: number;
}

const ModalConfirmationTx: React.FC<IModalConfirmationTxProps> = ({
  prices,
  amount,
  baseDecimal,
  quoteDecimal,
  toAmount,
}) => {
  const [open, setOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const { address } = useAccount();
  const { selectedPair } = useAppContext();

  const { data: allowance, refetch } = useReadContract({
    address: selectedPair?.baseToken.address as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address!, selectedPair?.address as `0x${string}`],
    query: {
      refetchInterval: 1500,
    },
  });

  useEffect(() => {
    if (open) {
      (async () => {
        await refetch();
      })();
    }
  }, [open, refetch]);

  const handleApproveSuccess = useCallback(async () => {
    try {
      await refetch();
      setIsApproved(true);
    } catch (error) {
      console.error("Error refetching allowance:", error);
    }
  }, [refetch]);

  const handleSubmitSuccess = () => {
    setTimeout(() => {
      setOpen(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full bg-red-500 hover:bg-red-600 text-white"
          disabled={!amount}
        >
          Sell
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Confirm Sell Market Order</DialogTitle>
        </DialogHeader>
        <div className="max-w-screen-sm mx-auto p-6">
          <div className="relative ml-4">
            <div className="absolute left-0 inset-y-0 border-l-2" />
            <ApproveTransaction
              key={allowance}
              baseTokenAddress={
                selectedPair?.baseToken.address as `0x${string}`
              }
              pairAddress={selectedPair?.address as `0x${string}`}
              amount={amount ? amount * 10 ** baseDecimal : 0}
              onApproveSuccess={handleApproveSuccess}
              disabled={!amount}
              onApproveError={() => setIsApproved(false)}
              allowance={Number(allowance)}
              isApproved={isApproved}
            />
            <SubmitTransaction
              pairAddress={selectedPair?.address as `0x${string}`}
              prices={prices || []}
              amount={amount || 0}
              baseDecimal={baseDecimal}
              quoteDecimal={quoteDecimal}
              isApproved={isApproved}
              onSubmitSuccess={handleSubmitSuccess}
              disabled={!amount}
            />
          </div>
          <div className="border p-4 rounded-lg mt-8">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">From amount</div>
              <div className="text-sm font-medium text-right">
                {formatCurrency(amount || 0)} {selectedPair?.baseToken.symbol}
              </div>
              <div className="text-sm text-muted-foreground">To amount</div>
              <div className="text-sm font-medium text-right">
                ~ {formatCurrency(toAmount || 0)}{" "}
                {selectedPair?.quoteToken.symbol}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalConfirmationTx;
