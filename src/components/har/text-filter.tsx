import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TextFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TextFilter({
  value,
  onChange,
  placeholder = "Search URLs...",
  className,
}: TextFilterProps) {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div className={cn("relative", className)}>
      <input
        type="text"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-8"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          title="Clear search"
        >
          <X className="h-3 w-3 text-gray-500 dark:text-gray-400" />
        </button>
      )}
    </div>
  );
}
