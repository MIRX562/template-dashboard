import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name?: string): string {
  if (!name) {
    return "D";
  }
  return name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
