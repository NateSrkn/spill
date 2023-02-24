import classNames from "classnames";
import { FiCheck } from "react-icons/fi";
import { getInitials } from "../../utils";
import { Button, ButtonColorVariants, ButtonTypeVariant } from "../Button";
import { ChangeEventHandler, useState } from "react";
import { Include } from "../../store";
import { FormikErrors, FormikTouched } from "formik";
import { useReceiptStore } from "../../store";
export const PeopleSelect = ({
  include,
  handleChange,
  price,
  error,
  touched,
}: {
  include: Include;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  price: string;
  error?: FormikErrors<Include> | any;
  touched?: FormikTouched<Include> | any;
}) => {
  const defaultToggleState =
    Object.keys(include).length && Object.values(include).every((i) => i);
  const people = useReceiptStore((state) => state.people);
  const [toggleStatus, setToggleStatus] = useState(defaultToggleState);
  const hasError = error && touched;
  const handleSelectAll = () => {
    const include = people.reduce((acc, p) => {
      acc[p.id] = !toggleStatus;
      return acc;
    }, {} as Include);
    handleChange({
      currentTarget: { name: "include", value: include as any },
    } as any);
    setToggleStatus(!toggleStatus);
  };

  return (
    <fieldset className="flex flex-col gap-2">
      <div className="flex justify-between">
        <label className="subtext-header" htmlFor="included">
          Select People
        </label>
        {hasError ? (
          <div className="text-[var(--error)] text-sm">{error}</div>
        ) : null}
        <Button
          buttonVariant={ButtonTypeVariant.TEXT}
          colorVariant={ButtonColorVariants.PRIMARY}
          type="button"
          onClick={handleSelectAll}
          data-cy="selectAll"
        >
          Add all
        </Button>
      </div>
      <div
        role="group"
        aria-labelledby="checkbox-group"
        data-error={!!error && !!touched}
        className="bordered rounded-lg flex flex-col py-2 data-[error='true']:ring-1 data-[error='true']:ring-[var(--error)]"
      >
        {people.map((person, i) => (
          <label
            key={person.id}
            data-cy={`include-${i}`}
            className={classNames(
              "flex items-center justify-between p-3 w-full hover:bg-[var(--neutral-hover)] active:bg-[var(--neutral-press)]",
              {
                "bg-[var(--neutral-selected)]": include[person.id],
              }
            )}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="form-checkbox"
                name={`include[${person.id}]`}
                value={include[person.id] as any}
                checked={include[person.id]}
                onChange={handleChange}
              />
              <div className="flex items-center gap-2">
                <div>{person.name}</div>
              </div>
            </div>
            {include[person.id] && (
              <span className="text-[var(--primary)]">+{price}</span>
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
};
