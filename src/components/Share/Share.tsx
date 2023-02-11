import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import classNames from "classnames";
import { useMemo, useState } from "react";
import { FiDownload, FiRotateCcw } from "react-icons/fi";
import { Receipt, useReceiptStore } from "../../store";
import {
  BillSplitModesEnum,
  calculateBreakdown,
  convertToImage,
  toPascalCase,
} from "../../utils";
import { Button, ButtonColorVariants, ButtonTypeVariant } from "../Button";
import { IndividualBreakdown } from "../IndividualBreakdown";
import { TotalBreakdown } from "../TotalBreakdown";
import styles from "./Share.module.scss";

export const Share = ({ receipt }: { receipt: Receipt }) => {
  const [billSplitMode, setBillSplitMode] = useState(BillSplitModesEnum.TOTAL);
  const [selector, setSelector] = useState(".snapshot-block");
  const resetReceipt = useReceiptStore((state) => state.reset);
  const calculatedBreakdown = useMemo(
    () => calculateBreakdown(receipt),
    [receipt.items, receipt.tax, receipt.tip, receipt.people.length]
  );

  const shareAsImage = async () => {
    const shareBlock = document.querySelector<HTMLElement>(selector);
    if (!shareBlock) return;
    const prevBorder = shareBlock.style.borderRadius;
    shareBlock.style.borderRadius = "0px";

    try {
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={styles.share}>
      <h4 className={styles.toggleHeader}>Your bill, spilled</h4>
      <ToggleGroup
        billSplitMode={billSplitMode}
        setBillSplitMode={setBillSplitMode}
      />
      {billSplitMode === BillSplitModesEnum.TOTAL && (
        <TotalBreakdown calculatedBreakdown={calculatedBreakdown} />
      )}
      {billSplitMode === BillSplitModesEnum.INDIVIDUAL && (
        <IndividualBreakdown
          calculatedBreakdown={calculatedBreakdown}
          setSelector={setSelector}
        />
      )}

      <section className={styles.buttonGroup}>
        <Button
          buttonVariant={ButtonTypeVariant.ICON_BUTTON_WITH_TEXT}
          colorVariant={ButtonColorVariants.DARK}
          icon={FiDownload}
          onClick={() => shareAsImage()}
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

const ToggleGroup = ({
  setBillSplitMode,
  billSplitMode,
}: {
  setBillSplitMode: (mode: BillSplitModesEnum) => void;
  billSplitMode: BillSplitModesEnum;
}) => {
  return (
    <ToggleGroupPrimitive.Root
      type="single"
      className={styles.toggleGroup}
      defaultValue={BillSplitModesEnum.TOTAL}
      onValueChange={(value: BillSplitModesEnum) =>
        value ? setBillSplitMode(value) : null
      }
    >
      <ToggleGroupPrimitive.Item
        value={BillSplitModesEnum.TOTAL}
        className={classNames(styles.toggleButton, "rounded-l-lg", {
          [styles.active]: billSplitMode === BillSplitModesEnum.TOTAL,
        })}
      >
        Total
      </ToggleGroupPrimitive.Item>
      <ToggleGroupPrimitive.Item
        value={BillSplitModesEnum.INDIVIDUAL}
        className={classNames(styles.toggleButton, "rounded-r-lg", {
          [styles.active]: billSplitMode === BillSplitModesEnum.INDIVIDUAL,
        })}
      >
        Individual
      </ToggleGroupPrimitive.Item>
    </ToggleGroupPrimitive.Root>
  );
};
