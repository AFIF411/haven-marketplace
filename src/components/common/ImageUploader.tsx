import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  className?: string;
}

/** Uploader d'images frontend pur — utilise URL.createObjectURL.
 *  Branche ton backend en remplaçant handleFiles pour faire un POST réel. */
export function ImageUploader({ value, onChange, max = 6, className }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newUrls = Array.from(files).slice(0, max - value.length).map(f => URL.createObjectURL(f));
    onChange([...value, ...newUrls]);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={cn("border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}
      >
        <Upload className="h-7 w-7 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Glissez vos images ou <span className="text-primary">parcourez</span></p>
        <p className="text-xs text-muted-foreground mt-1">PNG, JPG · max {max} images</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {value.map((url, i) => (
            <div key={url + i} className="relative aspect-square rounded-md overflow-hidden border group">
              <img src={url} alt={`upload-${i}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="absolute top-1 end-1 h-6 w-6 rounded-full bg-background/90 border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
