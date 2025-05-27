import { useHar } from "./har-provider";
import { GenericFilter } from "./generic-filter";

export function DomainFilter() {
  const {
    availableDomains,
    selectedDomains,
    toggleDomain,
    clearDomainSelection,
  } = useHar();

  return (
    <GenericFilter
      availableItems={availableDomains}
      selectedItems={selectedDomains}
      onToggleItem={toggleDomain}
      onClearSelection={clearDomainSelection}
      placeholder="Filter by domain"
      singularLabel="domain"
      pluralLabel="domains"
      searchPlaceholder="Search domains..."
      minWidth="200px"
    />
  );
}
