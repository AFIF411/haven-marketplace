import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  current: number;
  className?: string;
}

export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
            i <= current ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}>
            {i < current ? <Check className="h-4 w-4" /> : i + 1}
          </div>
          <span className={cn("text-sm", i <= current ? "font-medium" : "text-muted-foreground")}>{s}</span>
          {i < steps.length - 1 && <div className={cn("h-px w-8", i < current ? "bg-primary" : "bg-border")} />}
        </div>
      ))}
    </div>
  );
}
