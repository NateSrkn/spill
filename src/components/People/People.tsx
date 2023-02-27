import { FiMinus, FiPlus, FiTrash2, FiUsers } from "react-icons/fi";
import { Person, useReceiptStore } from "../../store";

import { Avatar } from "../Avatar";
import { Button } from "../Button";
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
            intent="icon"
            onClick={handleDecreaseGroupSize}
          >
            <FiMinus size={24} />
          </Button>
          <div className="badge neutral">
            <span>
              <FiUsers size={16} />
            </span>
            <span>{people.length}</span>
          </div>
          <Button
            name="increase"
            aria-label="increase"
            intent="icon"
            onClick={handleIncreaseGroupSize}
          >
            <FiPlus size={24} />
          </Button>
        </div>
      </header>
      <ul className="flex flex-col gap-3 ">
        {people.map((person, index) => (
          <li key={person.id} data-cy={`person-${index}`}>
            <Person
              person={person}
              updatePerson={updatePerson}
              removePerson={removePerson}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

const Person = ({
  person,
  updatePerson,
  removePerson,
}: {
  person: Person;
  updatePerson: (id: number, value: any) => void;
  removePerson: (id: number) => void;
}) => {
  return (
    <div className={styles.person}>
      <Avatar name={person.name} size="small" colors="tonal" />
      <Input
        value={person.name}
        name="name"
        type="text"
        handleChange={(_name, value) => updatePerson(person.id, value)}
      />
      <Button intent="icon" onClick={() => removePerson(person.id)}>
        <FiTrash2 size={24} />
      </Button>
    </div>
  );
};
