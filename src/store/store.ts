import { atom } from "jotai";

import { atomWithReset } from "jotai/utils";
import { getDate, getInitials } from "../utils";
import { Item } from "./items";
import { Person } from "./people";

export interface Receipt {
  title: string;
  avatar: string;
  tax: number;
  tip: number;
  date: string;
  items: Item[];
  people: Person[];
}

export const receiptAtom = atomWithReset<Receipt>({
  title: "New Event",
  avatar: "",
  tax: 0,
  tip: 0,
  date: getDate(),
  items: [],
  people: [],
});

export const receiptAvatar = atom((get) =>
  get(receiptAtom).avatar
    ? get(receiptAtom).avatar
    : getInitials(get(receiptAtom).title)
);
