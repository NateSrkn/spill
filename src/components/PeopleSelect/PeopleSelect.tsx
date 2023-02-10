import classNames from "classnames";
import { FiCheck } from "react-icons/fi";
import { getInitials } from "../../utils";
import { Button, ButtonColorVariants, ButtonTypeVariant } from "../Button";
import { ChangeEventHandler, useState } from "react";
import { Include } from "../../store/items";
import { FormikErrors, FormikTouched } from "formik";
import { useReceiptStore } from "../../store";
export const PeopleSelect = ({
  include,
  handleChange,
  error,
  touched,
}: {
  include: Include;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  error?: FormikErrors<Include>;
  touched?: FormikTouched<Include>;
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
      {hasError ? <div className="text-red-600 text-sm">{error}</div> : null}
      <div className="flex justify-between">
        <label htmlFor="included">Include</label>
        <Button
          buttonVariant={ButtonTypeVariant.TEXT}
          colorVariant={ButtonColorVariants.PRIMARY}
          type="button"
          onClick={handleSelectAll}
        >
          Select All
        </Button>
      </div>
      <div
        role="group"
        aria-labelledby="checkbox-group"
        className={classNames(
          "border-[#EAECF0] border rounded-lg flex flex-col",
          {
            "border-none ring ring-red-600": hasError,
          }
        )}
      >
        {people.map((person) => (
          <label
            key={person.id}
            className={classNames(
              "flex items-center justify-between p-3 w-full",
              {
                "bg-[#F9FAFB]": include[person.id],
              }
            )}
          >
            <div className="flex items-center gap-2">
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
              <div>{person.name}</div>
            </div>
            <input
              type="checkbox"
              className="hidden"
              name={`include[${person.id}]`}
              value={include[person.id] as any}
              onChange={handleChange}
            />
            {include[person.id] && <FiCheck className="text-purple-600" />}
          </label>
        ))}
      </div>
    </fieldset>
  );
};
