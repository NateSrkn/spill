import { FiMinus, FiPlus, FiTrash2, FiUsers, FiX } from "react-icons/fi";
import { useReceiptStore } from "../../store";
import { getGroupSize, getInitials } from "../../utils";
import { Button, ButtonColorVariants, ButtonTypeVariant } from "../Button";
import { Input } from "../Input";
import styles from "./People.module.scss";

export const People = () => {
  const people = useReceiptStore((state) => state.people);
  const addPerson = useReceiptStore((state) => state.addPerson);
  const removePerson = useReceiptStore((state) => state.removePerson);
  const updatePerson = useReceiptStore((state) => state.updatePerson);

  const handleIncreaseGroupSize = () => {
    addPerson();
  };

  const handleDecreaseGroupSize = () => {
    if (people.length === 0) return;
    removePerson(people[people.length - 1].id);
  };
  return (
    <section className="grouped-block flex-col gap-6 " id="People">
      <header className={styles.header}>
        <h2 className="subheader">People</h2>
        <div className={styles.counter}>
          <Button
            name="decrease"
            aria-label="decrease"
            buttonVariant={ButtonTypeVariant.ICON}
            colorVariant={ButtonColorVariants.NONE}
            onClick={handleDecreaseGroupSize}
            style={
              {
                "--icon-size": "34px",
              } as React.CSSProperties
            }
          >
            <FiMinus />
          </Button>
          <div className="badge neutral">
            <span>
              <FiUsers />
            </span>
            <span>{people.length}</span>
          </div>
          <Button
            name="increase"
            aria-label="increase"
            buttonVariant={ButtonTypeVariant.ICON}
            colorVariant={ButtonColorVariants.NONE}
            onClick={handleIncreaseGroupSize}
            style={
              {
                "--icon-size": "34px",
              } as React.CSSProperties
            }
          >
            <FiPlus />
          </Button>
        </div>
      </header>
      <ul className="flex flex-col gap-3 ">
        {people.map((person, index) => (
          <div
            key={person.id}
            className={styles.person}
            data-cy={`person-${index}`}
          >
            <div
              className="avatar flex-shrink-0 tonal"
              style={
                {
                  "--avatar-size": "40px",
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
              colorVariant={ButtonColorVariants.NONE}
              onClick={() => removePerson(person.id)}
              style={
                {
                  "--icon-size": "32px",
                } as React.CSSProperties
              }
            >
              <FiTrash2 />
            </Button>
          </div>
        ))}
      </ul>
    </section>
  );
};
