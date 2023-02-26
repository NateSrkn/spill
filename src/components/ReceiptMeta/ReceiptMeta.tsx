import { Receipt } from "../../store";
import { getInitials } from "../../utils";
import Avatar from "../Avatar/Avatar";
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
        className="text-center text-3xl max-w-max"
        type="text"
        name="title"
        changeOnFocus={false}
        value={receipt.title}
        handleChange={handleUpdateReceiptMeta}
      />
    </section>
  );
};
