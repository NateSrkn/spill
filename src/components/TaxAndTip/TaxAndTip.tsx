import { Input } from "../Input";

export const TaxAndTip = ({
  tax,
  tip,
  handleUpdateReceiptMeta,
}: {
  tax: number;
  tip: number;
  handleUpdateReceiptMeta: (name: string, value: string) => void;
}) => {
  return (
    <section className="grouped-block gap-4 w-full">
      <h3>Tax and Tip</h3>
      <div className="grid grid-cols-[1fr,1fr] gap-4">
        <div>
          <label htmlFor="tax">Tax</label>
          <Input
            value={tax}
            name="tax"
            className="w-full"
            asCurrency
            handleChange={handleUpdateReceiptMeta}
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
          />
        </div>
      </div>
    </section>
  );
};
