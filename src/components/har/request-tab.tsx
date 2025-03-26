import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function RequestTab() {
  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={["url", "headers", "other"]}
    >
      <AccordionItem value="url">
        <AccordionTrigger>URL</AccordionTrigger>
        <AccordionContent>URL details</AccordionContent>
      </AccordionItem>

      <AccordionItem value="headers">
        <AccordionTrigger>Request Headers</AccordionTrigger>
        <AccordionContent>Request headers details</AccordionContent>
      </AccordionItem>

      <AccordionItem value="other">
        <AccordionTrigger>Other</AccordionTrigger>
        <AccordionContent>Other request details</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
