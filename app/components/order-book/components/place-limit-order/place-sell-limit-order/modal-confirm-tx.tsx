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
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { useAppContext } from "@/app/context/app";
import SubmitTransaction from "./submit-transaction";
import ApproveTransaction from "./approve-transaction";

interface IModalConfirmationTxProps {
  price: number | null;
  amount: number | null;
  baseDecimal: number;
  quoteDecimal: number;
}

const ModalConfirmationTx: React.FC<IModalConfirmationTxProps> = ({
  price,
  amount,
  baseDecimal,
  quoteDecimal,
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
      refetch();
    }
  }, [open, refetch]);

  const handleApproveSuccess = () => {
    refetch();
    setIsApproved(true);
  };

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
          disabled={!price || !amount}
        >
          Sell
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Confirm Sell Limit Order</DialogTitle>
        </DialogHeader>
        <div className="max-w-screen-sm mx-auto p-6">
          <div className="relative ml-4">
            <div className="absolute left-0 inset-y-0 border-l-2" />

            <ApproveTransaction
              baseTokenAddress={
                selectedPair?.baseToken.address as `0x${string}`
              }
              pairAddress={selectedPair?.address as `0x${string}`}
              amount={(amount || 0) * 10 ** baseDecimal || 0}
              onApproveSuccess={handleApproveSuccess}
              disabled={!price || !amount}
              onApproveError={() => setIsApproved(false)}
              allowance={Number(allowance)}
              isApproved={isApproved}
            />

            <SubmitTransaction
              pairAddress={selectedPair?.address as `0x${string}`}
              price={price || 0}
              amount={amount || 0}
              baseDecimal={baseDecimal}
              quoteDecimal={quoteDecimal}
              isApproved={isApproved}
              onSubmitSuccess={handleSubmitSuccess}
              disabled={!price || !amount}
            />
          </div>
          <div className="border p-4 rounded-lg mt-8">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Price</div>
              <div className="text-sm font-medium text-right">
                {formatCurrency(price || 0)} {selectedPair?.quoteToken.symbol}
              </div>
              <div className="text-sm text-muted-foreground">Amount</div>
              <div className="text-sm font-medium text-right">
                {formatCurrency(amount || 0)} {selectedPair?.baseToken.symbol}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-sm font-medium text-right">
                {formatCurrency(amount || 0)} {selectedPair?.baseToken.symbol}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalConfirmationTx;
