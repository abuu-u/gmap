import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...arguments_: any[]) => any>(
  callback: T,
  delay: number
) => {
  let timeout: NodeJS.Timeout;

  return (...arguments_: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      callback(...arguments_);
    }, delay);
  };
};
