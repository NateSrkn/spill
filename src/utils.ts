import html2canvas from "html2canvas";
import { Receipt, Item } from "./store";

export const getInitials = (name: string) => {
  const names = name ? name.split(" ") : [];
  if (names.length > 1) {
    return (
      names[0].charAt(0).toLocaleUpperCase() +
      names[names.length - 1].charAt(0).toLocaleUpperCase()
    );
  }
  return name ? name.charAt(0) : "";
};
export const getFirstNameAndInitial = (name: string) => {
  const names = name ? name.trim().split(" ") : [];
  if (names.length > 1) {
    return `${names[0]} ${names[names.length - 1].charAt(0)}.`;
  }
  return name ? name : "";
};

export const getDate = (timestamp?: number) => {
  const date = timestamp ? new Date(timestamp) : new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const currentDate = `${year}-${month}-${day}`;
  return currentDate;
};

export const sumArray = (...numbers: number[]) =>
  [...numbers].reduce((sum, num) => sum + num, 0);

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export const formatDateForDisplay = (string: string) => {
  const [year, month, date] = string.split("-");
  return `${month}/${date}/${year}`;
};

export const convertToImage = async (
  element: HTMLElement,
  callback: BlobCallback
) => {
  const canvas = await html2canvas(element, {
    scale: 2,
  });
  canvas.toBlob(callback);
};

export const toPascalCase = (str: string) =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

export const calculateTax = (amount: number, percent: number) =>
  amount * (percent / 100);
export const calculateTaxPercent = (subtotal: number, tax: number) =>
  (tax / subtotal) * 100;

const getRelatedItems = (items: Item[], id: number) =>
  items.filter((i) => i.include[id]);

export const calculateBreakdown = (receipt: Receipt): FullBreakdown => {
  const subtotal = receipt.items.reduce((sum, item) => {
    const include = Object.keys(item.include).length;
    if (include) {
      return item.value + sum;
    }
    return sum;
  }, 0);
  if (!subtotal)
    return {
      subtotal: currencyFormatter.format(0),
      grossTotal: currencyFormatter.format(0),
      taxRate: 0,
      perPerson: [],
    };
  const taxRate = receipt.tax ? calculateTaxPercent(subtotal, receipt.tax) : 0;
  const tipSplit = receipt.tip / receipt.people.length;
  let grossTotal = 0;
  const perPerson = receipt.people.reduce((acc, p) => {
    const items = getRelatedItems(receipt.items, p.id);
    const simplifiedItems: Array<{
      title: string;
      total: number;
      id: number;
      formattedTotal: string;
    }> = [];
    const individualTotal = items.reduce((sum, item) => {
      const sharedBetweenCount = Object.values(item.include).filter(
        (i) => i
      ).length;

      const total = item.shared ? item.value / sharedBetweenCount : item.value;
      simplifiedItems.push({
        title: item.shared
          ? `${item.title} (÷) ${sharedBetweenCount}`
          : item.title,
        total,
        id: item.id,
        formattedTotal: currencyFormatter.format(total),
      });
      sum += total;
      return sum;
    }, 0);
    const tax = calculateTax(individualTotal, taxRate);
    const shared = tax + tipSplit;
    const gross = individualTotal + shared;
    grossTotal += gross;
    // @ts-ignore
    acc[p.id] = {
      items: simplifiedItems,
      gross,
      shared,
    };
    return acc;
  }, {} as PerPersonBreakdown);
  return {
    subtotal: currencyFormatter.format(subtotal),
    grossTotal: currencyFormatter.format(grossTotal),
    taxRate,
    perPerson,
  };
};

export enum BillSplitModesEnum {
  TOTAL = "TOTAL",
  INDIVIDUAL = "INDIVIDUAL",
}

export type FullBreakdown = {
  subtotal: string;
  grossTotal: string;
  taxRate: number;
  perPerson: Record<number, PerPersonBreakdown>;
};

export type PerPersonBreakdown = {
  items: {
    title: string;
    total: number;
    id: number;
    formattedTotal: string;
  }[];
  gross: number;
  shared: number;
};

export type Partialize<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

export const clearObject = (object: Record<string, any>) =>
  Object.keys(object).forEach((key) => delete object[key]);

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};
