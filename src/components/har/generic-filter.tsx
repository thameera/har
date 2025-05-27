import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, ChevronsUpDown, Check } from "lucide-react";

interface GenericFilterProps<T extends string> {
  availableItems: T[];
  selectedItems: T[];
  onToggleItem: (item: T) => void;
  onClearSelection: () => void;
  placeholder: string;
  singularLabel: string;
  pluralLabel: string;
  searchPlaceholder: string;
  minWidth?: string;
}

export function GenericFilter<T extends string>({
  availableItems,
  selectedItems,
  onToggleItem,
  onClearSelection,
  placeholder,
  singularLabel,
  pluralLabel,
  searchPlaceholder,
  minWidth = "200px",
}: GenericFilterProps<T>) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = searchQuery
    ? availableItems.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : availableItems;

  const getButtonText = () => {
    if (selectedItems.length === 0) {
      return placeholder;
    }
    return `${selectedItems.length} ${selectedItems.length === 1 ? singularLabel : pluralLabel}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex justify-between h-9 relative"
          style={{ minWidth }}
        >
          {getButtonText()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          {selectedItems.length > 0 && (
            <span className="rounded-full w-2 h-2 bg-primary absolute -right-1 -top-1" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No {pluralLabel} found</CommandEmpty>
            {filteredItems.length > 0 && (
              <CommandGroup className="max-h-[300px] overflow-auto">
                <ScrollArea className="h-[300px]">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItems.includes(item);

                    return (
                      <CommandItem
                        key={item}
                        onSelect={() => {
                          onToggleItem(item);
                        }}
                        className="flex items-center gap-2 px-2 py-1.5"
                      >
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleItem(item);
                          }}
                          className="flex items-center justify-center"
                        >
                          <Checkbox checked={isSelected} className="h-4 w-4" />
                        </div>
                        <span className="flex-1 truncate" title={item}>
                          {item}
                        </span>
                        {isSelected && (
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        )}
                      </CommandItem>
                    );
                  })}
                </ScrollArea>
              </CommandGroup>
            )}
          </CommandList>
          {selectedItems.length > 0 && (
            <div className="border-t p-2 flex flex-col gap-2">
              <div className="flex flex-wrap gap-1">
                {selectedItems.map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="flex items-center gap-1 max-w-[200px]"
                  >
                    <span className="truncate" title={item}>
                      {item}
                    </span>
                    <div
                      className="cursor-pointer z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onToggleItem(item);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onClearSelection();
                }}
                className="self-start text-xs text-muted-foreground"
              >
                Clear all
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
