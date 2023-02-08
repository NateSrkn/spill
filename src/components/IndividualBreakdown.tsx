import {
  formatDateForDisplay,
  FullBreakdown,
  getFirstNameAndInitial,
  getInitials,
} from "$/utils";
import classNames from "classnames";
import { useAtom } from "jotai";
import { receiptAtom, receiptAvatar } from "../store/store";

export const IndividualBreakdown = ({
  calculatedBreakdown,
}: {
  calculatedBreakdown: FullBreakdown;
}) => {
  const [receipt] = useAtom(receiptAtom);
  const [avatar] = useAtom(receiptAvatar);
  const groupSize = calculatedBreakdown.perPerson.length;
  return (
    <ul className="hz-scroll gap-4">
      {calculatedBreakdown.perPerson.map((person) => (
        <li className="snapshot-block" key={person.name}>
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
              {person.items.map((item, index) => (
                <div
                  className="flex justify-between items-center"
                  key={item.total + index}
                >
                  <div className="truncate">{item.title}</div>
                  <div className="truncate">{item.formattedTotal}</div>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <div className="truncate">Tax and Tip</div>
                <div className="truncate">
                  {person.individualSharedFormatted}
                </div>
              </div>
              <div className="flex justify-between items-center text-white text-xl">
                <div className="truncate">Total</div>
                <div className="truncate">
                  {person.individualGrossFormatted}
                </div>
              </div>
            </div>
            <hr className="border-[#667085] border-1" />
            <div className="text-[#667085] flex justify-between">
              <div>{receipt.title}</div>
              <div>
                {receipt.date ? formatDateForDisplay(receipt.date) : ""}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
