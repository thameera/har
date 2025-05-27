import { useHar } from "./har-provider";
import { GenericFilter } from "./generic-filter";

export function MethodFilter() {
  const {
    availableMethods,
    selectedMethods,
    toggleMethod,
    clearMethodSelection,
  } = useHar();

  return (
    <GenericFilter
      availableItems={availableMethods}
      selectedItems={selectedMethods}
      onToggleItem={toggleMethod}
      onClearSelection={clearMethodSelection}
      placeholder="Methods"
      singularLabel="method"
      pluralLabel="methods"
      searchPlaceholder="Search methods..."
      minWidth="75px"
    />
  );
}
