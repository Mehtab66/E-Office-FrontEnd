import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to conditionally merge Tailwind + custom class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
