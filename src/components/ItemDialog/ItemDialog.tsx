import React from "react";
import { Close, Title } from "@radix-ui/react-dialog";
import { Button } from "../Button";
import { ButtonColorVariants, ButtonTypeVariant } from "../Button";
import { Item } from "../../store";
import styles from "./ItemDialog.module.scss";
import { Input } from "../Input";
import { Formik } from "formik";
import { PeopleSelect } from "../PeopleSelect";
import { useReceiptStore } from "../../store";
import { currencyFormatter, getGroupSize, PartialRecord } from "../../utils";
import Dialog from "../Dialog/Dialog";
interface ItemDialogProps {
  trigger: React.ReactNode;
  initialItem?: Item;
}

enum SharedStateEnum {
  SHARED = "shared",
  INDIVIDUAL = "individual",
}

export const ItemDialog = React.forwardRef(function ItemDialog(
  {
    trigger: Trigger,
    initialItem = {
      title: "",
      value: 0,
      quantity: 1,
      include: {},
      shared: false,
      id: -1,
    },
  }: ItemDialogProps,
  ref
) {
  const isEdit = initialItem.id > 0;
  const addItem = useReceiptStore((state) => state.addItem);
  const updateItem = useReceiptStore((state) => state.updateItem);
  const [open, setOpen] = React.useState(false);
  const handleOpenChange = (isOpen: boolean = false) => {
    setOpen(isOpen);
  };

  type CostParams = {
    shared: boolean;
    value: number;
    groupSize: number;
  };

  const getCostPerPerson = ({ shared, value, groupSize }: CostParams) =>
    currencyFormatter.format(shared ? value / groupSize : value);

  const getItemTotalCost = ({ shared, value, groupSize }: CostParams) =>
    currencyFormatter.format(shared ? value : value * groupSize);
  return (
    <Dialog
      trigger={Trigger}
      open={open}
      onOpenChange={handleOpenChange}
      ref={ref}
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
          isValid,
        }) => (
          <form onSubmit={handleSubmit} className={styles.innerContent}>
            <Title className={styles.title} tabIndex={0}>
              {isEdit ? "Edit Item" : "Add Item"}
            </Title>
            <section className="flex flex-col gap-4 mb-20">
              <section className="grid grid-cols-2 gap-4 w-full items-baseline">
                <fieldset className={styles.fieldset}>
                  <div>
                    <label className="Label" htmlFor="title">
                      Item
                    </label>
                  </div>
                  <Input
                    id="title"
                    name="title"
                    data-cy="addInputTitle"
                    value={values.title}
                    onBlur={handleBlur}
                    handleChange={(name, value) =>
                      handleChange({ currentTarget: { name, value } })
                    }
                    data-error={errors.title && touched.title}
                  />
                  {errors.title && touched.title ? (
                    <div className="text-[var(--error)] text-sm">
                      {errors.title}
                    </div>
                  ) : null}
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
                    value={values.value}
                    onBlur={handleBlur}
                    data-cy="addInputValue"
                    handleChange={(name, value) =>
                      handleChange({ currentTarget: { name, value } })
                    }
                    data-error={errors.value && touched.value}
                  />
                  {errors.value && touched.value ? (
                    <div className="text-[var(--error)] text-sm">
                      {errors.value}
                    </div>
                  ) : null}
                </fieldset>
              </section>
              <label
                className={styles.toggleButton}
                htmlFor="shared"
                aria-checked={values.shared}
                data-cy="sharedSelect"
              >
                <input
                  type="checkbox"
                  className="form-checkbox mt-1"
                  value={SharedStateEnum.INDIVIDUAL}
                  checked={values.shared}
                  name="shared"
                  id="shared"
                  onChange={handleChange}
                ></input>
                <div className="text-base">
                  <h3>Was this a shared item?</h3>
                  <div className="text-sm subtext">
                    Divides amount among group
                  </div>
                </div>
              </label>
              <PeopleSelect
                include={values.include}
                price={getCostPerPerson({
                  shared: values.shared,
                  value: values.value,
                  groupSize: getGroupSize(values.include),
                })}
                handleChange={handleChange}
                error={errors.include}
                touched={touched.include}
              />
            </section>
            <div className={styles.buttons}>
              <Close asChild>
                <Button
                  onClick={() => handleOpenChange(false)}
                  buttonVariant={ButtonTypeVariant.DEFAULT}
                  colorVariant={ButtonColorVariants.DELETE}
                >
                  Cancel
                </Button>
              </Close>
              <Button
                colorVariant={ButtonColorVariants.PRIMARY}
                type="submit"
                data-cy="item-submit"
              >
                Add item (
                {getItemTotalCost({
                  value: values.value,
                  shared: values.shared,
                  groupSize: getGroupSize(values.include),
                })}
                )
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </Dialog>
  );
});
