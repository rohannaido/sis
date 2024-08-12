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

export const timeFormat = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

export enum DaysOfWeek {
  MONDAY = "Monday",
  TUESDAY = "Tuesday",
  WEDNESDAY = "Wednesday",
  THURSDAY = "Thursday",
  FRIDAY = "Friday",
  SATURDAY = "Saturday",
  //   SUNDAY = "Sunday",
}

export function timeStringToDate(timeString: string): Date {
  const today = new Date();

  const [hours, minutes, seconds] = timeString.split(":").map(Number);

  today.setHours(hours, minutes, seconds, 0);

  return today;
}
