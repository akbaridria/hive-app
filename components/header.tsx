"use client";

import { Button } from "./ui/button";
import {
  GithubIcon,
  BookOpenTextIcon,
  Wallet2Icon,
  DropletIcon,
  PlusIcon,
  LoaderIcon,
  Hexagon,
} from "lucide-react";
import { useConnectModal } from "@xellar/kit";
import {
  useAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { SUPPORTED_CHAIN_IDS } from "@/config/constant";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import config from "@/config";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import AbiErc20 from "@/config/abis/erc20.json";
import { useChainConnection } from "@/store";
import { toast } from "sonner";

const Header = () => {
  const { open } = useConnectModal();
  const { isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const setConnected = useChainConnection((state) => state.setConnected);

  useEffect(() => {
    if (!isConnected || !chainId) return;

    if (!SUPPORTED_CHAIN_IDS.includes(chainId)) {
      switchChain({ chainId: SUPPORTED_CHAIN_IDS[0] });
    }

    if (isConnected && SUPPORTED_CHAIN_IDS.includes(chainId)) {
      setConnected(true);
    }
  }, [isConnected, chainId, switchChain, setConnected]);

  const isRightConnected = useMemo(
    () => isConnected && SUPPORTED_CHAIN_IDS.includes(chainId || 0),
    [isConnected, chainId]
  );

  return (
    <div className="sticky top-0 z-50 border-b border-dashed bg-background/50 backdrop-blur-sm backdrop-filter">
      <div className="container mx-auto border-x border-dashed">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Hexagon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">hive</h1>
          </div>
          <div className="flex items-center gap-2">
            {!isRightConnected && (
              <Button variant="outline" onClick={open}>
                <Wallet2Icon />
                <span className="hidden md:inline">Connect Wallet</span>
              </Button>
            )}
            {isRightConnected && (
              <>
                <ButtonFaucet />
                <Button variant="outline">
                  <PlusIcon />
                  <span className="hidden md:inline">Add new pair</span>
                </Button>
              </>
            )}
            <div className="flex items-center">
              <Button variant="ghost" size="icon">
                <GithubIcon />
              </Button>
              <Button variant="ghost" size="icon">
                <BookOpenTextIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const listTokens = Object.values(config.tokens);

const ButtonFaucet = () => {
  const [txHash, setTxhash] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState(listTokens[0].ca);
  const { writeContract, isPending } = useWriteContract();

  const { isLoading } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
    confirmations: 1,
    query: {
      select(data) {
        if (data.status === "success") {
          toast.success("Token minted successfully!");
        } else {
          toast.error("Token minting failed.");
        }
        setTxhash("");
      },
    },
  });

  const handleFaucet = useCallback(() => {
    writeContract(
      {
        address: selectedToken as `0x${string}`,
        abi: AbiErc20,
        functionName: "mint",
        args: [],
      },
      {
        onSuccess: (hash) => {
          setTxhash(hash);
        },
        onError: (error) => {
          toast.error(
            `Error minting token: ${error.message.slice(0, 30) || "Unknown"}`
          );
        },
      }
    );
  }, [selectedToken, writeContract]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <DropletIcon />
          <span className="hidden md:inline">Faucet</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Faucet</DialogTitle>
          <DialogDescription>
            Get free BTC, IDRX, DummyX & DummyY tokens to test the app.
          </DialogDescription>
        </DialogHeader>
        <RadioGroup
          defaultValue={selectedToken}
          onValueChange={(value) => {
            setSelectedToken(value);
          }}
        >
          {listTokens.map((token) => (
            <div key={token.ca} className="flex items-center space-x-2">
              <RadioGroupItem value={token.ca} id={token.ca} />
              <Label htmlFor={token.ca}>{token.name}</Label>
            </div>
          ))}
        </RadioGroup>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleFaucet}
            disabled={isPending || isLoading}
          >
            {(isPending || isLoading) && (
              <LoaderIcon className="animate-spin" />
            )}
            {isPending || isLoading ? "Loading..." : "Get Token"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Header;
