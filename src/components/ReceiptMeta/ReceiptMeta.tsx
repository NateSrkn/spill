import { useAtom } from "jotai";
import { Item } from "../../store/items";
import { Receipt, receiptAvatar } from "../../store/store";
import { Input } from "../Input";

export const ReceiptMeta = ({
  receipt,
  handleUpdateReceiptMeta,
}: {
  receipt: Receipt;
  handleUpdateReceiptMeta: (name: string, value: string) => void;
}) => {
  const [avatar] = useAtom(receiptAvatar);
  return (
    <section className="grouped-block justify-center items-center gap-4">
      <div
        className="avatar"
        style={
          {
            "--font-size": receipt.avatar ? "32px" : "20px",
          } as React.CSSProperties
        }
      >
        {avatar}
      </div>
      <label className="sr-only" htmlFor="title">
        Event Title
      </label>
      <Input
        className="text-center text-3xl max-w-max"
        type="text"
        name="title"
        changeOnFocus={false}
        value={receipt.title}
        handleChange={handleUpdateReceiptMeta}
      />
      <label className="sr-only" htmlFor="date">
        Date
      </label>
      <Input
        className="text-center max-w-[170px]"
        type="date"
        value={receipt.date}
        name="date"
        handleChange={handleUpdateReceiptMeta}
      />
    </section>
  );
};
