import classNames from "classnames";
import { useAtom } from "jotai";
import { FiCheck } from "react-icons/fi";
import { peopleAtom } from "../../store/people";
import { getInitials } from "../../utils";
import { Button, ButtonColorVariants, ButtonTypeVariant } from "../Button";
import { ChangeEventHandler, useState } from "react";
import { Include } from "../../store/items";
export const PeopleSelect = ({
  include,
  handleChange,
}: {
  include: Include;
  handleChange: ChangeEventHandler<HTMLInputElement>;
}) => {
  const [toggleStatus, setToggleStatus] = useState(false);
  const [people] = useAtom(peopleAtom);

  const handleSelectAll = () => {
    const include = people.reduce((acc, p) => {
      acc[p.id] = !toggleStatus;
      return acc;
    }, {} as Include);
    handleChange({ currentTarget: { name: "include", value: include } });
    setToggleStatus(!toggleStatus);
  };

  return (
    <fieldset className="flex flex-col gap-2">
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
        className="border-[#EAECF0] border rounded-lg flex flex-col"
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
              value={include[person.id]}
              onChange={handleChange}
            />
            {include[person.id] && <FiCheck className="text-purple-600" />}
          </label>
        ))}
      </div>
    </fieldset>
  );
};
