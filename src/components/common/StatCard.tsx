import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  delta?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatCard({ label, value, delta, icon, trend = "neutral", className }: StatCardProps) {
  const trendColor = trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground";
  return (
    <div className={cn("bg-card rounded-lg border p-4 flex items-start justify-between gap-3", className)}>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="font-heading text-2xl font-bold mt-1">{value}</p>
        {delta && <p className={cn("text-xs mt-1", trendColor)}>{delta}</p>}
      </div>
      {icon && <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{icon}</div>}
    </div>
  );
}
