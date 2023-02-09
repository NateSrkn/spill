import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../Button";
import { ButtonColorVariants, ButtonTypeVariant } from "../Button";
import { addItemAtom, Item, updateItemAtom } from "../../store/items";
import { useAtom } from "jotai";
import styles from "./ItemDialog.module.scss";
import { useFormik } from "formik";
import { Input } from "../Input";

import { PeopleSelect } from "../PeopleSelect";
interface ItemDialogProps {
  trigger: React.ReactNode;
  initialItem?: Item;
}

export const ItemDialog = React.forwardRef(function ItemDialog(
  {
    trigger: Trigger,
    initialItem = {
      title: "",
      value: 0,
      include: {},
      id: -1,
    },
  }: ItemDialogProps,
  ref
) {
  const isEdit = initialItem.id > 0;
  const [, addItem] = useAtom(addItemAtom);
  const [, updateItem] = useAtom(updateItemAtom);

  const item = useFormik<Item>({
    initialValues: initialItem,
    onSubmit: async (values) => {
      isEdit
        ? Object.keys(values).forEach((key) =>
            updateItem(initialItem.id, key, values[key])
          )
        : addItem({ ...values });
      item.resetForm();
      handleOpenChange(false);
    },
  });
  const [open, setOpen] = React.useState(false);
  const handleOpenChange = (isOpen: boolean = false) => {
    const copy = { ...item };
    item.values = copy.values;
    setOpen(isOpen);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{Trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={styles.content}
          onInteractOutside={() => item.resetForm()}
        >
          <Dialog.Title className={styles.title}>Add Item</Dialog.Title>
          <form className="flex flex-col gap-4" onSubmit={item.handleSubmit}>
            <section className="grid grid-cols-[60%,35%] gap-4 w-full">
              <fieldset className={styles.fieldset}>
                <div>
                  {item.errors.title && item.touched.title ? (
                    <div className="text-red-600 text-sm">
                      {item.errors.title}
                    </div>
                  ) : null}
                  <label className="Label" htmlFor="title">
                    Item
                  </label>
                </div>
                <Input
                  id="title"
                  name="title"
                  value={item.values.title}
                  handleChange={(name, value) =>
                    item.handleChange({ currentTarget: { name, value } })
                  }
                />
              </fieldset>
              <fieldset className={styles.fieldset}>
                <label className="Label" htmlFor="value">
                  Amount
                </label>
                {item.errors.value && item.touched.value ? (
                  <div className="text-red-600 text-sm">
                    {item.errors.value}
                  </div>
                ) : null}
                <Input
                  id="value"
                  asCurrency
                  name="value"
                  type="number"
                  required={!!item.errors.value}
                  value={item.values.value}
                  handleChange={(name, value) =>
                    item.handleChange({ currentTarget: { name, value } })
                  }
                />
              </fieldset>
            </section>
            <PeopleSelect
              include={item.values.include}
              handleChange={item.handleChange}
            />
            <div className="flex gap-4 mt-4">
              <Dialog.Close asChild>
                <Button
                  onClick={() => handleOpenChange(false)}
                  buttonVariant={ButtonTypeVariant.DEFAULT}
                  colorVariant={ButtonColorVariants.DELETE}
                >
                  Cancel
                </Button>
              </Dialog.Close>
              <Button colorVariant={ButtonColorVariants.PRIMARY} type="submit">
                Save changes
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});
