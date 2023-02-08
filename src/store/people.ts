import { atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { Partialize } from "../utils";
import { Item, itemsAtom } from "./items";
import { receiptAtom, subtotalAtom } from "./store";

export interface Person {
  id: number;
  name: string;
}

const addPerson = (people: Person[], person: Person) => [...people, person];

const removePerson = (people: Person[], id: number) =>
  people.filter((p) => p.id !== id);

const updatePerson = (people: Person[], id: number, newName: string) =>
  people.map((p) => ({ ...p, name: p.id === id ? newName : p.name }));

export const peopleAtom = focusAtom(receiptAtom, (receipt) =>
  receipt.prop("people")
);

export const personAtom = atom<Partialize<Person, "id">>({ name: "" });

export const addPersonAtom = atom(null, (get, set) => {
  set(
    peopleAtom,
    addPerson(get(peopleAtom), { ...get(personAtom), id: Date.now() })
  );
  set(personAtom, { name: "" });
});

export const removePersonAtom = atom(null, (get, set, id: number) => {
  set(peopleAtom, removePerson(get(peopleAtom), id));
  set(itemsAtom, removePersonFromItem(get(itemsAtom), id));
  set(
    subtotalAtom,
    get(itemsAtom).reduce((sum, i) => i.value + sum, 0)
  );
});

export const removePersonFromItem = (items: Item[], id: number) => {
  return items.map((item) => {
    if (item.include[id]) {
      delete item.include[id];
    }
    return item;
  });
};

export const updatePersonAtom = atom(
  null,
  (get, set, id: number, newName: string) => {
    set(peopleAtom, updatePerson(get(peopleAtom), id, newName));
  }
);
