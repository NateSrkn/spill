import { atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { atomWithReset, RESET } from "jotai/utils";
import { Partialize } from "../utils";
import { Person } from "./people";
import { receiptAtom, subtotalAtom } from "./store";

export interface Item {
  id: number;
  title: string;
  value: number;
  shared: boolean;
  include: Include;
}

export type Include = {
  [key: Person["id"]]: boolean;
};

export const itemsAtom = focusAtom(receiptAtom, (receipt) =>
  receipt.prop("items")
);

export const itemAtom = atomWithReset<Partialize<Item, "id">>({
  title: "",
  value: 0,
  shared: false,
  include: {},
});

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

export const addItemAtom = atom(null, (get, set) => {
  set(
    itemsAtom,
    addItem(get(itemsAtom), {
      ...get(itemAtom),
      id: Date.now(),
    })
  );
  set(itemAtom, RESET);
  set(itemAtom, { ...get(itemAtom), include: {} });
  set(
    subtotalAtom,
    get(itemsAtom).reduce((sum, i) => i.value + sum, 0)
  );
});

export const removeItemAtom = atom(null, (get, set, id: number) => {
  set(itemsAtom, removeItem(get(itemsAtom), id));
});

export const updateItemAtom = atom(
  null,
  (get, set, id: number, name: keyof Item, value: string | number) => {
    set(itemsAtom, updateItem(get(itemsAtom), id, name, value));
    if (name === "value") {
      set(
        subtotalAtom,
        get(itemsAtom).reduce((sum, i) => i.value + sum, 0)
      );
    }
  }
);
