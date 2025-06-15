import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function highlightJson(jsonString: string) {
  return jsonString
    .replace(/("(?:[^"\\]|\\.)*")\s*:/g, '<span class="json-key">$1</span>:') // Keys
    .replace(
      /:(\s*)("(?:[^"\\]|\\.)*")/g,
      ': <span class="json-string">$2</span>',
    ) // String values
    .replace(/:(\s*)(true|false)/g, ': <span class="json-boolean">$2</span>') // Booleans
    .replace(/:(\s*)(null)/g, ': <span class="json-null">$2</span>') // Null
    .replace(
      /:(\s*)(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
      ': <span class="json-number">$2</span>',
    ) // Numbers
    .replace(/([{}[\],])/g, '<span class="json-punctuation">$1</span>'); // Punctuation
}
