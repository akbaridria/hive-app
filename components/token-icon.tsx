/* eslint-disable @next/next/no-img-element */
import { tokenImages } from "@/config/constant";
import { HelpCircle } from "lucide-react";
import { useMemo } from "react";

export const TokenIcon = ({
  address,
  size = 22,
}: {
  address: string;
  size?: number;
}) => {
  const imageUrl = tokenImages[address];
  console.log("imageUrl", imageUrl);
  console.log("address", address);
  const renderBaseToken = useMemo(() => {
    if (imageUrl)
      return (
        <img
          src={imageUrl}
          alt="Token"
          className="rounded-full object-cover"
          style={{ width: size, height: size }}
        />
      );
    return (
      <div
        className="flex items-center justify-center rounded-full bg-muted border border-muted-foreground"
        style={{ width: size, height: size }}
      >
        <HelpCircle size={size * 0.8} className="text-muted-foreground" />
      </div>
    );
  }, [imageUrl, size]);

  return (
    <div className="relative mr-2">
      {renderBaseToken}
      <div
        className="absolute rounded-full overflow-hidden"
        style={{
          width: size,
          height: size,
          left: size * 0.4,
          zIndex: -1,
          top: 0,
        }}
      >
        <img
          src="/tokens/idrx.svg"
          alt="Token"
          className="rounded-full object-cover"
          style={{ width: size, height: size }}
        />
      </div>
    </div>
  );
};
