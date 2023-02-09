import { atom } from "jotai";
import { focusAtom } from "jotai-optics";

import { receiptAtom } from "./store";

export interface Item {
  id: number;
  title: string;
  value: number;
  include: Include;
}

export type Include = Record<number, boolean>;

export const itemsAtom = focusAtom(receiptAtom, (receipt) =>
  receipt.prop("items")
);

export const addItem = (items: Item[], item: Item) => [...items, item];

export const removeItem = (items: Item[], id: number) =>
  items.filter((i) => i.id !== id);

const updateItem = (
  items: Item[],
  id: number,
  name: keyof Item,
  value: string | number
) =>
  items.map((i) => ({
    ...i,
    [name]: i.id === id ? value : i[name],
  }));

export const addItemAtom = atom(null, (get, set, item: Item) => {
  set(itemsAtom, addItem(get(itemsAtom), { ...item, id: Date.now() }));
});

export const removeItemAtom = atom(null, (get, set, id: number) => {
  set(itemsAtom, removeItem(get(itemsAtom), id));
});

export const updateItemAtom = atom(
  null,
  (get, set, id: number, name: keyof Item, value: string | number) => {
    set(itemsAtom, updateItem(get(itemsAtom), id, name, value));
  }
);
