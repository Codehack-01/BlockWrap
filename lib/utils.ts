import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTransactionCount(count: number): string {
  if (count < 1000) return count.toLocaleString();

  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + "M+";
  }

  return (count / 1000).toFixed(1).replace(/\.0$/, '') + "k+";
}
