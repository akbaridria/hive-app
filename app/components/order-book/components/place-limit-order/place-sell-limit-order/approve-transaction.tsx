"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { CheckIcon, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { erc20Abi } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

interface ApproveTransactionProps {
  baseTokenAddress: `0x${string}`;
  pairAddress: `0x${string}`;
  amount: number;
  onApproveSuccess: () => void;
  onApproveError: () => void;
  allowance?: number;
  isApproved?: boolean;
  disabled?: boolean;
}

const ApproveTransaction: React.FC<ApproveTransactionProps> = ({
  baseTokenAddress,
  pairAddress,
  amount,
  onApproveSuccess,
  onApproveError,
  allowance,
  isApproved,
  disabled = false,
}) => {
  const { writeContract, isPending } = useWriteContract();
  const [txHash, setTxHash] = useState<string>("");

  const { isLoading } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
    confirmations: 1,
    query: {
      select(data) {
        if (data.status === "success") {
          toast.success("Place limit order successfully.");
          onApproveSuccess();
        } else {
          toast.error("Failed to place limit order.");
          onApproveError();
        }
        setTxHash("");
      },
    },
  });

  useEffect(() => {
    if (allowance && allowance >= amount) {
      onApproveSuccess();
      return;
    }
    onApproveError();
  }, [allowance, amount, isApproved, onApproveError, onApproveSuccess]);

  const handleApprove = useCallback(() => {
    writeContract(
      {
        address: baseTokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [pairAddress, BigInt(amount)],
      },
      {
        onSuccess: (hash) => {
          setTxHash(hash);
        },
        onError: (error) => {
          toast.error(`Error to approve token: ${error.message || "Unknown"}`);
          onApproveError();
        },
      }
    );
  }, [writeContract, baseTokenAddress, pairAddress, amount, onApproveError]);

  return (
    <div className="relative pl-10 pb-12">
      <div className="absolute left-px -translate-x-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-accent ring-8 ring-background">
        {isPending || isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isApproved ? (
          <CheckIcon className="h-5 w-5" />
        ) : (
          <span className="h-5 w-5 flex items-center justify-center">1</span>
        )}
      </div>
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-medium">Approve Token</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Approve the token transfer for the limit order, ensuring that the
          contract can access the specified amount of tokens.
        </p>
        {!isApproved && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleApprove}
            disabled={disabled || isPending || isLoading}
            className="mt-2"
          >
            {isPending || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              "Approve"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ApproveTransaction;
