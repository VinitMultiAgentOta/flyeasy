import { format, parseISO } from "date-fns";

export const formatCurrency = (
  amount: number,
  currency = "USD",
  locale = "en-US"
): string =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);

export const formatDate = (
  date: Date | string,
  pattern = "EEE, MMM d"
): string => {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern);
};

export const generateAgentCount = (): number =>
  Math.floor(Math.random() * 30) + 30; // 30–60

export const generateBookingCount = (): number =>
  Math.floor(Math.random() * 200) + 100; // 100–300

export const formatPhoneHref = (phone: string): string =>
  `tel:${phone.replace(/\D/g, "")}`;

export const truncate = (str: string, length: number): string =>
  str.length > length ? `${str.slice(0, length)}...` : str;

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
