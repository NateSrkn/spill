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
import { Button } from "../Button";
import { btn } from "../Button/Button";
import { IndividualBreakdown } from "../IndividualBreakdown";
import { TotalBreakdown } from "../TotalBreakdown";
import styles from "./Share.module.scss";

export const Share = ({ receipt }: { receipt: Receipt }) => {
  const [billSplitMode, setBillSplitMode] = useState(
    BillSplitModesEnum.SUMMARY
  );
  const [selector, setSelector] = useState(".snapshot-block");
  const resetReceipt = useReceiptStore((state) => state.reset);
  const calculatedBreakdown = useMemo(
    () => calculateBreakdown(receipt),
    [receipt.items, receipt.tax, receipt.tip, receipt.people.length]
  );

  const shareAsImage = async () => {
    const currentSelector =
      billSplitMode === BillSplitModesEnum.SUMMARY ? "#summary" : selector;
    const shareBlock = document.querySelector<HTMLElement>(currentSelector);
    if (!shareBlock) return;
    const prevBorderRadius = shareBlock.style.borderRadius;
    const prevBorder = shareBlock.style.border;
    shareBlock.style.borderRadius = "0px";
    shareBlock.style.border = "none";
    try {
      await convertToImage(shareBlock, (blob) => {
        shareBlock.style.borderRadius = prevBorderRadius;
        shareBlock.style.border = prevBorder;
        if (!blob) return;
        if (navigator.share) {
          const file = new File([blob], `${toPascalCase(receipt.title)}.jpg`, {
            type: "image/jpeg",
          });
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
    <>
      <h4 className={styles.toggleHeader}>Your bill, spilled</h4>
      <ToggleGroup
        billSplitMode={billSplitMode}
        setBillSplitMode={setBillSplitMode}
      />
      {billSplitMode === BillSplitModesEnum.SUMMARY && (
        <TotalBreakdown calculatedBreakdown={calculatedBreakdown} />
      )}
      {billSplitMode === BillSplitModesEnum.BREAKDOWN && (
        <IndividualBreakdown
          calculatedBreakdown={calculatedBreakdown}
          setSelector={setSelector}
        />
      )}

      <section className={styles.buttonGroup}>
        <Button onClick={() => shareAsImage()} colors="none" intent="none">
          <div
            className={btn({ intent: "icon" })}
            style={{ "--icon-size": "var(--icon-lg)" } as React.CSSProperties}
          >
            <FiDownload size={24} />
          </div>
          <div>Save Image</div>
        </Button>
        <Button
          onClick={() => {
            resetReceipt();
            window.scrollTo({ top: 0 });
          }}
          data-cy="resetReceipt"
          colors="none"
          intent="none"
        >
          <div
            className={btn({ intent: "icon" })}
            style={{ "--icon-size": "var(--icon-lg)" } as React.CSSProperties}
          >
            <FiRotateCcw size={24} />
          </div>
          <div>Start Over</div>
        </Button>
      </section>
    </>
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
      defaultValue={BillSplitModesEnum.SUMMARY}
      onValueChange={(value: BillSplitModesEnum) => {
        if (value) setBillSplitMode(value);
      }}
    >
      <ToggleGroupPrimitive.Item
        value={BillSplitModesEnum.SUMMARY}
        className={classNames(
          btn({
            intent: "none",
            colors:
              billSplitMode === BillSplitModesEnum.SUMMARY
                ? "primary"
                : "neutral",
            size: "lg",
          }),
          "rounded-l-lg border-[var(--outline)] border w-full"
        )}
      >
        Summary
      </ToggleGroupPrimitive.Item>
      <ToggleGroupPrimitive.Item
        value={BillSplitModesEnum.BREAKDOWN}
        className={classNames(
          btn({
            intent: "none",
            colors:
              billSplitMode === BillSplitModesEnum.BREAKDOWN
                ? "primary"
                : "neutral",
            size: "lg",
          }),
          "rounded-r-lg border-[var(--outline)] border w-full"
        )}
      >
        Breakdown
      </ToggleGroupPrimitive.Item>
    </ToggleGroupPrimitive.Root>
  );
};
