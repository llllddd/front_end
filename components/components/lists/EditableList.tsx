'use client';

import React, { FC, KeyboardEvent } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Plus } from 'lucide-react';

import StringList from './StringList';
import InfoPopover from '../InfoPopover';

interface EditableListProps {
  name: string;
  type?: string;
  preserveItem?: boolean;
  headerLabel: string;
  label: string;
  info?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  onChangeArr: (arr: string[]) => void;
  onAdd: () => void;
  editableOrder?: boolean;
}

const EditableList: FC<EditableListProps> = ({
  name,
  type,
  preserveItem,
  headerLabel,
  label,
  info,
  value,
  options,
  onChange,
  onChangeArr,
  onAdd,
  editableOrder,
}) => {

  const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAdd();
    }
  };

  return (
    <div className="border border-gray-300 rounded p-4 mb-6">
      <h3 className="font-normal text-sm mb-6">{headerLabel}</h3>

      <div className="flex items-start">
        <div className="relative w-full">
          <Input
            id={name}
            name={name}
            type={type === 'url' ? 'url' : 'text'}
            label={label}
            value={value}
            onValueChange={(v) => onChange(v)}
            onKeyDown={handleOnKeyDown}
            variant="bordered"
            maxLength={280}
            endContent={
              info ? (
                <div className="-mr-2">
                  <InfoPopover content={info} />
                </div>
              ) : null
            }
            className="w-full"
          />
        </div>

        <Button
          isIconOnly
          color="primary"
          variant="solid"
          className="ml-2 mt-1"
          onPress={onAdd}
          aria-label="add item"
        >
          <Plus size={20} />
        </Button>
      </div>

      <StringList
        strings={options}
        preserveItem={preserveItem}
        onUpdate={(arr) => onChangeArr(arr)}
        editable={editableOrder}
      />
    </div>
  );
};

export default EditableList;
