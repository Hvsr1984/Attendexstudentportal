import { COLOR_TOKENS } from "../constants";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateStr).toLocaleDateString("en-IN", options);
};

export const getAttendanceColor = (percentage: number): string => {
  if (percentage >= 75) return COLOR_TOKENS.success; // Emerald Green
  if (percentage >= 65) return COLOR_TOKENS.warning; // Amber
  return COLOR_TOKENS.danger; // Rose Red
};

export const getAttendanceTailwindClass = (percentage: number): string => {
  if (percentage >= 75) return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50";
  if (percentage >= 65) return "text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50";
  return "text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400 border-rose-200 dark:border-rose-900/50";
};
