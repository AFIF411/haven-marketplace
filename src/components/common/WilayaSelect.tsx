import { wilayas } from "@/data/mockData";

interface WilayaSelectProps {
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function WilayaSelect({ value, onChange, placeholder = "Sélectionner une wilaya", required, className }: WilayaSelectProps) {
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className={`w-full h-10 px-3 rounded-md border bg-background text-sm ${className || ""}`}
    >
      <option value="">{placeholder}</option>
      {wilayas.map((w, i) => (
        <option key={w} value={w}>{String(i + 1).padStart(2, "0")} — {w}</option>
      ))}
    </select>
  );
}
