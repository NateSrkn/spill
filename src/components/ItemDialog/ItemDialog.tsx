import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Button } from "../Button";
import { ButtonColorVariants, ButtonTypeVariant } from "../Button/Button";
import { addItemAtom, itemAtom, Include } from "../../store/items";
import { useAtom } from "jotai";
import styles from "./ItemDialog.module.scss";

import { FiCheck } from "react-icons/fi";
import classNames from "classnames";
import { getInitials } from "../../utils";
import { Input } from "../Input";
import { peopleAtom } from "../../store/people";
export const ItemDialog = () => {
  const [item, setItem] = useAtom(itemAtom);
  const [toggleAllStatus, setToggleAllStatus] = useState(false);
  const [people] = useAtom(peopleAtom);
  const [, addItem] = useAtom(addItemAtom);
  const handleUpdateItemMeta = (name: string, value: string | number) => {
    setItem({ ...item, [name]: value });
  };

  const handleUpdateItemIncludes = (personId: number, status: boolean) => {
    const newItem = { ...item };
    newItem.include[personId] = status;
    setItem({ ...newItem });
  };

  const resetForm = () => {
    setItem({ title: "", shared: false, value: 0, include: {} });
    setToggleAllStatus(false);
  };

  const handleSaveItem = () => {
    if (Object.values(item.include).filter((i) => i).length >= 2) {
      setItem({ ...item, shared: true });
    }
    addItem();
    resetForm();
  };

  const handleToggleSelectAll = () => {
    const include = people.reduce((acc, p) => {
      acc[p.id] = !toggleAllStatus;
      return acc;
    }, {} as Include);
    setItem({
      ...item,
      include,
    });
    setToggleAllStatus(!toggleAllStatus);
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button colorVariant={ButtonColorVariants.TONAL}>Add Item</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={styles.content}
          onInteractOutside={resetForm}
        >
          <Dialog.Title className={styles.title}>Add Item</Dialog.Title>
          <div className="flex flex-col gap-4">
            <section className="grid grid-cols-[60%,35%] gap-4 w-full">
              <fieldset className={styles.fieldset}>
                <label className="Label" htmlFor="title">
                  Item
                </label>
                <Input
                  id="title"
                  name="title"
                  value={item.title}
                  handleChange={handleUpdateItemMeta}
                />
              </fieldset>
              <fieldset className={styles.fieldset}>
                <label className="Label" htmlFor="value">
                  Amount
                </label>
                <Input
                  id="value"
                  asCurrency
                  name="value"
                  type="number"
                  value={item.value}
                  handleChange={handleUpdateItemMeta}
                />
              </fieldset>
            </section>
            <fieldset className="flex flex-col gap-2">
              <div className="flex justify-between">
                <label htmlFor="included">Include</label>
                <Button
                  buttonVariant={ButtonTypeVariant.TEXT}
                  colorVariant={ButtonColorVariants.PRIMARY}
                  onClick={handleToggleSelectAll}
                >
                  Select All
                </Button>
              </div>
              <div className="border-[#EAECF0] border rounded-lg">
                {people.map((person) => (
                  <Checkbox.Root
                    className={classNames(
                      "flex items-center justify-between p-3 w-full",
                      {
                        "bg-[#F9FAFB]": item.include[person.id],
                      }
                    )}
                    key={person.id}
                    id={`${person.id}`}
                    checked={item.include[person.id]}
                    value={item.include[person.id] ? "on" : "off"}
                    onCheckedChange={(status) =>
                      handleUpdateItemIncludes(person.id, status as boolean)
                    }
                  >
                    <div className="flex gap-2 items-center">
                      <div
                        className="avatar flex-shrink-0"
                        style={
                          {
                            "--avatar-size": "24px",
                          } as React.CSSProperties
                        }
                      >
                        {getInitials(person.name)}
                      </div>
                      <label htmlFor={`${person.id}`} className="w-full">
                        {person.name}
                      </label>
                    </div>
                    <Checkbox.Indicator>
                      <FiCheck className="text-purple-600" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                ))}
              </div>
            </fieldset>
            <div className="flex gap-4 mt-4">
              <Dialog.Close asChild>
                <Button
                  onClick={resetForm}
                  buttonVariant={ButtonTypeVariant.DEFAULT}
                  colorVariant={ButtonColorVariants.DELETE}
                >
                  Cancel
                </Button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Button
                  colorVariant={ButtonColorVariants.PRIMARY}
                  onClick={handleSaveItem}
                >
                  Save changes
                </Button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
