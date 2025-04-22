import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { XMLParser } from "fast-xml-parser";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function decodeSAML(base64String: string) {
  //url decoding
  const urlDecode = decodeURIComponent(base64String);

  //base64 decoding
  const compressedBuffer = Buffer.from(urlDecode, "base64");

  // to string
  const stringXml = compressedBuffer.toString("utf-8");

  //create parser
  const parser = new XMLParser({
    ignoreAttributes: false,
    ignoreDeclaration: false,
    trimValues: true,
    attributeNamePrefix: "@_",
  });
  //xml string to json
  const json = parser.parse(stringXml) as JSON;

  return json;
}
