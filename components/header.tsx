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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPublicClient, erc20Abi, http } from "viem";
import { readContract } from "viem/actions";
import { liskSepolia } from "viem/chains";
import hiveFactoryAbi from "@/config/abis/hive-factory.json";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/api/constant/query-keys";

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
                <ButtonCreatePair />
              </>
            )}
            <div className="flex items-center">
              <a
                href="https://github.com/akbaridria/hive-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon">
                  <GithubIcon />
                </Button>
              </a>
              <Button variant="ghost" size="icon" disabled>
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
          {listTokens.filter((item) => item.symbol !== 'LSK').map((token) => (
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

const formSchema = z.object({
  baseToken: z.string().min(2, {
    message: "Base token address must be at least 2 characters.",
  }),
});

const ButtonCreatePair = () => {
  const [open, setOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const { writeContract, isPending } = useWriteContract();
  const [txHash, setTxhash] = useState<string>("");

  const queryClient = useQueryClient();

  const { isLoading } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
    confirmations: 1,
    query: {
      select(data) {
        if (data.status === "success") {
          toast.success("Pool created successfully!");
          closeModal();
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.POOLS] });
          }, 1500);
        } else {
          toast.error("Pool created failed.");
        }
        setTxhash("");
      },
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      baseToken: "",
    },
  });

  async function validateToken(address: string): Promise<boolean> {
    if (!address || address.length < 2) return false;

    setIsValidating(true);
    setIsTokenValid(null);

    try {
      const isValid = address.startsWith("0x") && address.length >= 42;
      if (!isValid) {
        setIsTokenValid(false);
        return false;
      }
      await readContract(
        createPublicClient({ chain: liskSepolia, transport: http() }),
        {
          address: address as `0x${string}`,
          abi: erc20Abi,
          functionName: "name",
        }
      );
      return true;
    } catch (error) {
      console.error("Error validating token:", error);
      setIsTokenValid(false);
      return false;
    } finally {
      setIsValidating(false);
    }
  }

  const closeModal = useCallback(() => {
    setOpen(false);
    form.reset();
    setIsTokenValid(null);
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isTokenValid !== true) {
      const isValid = await validateToken(values.baseToken);
      if (!isValid) return;
    }

    writeContract(
      {
        address: config.factoryAddress as `0x${string}`,
        abi: hiveFactoryAbi,
        functionName: "createHiveCore",
        args: [values.baseToken, config.tokens.idrx.ca],
      },
      {
        onSuccess: (hash) => {
          setTxhash(hash);
        },
        onError: (error) => {
          toast.error(
            `Error creating pool ${error.message.slice(0, 30) || "Unknown"}`
          );
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon />
          <span className="hidden md:inline">Add new pair</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Liquidity Pair</DialogTitle>
          <DialogDescription>
            Enter the base token address to create a new liquidity pair with
            IDRX.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="baseToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Token</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Enter token address"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setIsTokenValid(null);
                        }}
                        className={`pr-10 ${
                          isTokenValid === true
                            ? "border-green-500 focus-visible:ring-green-500"
                            : isTokenValid === false
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                      />
                    </FormControl>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isValidating && (
                        <LoaderIcon className="animate-spin" size={16} />
                      )}
                      {!isValidating && isTokenValid === true && (
                        <div className="text-green-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check-circle"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                        </div>
                      )}
                      {!isValidating && isTokenValid === false && (
                        <div className="text-red-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-x-circle"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <FormDescription>
                    Enter the contract address of your base token.
                  </FormDescription>
                  {isTokenValid === false &&
                    !form.formState.errors.baseToken && (
                      <p className="text-sm font-medium text-red-500">
                        Invalid token address format.
                      </p>
                    )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2 rounded-md border p-2 bg-muted/50 text-sm">
              <div className="font-medium">Quote Token:</div>
              <div className="text-muted-foreground">IDRX</div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={
                  isValidating ||
                  form.formState.isSubmitting ||
                  isPending ||
                  isLoading
                }
              >
                {form.formState.isSubmitting || isPending || isLoading ? (
                  <>
                    <LoaderIcon className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Pair"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default Header;
