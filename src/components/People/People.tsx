import { useAtom } from "jotai";
import { ChangeEventHandler } from "react";
import { FiMinus, FiPlus, FiX } from "react-icons/fi";
import {
  addPersonAtom,
  peopleAtom,
  personAtom,
  removePersonAtom,
  updatePersonAtom,
} from "../../store/people";
import { getInitials } from "../../utils";
import { Button, ButtonColorVariants, ButtonTypeVariant } from "../Button";
import { Input } from "../Input";
import styles from "./People.module.scss";

export const People = () => {
  const [, addPerson] = useAtom(addPersonAtom);
  const [, removePerson] = useAtom(removePersonAtom);
  const [, updatePerson] = useAtom(updatePersonAtom);
  const [, setPerson] = useAtom(personAtom);
  const [people] = useAtom(peopleAtom);
  const handleIncreaseGroupSize = () => {
    setPerson({ name: `Person ${people.length + 1}`, id: Date.now() });
    addPerson();
  };
  const handleGroupSizeInput: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const { currentTarget } = event;
    if (!currentTarget) return;
    const absolute = Math.abs(Number(currentTarget.value));
    event.currentTarget.value = `${absolute}`;
    const difference = Math.abs(people.length - absolute);
    let prevNameNumber = people.length;
    if (people.length < absolute) {
      for (let i = 0; i < difference; i++) {
        prevNameNumber++;
        setPerson({
          name: `Person ${prevNameNumber}`,
        });
        addPerson();
      }
    } else {
      // people = people.slice(0, absolute);
    }
  };

  const handleDecreaseGroupSize = () => {
    if (people.length === 0) return;
    removePerson(people[people.length - 1].id);
  };
  return (
    <section className="grouped-block flex-col gap-4" id="People">
      <header className={styles.header}>
        <h3>People</h3>
        <div className={styles.counter}>
          <Button
            name="decrease"
            aria-label="decrease"
            buttonVariant={ButtonTypeVariant.ICON}
            onClick={handleDecreaseGroupSize}
          >
            <FiMinus />
          </Button>
          <div className={styles.count}>{people.length}</div>
          <Button
            name="increase"
            aria-label="increase"
            buttonVariant={ButtonTypeVariant.ICON}
            onClick={handleIncreaseGroupSize}
          >
            <FiPlus />
          </Button>
        </div>
      </header>
      {people.map((person) => (
        <div key={person.id} className={styles.person}>
          <div
            className="avatar flex-shrink-0"
            style={
              {
                "--avatar-size": "48px",
              } as React.CSSProperties
            }
          >
            {getInitials(person.name)}
          </div>
          <Input
            value={person.name}
            name="name"
            type="text"
            handleChange={(_name, value) => updatePerson(person.id, value)}
          />
          <Button
            buttonVariant={ButtonTypeVariant.ICON}
            colorVariant={ButtonColorVariants.DELETE}
            style={{ "--icon-size": "32px" } as React.CSSProperties}
            onClick={() => removePerson(person.id)}
          >
            <FiX />
          </Button>
        </div>
      ))}
    </section>
  );
};
