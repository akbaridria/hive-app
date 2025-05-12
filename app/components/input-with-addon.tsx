import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { HTMLInputTypeAttribute, useId } from "react";

interface InputWithAddonProps {
  label: string;
  placeholder: string;
  type: HTMLInputTypeAttribute;
  suffix?: string;
  prefix?: string;
  disabled?: boolean;
}

const InputWithAddon: React.FC<InputWithAddonProps> = ({
  label,
  placeholder,
  type,
  prefix,
  suffix,
  disabled
}) => {
  const id = useId();
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <Input
          id={id}
          className={cn("peer", { "ps-6": prefix, "pe-10": suffix })}
          placeholder={placeholder}
          type={type}
          disabled={disabled}
        />
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-muted-foreground peer-disabled:opacity-50">
            {prefix}
          </span>
        )}
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputWithAddon;
