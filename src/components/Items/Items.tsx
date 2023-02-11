import { ItemDialog } from "../ItemDialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button, ButtonColorVariants, ButtonTypeVariant } from "../Button";
import { FiEdit, FiMoreVertical, FiTrash } from "react-icons/fi";
import { Item, Person, useReceiptStore } from "../../store";
import { useState } from "react";
import { currencyFormatter, getFirstNameAndInitial } from "../../utils";
export const Items = () => {
  const items = useReceiptStore((state) => state.items);
  const people = useReceiptStore((store) =>
    store.people.reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {} as { [key: number]: Person })
  );
  const removeItem = useReceiptStore((state) => state.removeItem);

  return (
    <section className="grouped-block flex-col gap-4">
      <h3>Items</h3>
      {items.length ? (
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="border border-[#D0D5DD] rounded-lg relative "
            >
              <section>
                <div className="border-b  border-b-[#D0D5DD] py-2 px-4 grid grid-cols-[1fr,1fr,.05fr] gap-4 justify-center items-center">
                  <div className="truncate">
                    <div className="text-sm truncate">Item</div>
                    <h4 className="font-medium text-lg truncate">
                      {item.title}
                    </h4>
                  </div>
                  <div className="truncate">
                    <div className="text-sm truncate">Value</div>
                    <div className="truncate font-medium text-lg">
                      {currencyFormatter.format(item.value)}
                    </div>
                  </div>
                </div>
                <ul className="flex flex-wrap gap-2 text-sm px-2 py-2">
                  {Object.keys(item.include).map((id) =>
                    item.include[Number(id)] ? (
                      <li key={id} className="bg-gray-100 px-2 py-1 rounded-lg">
                        {getFirstNameAndInitial(people[Number(id)].name)}
                      </li>
                    ) : null
                  )}
                </ul>
              </section>
              <section className="absolute top-1 right-1">
                <ItemDropdown
                  item={item}
                  removeItem={() => removeItem(item.id)}
                />
              </section>
            </li>
          ))}
        </ul>
      ) : null}
      <ItemDialog
        trigger={
          <Button colorVariant={ButtonColorVariants.TONAL}>Add Item</Button>
        }
      />
    </section>
  );
};

const ItemDropdown = ({
  item,
  removeItem,
}: {
  item: Item;
  removeItem: () => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <Button
          buttonVariant={ButtonTypeVariant.TEXT}
          className="hover:bg-gray-100 transition-colors p-2 rounded-full"
          style={{ "--icon-size": "32px" } as React.CSSProperties}
        >
          <FiMoreVertical />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-white flex flex-col p-2 max-w-xs w-32 rounded-md border space-y-1 text-sm">
          <DropdownMenu.Item asChild>
            <button
              className="text-left flex items-center gap-2 py-1 px-2 hover:bg-red-100 hover:text-red-600 transition-colors rounded"
              onClick={removeItem}
            >
              <FiTrash />
              Delete
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <ItemDialog
              trigger={
                <button className="text-left flex items-center gap-2 py-1 px-2 hover:bg-gray-100 transition-colors rounded">
                  <FiEdit />
                  Edit Item
                </button>
              }
              initialItem={item}
            />
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
