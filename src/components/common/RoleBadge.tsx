import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS, ROLE_COLORS, type AppRole } from "@/lib/permissions";

export function RoleBadge({ role }: { role: AppRole }) {
  return <Badge variant="outline" className={`${ROLE_COLORS[role]} border`}>{ROLE_LABELS[role]}</Badge>;
}
