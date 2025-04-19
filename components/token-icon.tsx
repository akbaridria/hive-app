/* eslint-disable @next/next/no-img-element */
import { HelpCircle } from "lucide-react";
const tokenImages: Record<string, string> = {
  btc: "/tokens/bitcoin-btc-logo.svg",
  "0x456...def": "https://example.com/token2.png",
};

export const TokenIcon = ({
  address,
  size = 22,
}: {
  address: string;
  size?: number;
}) => {
  const imageUrl = tokenImages[address.toLowerCase()];

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt="Token"
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full bg-muted"
      style={{ width: size, height: size }}
    >
      <HelpCircle size={size * 0.8} className="text-muted-foreground" />
    </div>
  );
};
