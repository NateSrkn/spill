import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../Button";
import { ButtonColorVariants, ButtonTypeVariant } from "../Button";
import { Item } from "../../store";
import styles from "./ItemDialog.module.scss";
import { Input } from "../Input";
import { Formik } from "formik";
import { PeopleSelect } from "../PeopleSelect";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import useWindowSize from "../../hooks/useWindowSize";
import classNames from "classnames";
import { useReceiptStore } from "../../store";
import { PartialRecord } from "../../utils";
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
      shared: false,
      id: -1,
    },
  }: ItemDialogProps,
  ref
) {
  const { height, width } = useWindowSize();
  const isEdit = initialItem.id > 0;
  const addItem = useReceiptStore((state) => state.addItem);
  const updateItem = useReceiptStore((state) => state.updateItem);
  const [open, setOpen] = React.useState(false);
  const handleOpenChange = (isOpen: boolean = false) => {
    setOpen(isOpen);
  };

  const dialogPosition =
    width > 768
      ? {}
      : ({
          "--position": `${height}px`,
        } as React.CSSProperties);
  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{Trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          onOpenAutoFocus={(event) => event.preventDefault()}
          className={styles.content}
          style={dialogPosition}
        >
          <Formik
            initialValues={initialItem}
            validate={(values) => {
              const errors: PartialRecord<keyof Item, string> = {};
              if (!values.title) {
                errors.title = "Please enter a title";
              }
              if (!values.value) {
                errors.value = "Please enter a value";
              }
              if (Object.values(values.include).every((i) => i === false)) {
                errors.include = "Please select at least one person";
              }
              return errors;
            }}
            onSubmit={(values) => {
              isEdit
                ? Object.keys(values).forEach((key) =>
                    // @ts-ignore
                    updateItem(initialItem.id, key, values[key])
                  )
                : addItem({ ...values });

              handleOpenChange(false);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit} className={styles.innerContent}>
                <Dialog.Title className={styles.title}>
                  {isEdit ? "Edit Item" : "Add Item"}
                </Dialog.Title>
                <section className="flex flex-col gap-4 mb-20">
                  <section className="grid grid-cols-[60%,35%] gap-4 w-full">
                    <fieldset className={styles.fieldset}>
                      <div>
                        <label className="Label" htmlFor="title">
                          Item
                        </label>
                      </div>
                      {errors.title && touched.title ? (
                        <div className="text-red-600 text-sm">
                          {errors.title}
                        </div>
                      ) : null}
                      <Input
                        id="title"
                        name="title"
                        data-cy="addInputTitle"
                        value={values.title}
                        onBlur={handleBlur}
                        handleChange={(name, value) =>
                          handleChange({ currentTarget: { name, value } })
                        }
                      />
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                      <label className="Label" htmlFor="value">
                        Amount
                      </label>
                      {errors.value && touched.value ? (
                        <div className="text-red-600 text-sm">
                          {errors.value}
                        </div>
                      ) : null}
                      <Input
                        id="value"
                        asCurrency
                        name="value"
                        type="number"
                        value={values.value}
                        onBlur={handleBlur}
                        data-cy="addInputValue"
                        handleChange={(name, value) =>
                          handleChange({ currentTarget: { name, value } })
                        }
                      />
                    </fieldset>
                  </section>
                  <ToggleGroup handleChange={handleChange} values={values} />
                  <PeopleSelect
                    include={values.include}
                    handleChange={handleChange}
                    error={errors.include}
                    touched={touched.include}
                  />
                </section>
                <div className={styles.buttons} style={dialogPosition}>
                  <Dialog.Close asChild>
                    <Button
                      onClick={() => handleOpenChange(false)}
                      buttonVariant={ButtonTypeVariant.DEFAULT}
                      colorVariant={ButtonColorVariants.DELETE}
                    >
                      Cancel
                    </Button>
                  </Dialog.Close>
                  <Button
                    colorVariant={ButtonColorVariants.PRIMARY}
                    type="submit"
                    data-cy="item-submit"
                  >
                    Save item
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

const ToggleGroup = ({
  handleChange,
  values,
}: {
  handleChange: any;
  values: Item;
}) => {
  enum SharedStateEnum {
    SHARED = "shared",
    INDIVIDUAL = "individual",
  }
  return (
    <ToggleGroupPrimitive.Root
      type="single"
      className={styles.toggleGroup}
      defaultValue={SharedStateEnum.INDIVIDUAL}
      onValueChange={(value) =>
        value
          ? handleChange({
              currentTarget: {
                name: "shared",
                value: value === SharedStateEnum.INDIVIDUAL ? false : true,
              },
            })
          : null
      }
    >
      <ToggleGroupPrimitive.Item
        value={SharedStateEnum.INDIVIDUAL}
        className={classNames(styles.toggleButton, {
          [styles.active]: values.shared === false,
        })}
        data-cy="individualSelect"
      >
        <label>Add To Each Person</label>
        <div>Applies full amount to each person</div>
      </ToggleGroupPrimitive.Item>
      <ToggleGroupPrimitive.Item
        value={SharedStateEnum.SHARED}
        className={classNames(styles.toggleButton, {
          [styles.active]: values.shared === true,
        })}
        data-cy="sharedSelect"
      >
        <label>Split Evenly</label>
        <div>Divides amount among group</div>
      </ToggleGroupPrimitive.Item>
    </ToggleGroupPrimitive.Root>
  );
};
