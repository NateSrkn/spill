import { create } from "zustand";

import { getDate } from "../utils";

export interface Item {
  id: number;
  title: string;
  value: number;
  include: Include;
  shared: boolean;
}

export type Include = Record<number, boolean>;

export interface Person {
  id: number;
  name: string;
}

export interface Receipt {
  title: string;
  avatar: string;
  tax: number;
  tip: number;
  date: string;
  items: Item[];
  people: Person[];
  updateMeta: UpdateReceiptMeta;
  addPerson: () => void;
  removePerson: (id: number) => void;
  updatePerson: (id: number, value: string) => void;
  addItem: (item: Item) => void;
  removeItem: (id: number) => void;
  updateItem: UpdateItem;
  reset: () => void;
}

export type UpdateReceiptMeta = <T extends keyof Receipt>(
  name: T,
  value: Receipt[T]
) => void;

export type UpdateItem = <T extends keyof Item>(
  id: number,
  name: T,
  value: Item[T]
) => void;

const initialReceipt = {
  title: "New Event",
  avatar: "",
  tax: 0,
  tip: 0,
  items: [],
  people: [],
};

export const useReceiptStore = create<Receipt>((set) => ({
  ...initialReceipt,
  date: getDate(),
  reset: () => set({ ...initialReceipt, date: getDate() }),
  updateMeta: (name, value) => set(() => ({ [name]: value })),

  addPerson: () =>
    set((state) => ({
      people: [
        ...state.people,
        { name: `Person ${state.people.length + 1}`, id: Date.now() },
      ],
    })),

  removePerson: (id) => {
    set((state) => {
      removePersonFromItem(state.items, id);
      return { people: state.people.filter((p) => p.id !== id) };
    });
  },

  updatePerson: (id, value) =>
    set((state) => ({
      people: state.people.map((p) => ({
        ...p,
        name: p.id === id ? value : p.name,
      })),
    })),

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, { ...item, id: Date.now() }],
    })),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  updateItem: (id, name, value) =>
    set((state) => ({
      items: state.items.map((p) => ({
        ...p,
        [name]: p.id === id ? value : p[name],
      })),
    })),
}));

export const removePersonFromItem = (items: Item[], id: number) => {
  return items.map((item) => {
    const filtered = Object.keys(item.include).filter((i) => Number(i) === id);
    const include = filtered.reduce((acc, person) => {
      acc[person] = item.include[person];
      return acc;
    }, {});
    return { ...item, include };
  });
};
