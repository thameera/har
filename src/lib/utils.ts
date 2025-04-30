import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { HarRequest } from "@/components/har/harTypes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSaml(request: HarRequest) {
  const inFormData = request.request.postData?.params?.find(
    (param) => param.name === "SAMLResponse" || param.name === "SAMLRequest",
  );

  if (inFormData) return inFormData;

  const url = new URL(request.request.url);
  const searchParams = new URLSearchParams(url.search);
  const isSamlInQueryParams = searchParams
    .entries()
    .find(([key, value]) => key === "SAMLResponse" || key === "SAMLRequest");

  if (isSamlInQueryParams)
    return { name: isSamlInQueryParams[0], value: isSamlInQueryParams[1] };

  return null;
}
