import classNames from "classnames";

import { useReceiptStore } from "$/store";
import {
  getFirstNameAndInitial,
  FullBreakdown,
  currencyFormatter,
  getInitials,
} from "$/utils";

export const TotalBreakdown = ({
  calculatedBreakdown,
}: {
  calculatedBreakdown: FullBreakdown;
}) => {
  const receipt = useReceiptStore();

  return (
    <section className="snapshot-block">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[85%,1fr]">
          <div className="w-full">
            <h2 className="main-header truncate" data-cy="grossTotal">
              {calculatedBreakdown.grossTotal}
            </h2>
            <p className="subtext">
              Shared with {receipt.people.length} people
            </p>
          </div>
          <div
            className={classNames("flex-shrink-0 avatar neutral", {
              emoji: receipt.avatar,
              text: !receipt.avatar,
            })}
          >
            {receipt.avatar || getInitials(receipt.title)}
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-2">
          {receipt.people.map((person) => (
            <div
              className="flex flex-col p-4 justify-center rounded-lg neutral"
              key={person.name}
            >
              <div className="font-medium">
                {getFirstNameAndInitial(person.name)}
              </div>
              <div className=" truncate subtext">
                {currencyFormatter.format(
                  calculatedBreakdown.perPerson[person.id]?.gross || 0
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="subtext flex justify-between pt-4">
          <div>{receipt.title}</div>
        </div>
      </div>
    </section>
  );
};
