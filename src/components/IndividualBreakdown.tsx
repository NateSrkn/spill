import {
  currencyFormatter,
  formatDateForDisplay,
  FullBreakdown,
  getFirstNameAndInitial,
  getInitials,
  PerPersonBreakdown,
} from "$/utils";
import classNames from "classnames";
import { useEffect, useRef } from "react";
import { Person, useReceiptStore } from "../store";

export const IndividualBreakdown = ({
  calculatedBreakdown,
  setSelector,
}: {
  setSelector: (value: string) => void;
  calculatedBreakdown: FullBreakdown;
}) => {
  const people = useReceiptStore((state) => state.people);
  const title = useReceiptStore((state) => state.title);
  const avatar = useReceiptStore((state) => state.avatar);
  const date = useReceiptStore((state) => state.date);
  const groupSize = Object.keys(calculatedBreakdown.perPerson).length;
  return (
    <ul className="hz-scroll gap-4">
      {people.map((person) => (
        <PersonCard
          setSelector={setSelector}
          key={person.id}
          person={person}
          breakdown={calculatedBreakdown.perPerson[person.id]}
          avatar={avatar || getInitials(title)}
          groupSize={groupSize}
          title={title}
          date={date}
        />
      ))}
    </ul>
  );
};

interface PersonCardProps {
  person: Person;
  breakdown: PerPersonBreakdown;
  avatar: string;
  groupSize: number;
  title: string;
  date: string;
  setSelector: (value: string) => void;
}

const PersonCard = ({
  person,
  breakdown,
  avatar,
  groupSize,
  title,
  date,
  setSelector,
}: PersonCardProps) => {
  const scrollRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSelector(`#${entry.target.id}`);
          }
        });
      },
      { threshold: [0] }
    );
    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }
    return () => {
      if (scrollRef.current) {
        observer.unobserve(scrollRef.current);
      }
    };
  }, []);

  return (
    <li
      className="snapshot-block"
      ref={scrollRef}
      id={`snap-${person.id.toString()}`}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[85%,1fr]">
          <div className="w-full">
            <h2 className="text-3xl truncate">
              {getFirstNameAndInitial(person.name)}
            </h2>
            <p className="text-[#D0D5DD]">Shared with {groupSize} people</p>
          </div>
          <div
            className={classNames("flex-shrink-0 avatar", {
              emoji: avatar,
              text: !avatar,
            })}
          >
            {avatar}
          </div>
        </div>
        <div className="w-full flex flex-col gap-4 text-[#667085]">
          {breakdown?.items.length
            ? breakdown.items.map((item) => (
                <div
                  className="flex justify-between items-center"
                  key={item.id}
                >
                  <div className="truncate">{item.title}</div>
                  <div className="truncate">{item.formattedTotal}</div>
                </div>
              ))
            : null}
          <div className="flex justify-between items-center">
            <div className="truncate">Tax and Tip</div>
            <div className="truncate">
              {currencyFormatter.format(breakdown?.shared || 0)}
            </div>
          </div>
          <div className="flex justify-between items-center text-white text-xl">
            <div className="truncate">Total</div>
            <div className="truncate">
              {currencyFormatter.format(breakdown?.gross || 0)}
            </div>
          </div>
        </div>
        <hr className="border-[#667085] border-1" />
        <div className="text-[#667085] flex justify-between">
          <div>{title}</div>
          <div>{date ? formatDateForDisplay(date) : ""}</div>
        </div>
      </div>
    </li>
  );
};
