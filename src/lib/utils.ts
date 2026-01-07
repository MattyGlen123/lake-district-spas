import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to map spa color to badge classes
export function getBadgeClasses(colorClass: string): string {
  const colorMap: Record<string, string> = {
    'bg-spa-green': 'bg-emerald-50 text-black',
    'bg-spa-purple': 'bg-purple-50 text-black',
    'bg-spa-yellow': 'bg-amber-50 text-black',
    'bg-spa-red': 'bg-red-50 text-black',
    'bg-spa-blue': 'bg-blue-50 text-black',
  };
  return colorMap[colorClass] || 'bg-stone-50 text-black';
}
