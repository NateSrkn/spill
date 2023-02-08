import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import classNames from "classnames";
import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useMemo, useState } from "react";
import { FiDownload, FiRotateCcw } from "react-icons/fi";
import { Receipt, receiptAtom, subtotalAtom } from "../../store/store";
import {
  BillSplitModesEnum,
  calculateBreakdown,
  convertToImage,
  toPascalCase,
} from "../../utils";
import { Button, ButtonColorVariants, ButtonTypeVariant } from "../Button";
import { IndividualBreakdown } from "../IndividualBreakdown";
import { TotalBreakdown } from "../TotalBreakdown";
export const Share = ({ receipt }: { receipt: Receipt }) => {
  const [billSplitMode, setBillSplitMode] = useState(BillSplitModesEnum.TOTAL);
  const [subtotal] = useAtom(subtotalAtom);
  const resetReceipt = useResetAtom(receiptAtom);

  const calculatedBreakdown = useMemo(
    () => calculateBreakdown(receipt),
    [subtotal, receipt.tax, receipt.tip, receipt.people.length]
  );

  const shareAsImage = async () => {
    const shareBlock = document.querySelector<HTMLElement>(".snapshot-block");
    if (!shareBlock) return;
    const prevBorder = shareBlock.style.borderRadius;
    shareBlock.style.borderRadius = "0px";
    await convertToImage(shareBlock, (blob) => {
      shareBlock.style.borderRadius = prevBorder;
      if (!blob) return;
      if (navigator.share) {
        const file = new File(
          [blob],
          `${receipt.date}_${toPascalCase(receipt.title)}.jpg`,
          {
            type: "image/jpeg",
          }
        );
        navigator
          .share({
            title: receipt.title,
            files: [file],
            url: window.location.href,
          })
          .then(() => console.log("Successful share"))
          .catch((error) => console.log("Error sharing", error));
      } else if (window.ClipboardItem) {
        navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      } else {
        console.log("Unable to save to clipboard");
      }
    });
  };

  return (
    <section className="flex flex-col gap-4 p-4 md:px-0 md:py-4 max-w-md mx-auto">
      <h4 className="text-2xl px-4 mt-6 font-semibold text-[#F2F4F7]">
        Your bill, spilled
      </h4>
      <ToggleGroupPrimitive.Root
        type="single"
        className="flex text-[#F2F4F7] font-semibold text-base px-4"
        defaultValue={BillSplitModesEnum.TOTAL}
        onValueChange={(value: BillSplitModesEnum) =>
          value ? setBillSplitMode(value) : null
        }
      >
        <ToggleGroupPrimitive.Item
          value={BillSplitModesEnum.TOTAL}
          className={classNames("breakdown rounded-l-lg", {
            "active-mode": billSplitMode === BillSplitModesEnum.TOTAL,
          })}
        >
          Total
        </ToggleGroupPrimitive.Item>
        <ToggleGroupPrimitive.Item
          value={BillSplitModesEnum.INDIVIDUAL}
          className={classNames("breakdown rounded-r-lg", {
            "active-mode": billSplitMode === BillSplitModesEnum.INDIVIDUAL,
          })}
        >
          Individual
        </ToggleGroupPrimitive.Item>
      </ToggleGroupPrimitive.Root>
      {billSplitMode === BillSplitModesEnum.TOTAL && (
        <TotalBreakdown calculatedBreakdown={calculatedBreakdown} />
      )}
      {billSplitMode === BillSplitModesEnum.INDIVIDUAL && (
        <IndividualBreakdown calculatedBreakdown={calculatedBreakdown} />
      )}

      <section className="p-4 grid grid-cols-2">
        <Button
          buttonVariant={ButtonTypeVariant.ICON_BUTTON_WITH_TEXT}
          colorVariant={ButtonColorVariants.DARK}
          icon={FiDownload}
          onClick={shareAsImage}
        >
          Save Image
        </Button>
        <Button
          buttonVariant={ButtonTypeVariant.ICON_BUTTON_WITH_TEXT}
          colorVariant={ButtonColorVariants.DARK}
          icon={FiRotateCcw}
          onClick={resetReceipt}
        >
          Restart
        </Button>
      </section>
    </section>
  );
};
