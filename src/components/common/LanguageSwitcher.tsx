import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/I18nContext";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useTranslation();
  return (
    <Button variant="ghost" size={compact ? "icon" : "sm"} onClick={() => setLang(lang === "fr" ? "ar" : "fr")} className="gap-1">
      <Globe className="h-4 w-4" />
      {!compact && <span className="text-xs">{lang === "fr" ? "العربية" : "Français"}</span>}
    </Button>
  );
}
