"use client";

import { Button } from "./ui/button";
import {
  GithubIcon,
  BookOpenTextIcon,
  Wallet2Icon,
  DropletIcon,
  PlusIcon,
} from "lucide-react";
import { useConnectModal } from "@xellar/kit";
import { useAccount, useSwitchChain, useChainId } from "wagmi";
import { SUPPORTED_CHAIN_IDS } from "@/config/constant";
import { useEffect, useMemo } from "react";

const Header = () => {
  const { open } = useConnectModal();
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (!isConnected || !chainId) return;

    if (!SUPPORTED_CHAIN_IDS.includes(chainId)) {
      switchChain({ chainId: SUPPORTED_CHAIN_IDS[0] });
    }
  }, [isConnected, chainId, switchChain]);

  const isRightConnected = useMemo(
    () => isConnected && SUPPORTED_CHAIN_IDS.includes(chainId),
    [isConnected, chainId]
  );

  return (
    <div className="sticky top-0 z-50 border-b border-dashed bg-background/50 backdrop-blur-sm backdrop-filter">
      <div className="container mx-auto border-x border-dashed">
        <div className="flex items-center justify-between p-4">
          <div>Hive Logo</div>
          <div className="flex items-center gap-2">
            {!isRightConnected && (
              <Button variant="outline" onClick={open}>
                <Wallet2Icon />
                <span className="hidden md:inline">Connect Wallet</span>
              </Button>
            )}
            {isRightConnected && (
              <>
                <Button variant="outline">
                  <DropletIcon />
                  <span className="hidden md:inline">Faucet</span>
                </Button>
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

export default Header;
