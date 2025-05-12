/* eslint-disable @next/next/no-img-element */
import { tokenImages } from "@/config/constant";
import { HelpCircle } from "lucide-react";

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
