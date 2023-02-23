import { UpdateReceiptMeta, useReceiptStore } from "../../store";
import { Input } from "../Input";

export const TaxAndTip = ({
  handleUpdateReceiptMeta,
}: {
  handleUpdateReceiptMeta: UpdateReceiptMeta;
}) => {
  const [tax, tip] = useReceiptStore((state) => [state.tax, state.tip]);
  return (
    <section className="grouped-block gap-4 w-full">
      <h2 className="subheader">Tax and Tip</h2>
      <div className="grid grid-cols-[1fr,1fr] gap-4">
        <div>
          <label htmlFor="tax">Tax</label>
          <Input
            value={tax}
            name="tax"
            className="w-full"
            asCurrency
            handleChange={handleUpdateReceiptMeta}
            data-cy="taxInput"
          />
        </div>
        <div>
          <label htmlFor="tip">Tip</label>
          <Input
            value={tip}
            name="tip"
            className="w-full"
            asCurrency
            handleChange={handleUpdateReceiptMeta}
            data-cy="tipInput"
          />
        </div>
      </div>
    </section>
  );
};
