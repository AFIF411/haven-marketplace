import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface PriceInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  currency?: string;
}

export const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
  ({ currency = "DA", className, ...props }, ref) => (
    <div className="relative">
      <input
        ref={ref}
        type="number"
        min={0}
        step={1}
        className={cn("w-full h-10 ps-3 pe-12 rounded-md border bg-background text-sm", className)}
        {...props}
      />
      <span className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">{currency}</span>
    </div>
  )
);
PriceInput.displayName = "PriceInput";
