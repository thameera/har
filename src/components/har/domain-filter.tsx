import { useState } from "react";
import { useHar } from "./har-provider";
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
import { cn } from "@/lib/utils";

export function DomainFilter() {
  const {
    availableDomains,
    selectedDomains,
    toggleDomain,
    clearDomainSelection,
  } = useHar();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDomains = searchQuery
    ? availableDomains.filter((domain) =>
        domain.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : availableDomains;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex justify-between min-w-[200px] h-9 relative"
        >
          {selectedDomains.length > 0
            ? `${selectedDomains.length} ${selectedDomains.length === 1 ? "domain" : "domains"}`
            : "Filter by domain"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          {selectedDomains.length > 0 && (
            <span className="rounded-full w-2 h-2 bg-primary absolute -right-1 -top-1" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search domains..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No domains found</CommandEmpty>
            {filteredDomains.length > 0 && (
              <CommandGroup className="max-h-[300px] overflow-auto">
                <ScrollArea className="h-[300px]">
                  {filteredDomains.map((domain) => {
                    const isSelected = selectedDomains.includes(domain);

                    return (
                      <CommandItem
                        key={domain}
                        onSelect={() => {
                          toggleDomain(domain);
                        }}
                        className="flex items-center gap-2 px-2 py-1.5"
                      >
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDomain(domain);
                          }}
                          className="flex items-center justify-center"
                        >
                          <Checkbox checked={isSelected} className="h-4 w-4" />
                        </div>
                        <span className="flex-1 truncate" title={domain}>
                          {domain}
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
          {selectedDomains.length > 0 && (
            <div className="border-t p-2 flex flex-col gap-2">
              <div className="flex flex-wrap gap-1">
                {selectedDomains.map((domain) => (
                  <Badge
                    key={domain}
                    variant="secondary"
                    className="flex items-center gap-1 max-w-[200px]"
                  >
                    <span className="truncate" title={domain}>
                      {domain}
                    </span>
                    <div
                      className="cursor-pointer z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleDomain(domain);
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
                  clearDomainSelection();
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
