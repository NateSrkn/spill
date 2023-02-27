import { Receipt } from "../../store";
import { Avatar } from "../Avatar";
import { Input } from "../Input";

export const ReceiptMeta = ({
  receipt,
  handleUpdateReceiptMeta,
}: {
  receipt: Receipt;
  handleUpdateReceiptMeta: <T extends keyof Receipt>(
    name: T,
    value: Receipt[T]
  ) => void;
}) => {
  return (
    <section className="grouped-block justify-center items-center gap-2">
      <Avatar name={receipt.title} />
      <label className="sr-only" htmlFor="title">
        Event Title
      </label>
      <Input
        className="text-center subheader max-w-max"
        type="text"
        name="title"
        changeOnFocus={false}
        value={receipt.title}
        handleChange={handleUpdateReceiptMeta}
      />
    </section>
  );
};
