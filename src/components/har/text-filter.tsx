import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface TextFilterProps {
  value: string;
  onChange: (value: string) => void;
  isFullSearch: boolean;
  onFullSearchToggle: (enabled: boolean) => void;
  className?: string;
}

export function TextFilter({
  value,
  onChange,
  isFullSearch,
  onFullSearchToggle,
  className,
}: TextFilterProps) {
  const handleClear = () => {
    onChange("");
  };

  const getPlaceholder = () => {
    return isFullSearch ? "Search everything..." : "Search URLs...";
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          placeholder={getPlaceholder()}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-8"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Clear search"
          >
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Checkbox
          checked={isFullSearch}
          onCheckedChange={onFullSearchToggle}
          id="full-search"
          className="h-4 w-4"
          title="Search URLs only or all request content (headers, body, cookies, etc.)"
        />
        <label
          htmlFor="full-search"
          className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
          title="Search URLs only or all request content (headers, body, cookies, etc.)"
        >
          Full search
        </label>
      </div>
    </div>
  );
}
