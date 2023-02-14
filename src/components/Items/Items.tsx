import { ItemDialog } from "../ItemDialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button, ButtonColorVariants, ButtonTypeVariant } from "../Button";
import { FiEdit, FiMoreVertical, FiTrash, FiUsers } from "react-icons/fi";
import { Item, Person, useReceiptStore } from "../../store";
import { useState } from "react";
import {
  currencyFormatter,
  getFirstNameAndInitial,
  getGroupSize,
} from "../../utils";
export const Items = () => {
  const items = useReceiptStore((state) => state.items);
  const people = useReceiptStore((store) =>
    store.people.reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {} as { [key: number]: Person })
  );
  const removeItem = useReceiptStore((state) => state.removeItem);
  const getCostDisplayText = (item: Item) => {
    let base = currencyFormatter.format(item.value);
    const groupSize = getGroupSize(item.include);
    if (item.shared) {
      base += ` (÷ ${groupSize})`;
    } else if (groupSize >= 2 && !item.shared) {
      base += " each";
    }
    return base;
  };

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
                <div className="border-b  border-b-[#D0D5DD] py-3 px-4 flex gap-4 justify-between items-center">
                  <div className="truncate">
                    <h4 className="font-medium truncate">{item.title}</h4>
                    <div className="truncate text-[#667085]">
                      {getCostDisplayText(item)}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getGroupSize(item.include) >= 2 ? (
                      <div className="badge text-purple-600 bg-purple-100">
                        <span>
                          <FiUsers />
                        </span>
                        <span>{getGroupSize(item.include)}</span>
                      </div>
                    ) : null}
                    <ItemDropdown
                      item={item}
                      removeItem={() => removeItem(item.id)}
                    />
                  </div>
                </div>
                <ul className="flex flex-wrap gap-2 text-sm px-2 py-2">
                  {Object.keys(item.include).map((id) =>
                    item.include[Number(id)] ? (
                      <li key={id} className="bg-gray-100 badge">
                        {getFirstNameAndInitial(people[Number(id)].name)}
                      </li>
                    ) : null
                  )}
                </ul>
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
          buttonVariant={ButtonTypeVariant.ICON}
          colorVariant={ButtonColorVariants.NONE}
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
