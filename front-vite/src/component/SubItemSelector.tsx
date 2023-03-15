import React, { useState } from 'react';
import { MinimalSubItem, TypeOfName, TYPE_OF_NAME_LIST } from '../type/SubItem';
import BaseSelect from './BaseSelect';
import Button from './Button';

interface SubItemSelectorProp {
  subItems: MinimalSubItem[];
  createSubItem: (type: TypeOfName) => void;
  attachSubItem: (id: string) => void;
}

export default function SubItemSelector({
  subItems,
  createSubItem,
  attachSubItem,
}: SubItemSelectorProp) {
  const [type, setType] = useState<TypeOfName>(TYPE_OF_NAME_LIST[0]);
  const [itemId, setItemId] = useState<string | null>(subItems?.[0]?.id);
  return (
    <div className="flex flex-col">
      <div className="flex [&>*]:w-1/2 gap-2 mb-2">
        <BaseSelect
          name="selectNo"
          value={itemId}
          values={subItems.map((si) => ({ key: si.id, displayName: si.name }))}
          onChange={(_, value) => {
            setItemId(value as string);
          }}
        />
        <BaseSelect
          name="selectSubObject"
          value={type}
          values={TYPE_OF_NAME_LIST}
          onChange={(_, value) => {
            setType(value as TypeOfName);
          }}
        />
      </div>
      <div className="flex [&>*]:w-1/2 gap-2">
        <Button
          color="bg-blue-500"
          textColor="text-white"
          text="Attach an existing object"
          available={!!itemId}
          onClick={() => attachSubItem(itemId!)}
        />
        <Button
          color="bg-blue-500"
          textColor="text-white"
          text="Create new object"
          available={!!type}
          onClick={() => createSubItem(type!)}
        />
      </div>
    </div>
  );
}
