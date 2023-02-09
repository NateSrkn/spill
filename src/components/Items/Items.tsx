import { useAtom } from "jotai";
import { itemsAtom, removeItemAtom, updateItemAtom } from "../../store/items";
import { Input } from "../Input";
import { ItemDialog } from "../ItemDialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button, ButtonColorVariants, ButtonTypeVariant } from "../Button";
import { FiMoreVertical } from "react-icons/fi";
export const Items = () => {
  const [, updateItem] = useAtom(updateItemAtom);
  const [, removeItem] = useAtom(removeItemAtom);
  const [items] = useAtom(itemsAtom);

  const handleRemoveItem = (id: number) => {
    removeItem(id);
  };

  return (
    <section className="grouped-block flex-col gap-2">
      <h3>Items</h3>
      {items.length ? (
        <div className="grid grid-cols-[1fr,1fr,.25fr] gap-4">
          <label htmlFor="title">Item</label>
          <label htmlFor="amount">Amount</label>
        </div>
      ) : null}
      {items.map((item) => (
        <div key={item.id} className="grid grid-cols-[1fr,1fr,.25fr] gap-4">
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
            handleChange={(name, value) => updateItem(item.id, name, value)}
          />
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button buttonVariant={ButtonTypeVariant.ICON}>
                <FiMoreVertical />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white flex flex-col p-2 max-w-xs w-full rounded border">
                <DropdownMenu.Item asChild>
                  <button
                    className="text-left"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Delete
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <ItemDialog
                    trigger={<button className="text-left">Edit Item</button>}
                    initialItem={item}
                  />
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      ))}
      <ItemDialog
        trigger={
          <Button colorVariant={ButtonColorVariants.TONAL}>Add Item</Button>
        }
      />
    </section>
  );
};
