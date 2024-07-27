import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getNextRouteFragment = (
  currentRoute: string,
  currentRouteFragment: string,
  nFragment: number
): string => {
  const startIndex = currentRoute.indexOf(currentRouteFragment);
  currentRoute = currentRoute.slice(startIndex);
  const parts = currentRoute.split("/");
  let tabValue =
    parts.length > nFragment ? parts.slice(nFragment).join("/") : "";

  return tabValue;
};
