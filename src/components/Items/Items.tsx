import { useAtom } from "jotai";
import { itemsAtom, updateItemAtom } from "../../store/items";
import { Receipt } from "../../store/store";
import { Input } from "../Input";
import { ItemDialog } from "../ItemDialog";

export const Items = () => {
  const [, updateItem] = useAtom(updateItemAtom);
  const [items] = useAtom(itemsAtom);
  return (
    <section className="grouped-block flex-col gap-4">
      <h3>Items</h3>
      {items.map((item) => (
        <div key={item.id} className="grid grid-cols-2 gap-4">
          <Input
            value={item.title}
            className="w-full"
            type="text"
            name="title"
            handleChange={(name, value) => updateItem(item.id, name, value)}
          />
          <Input
            value={item.value}
            className="w-full"
            type="number"
            asCurrency
            name="value"
            handleChange={(name, value) =>
              updateItem(item.id, name, Number(value))
            }
          />
        </div>
      ))}
      <ItemDialog />
    </section>
  );
};
