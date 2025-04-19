"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  iconClassName?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, iconClassName, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Search
          className={cn(
            "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground text-xs",
            iconClassName
          )}
        />
        <Input ref={ref} className={cn("pl-10 text-xs", className)} {...props} />
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
