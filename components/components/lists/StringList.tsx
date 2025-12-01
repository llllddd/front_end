'use client';

import React, { FC } from 'react';
import { Button } from '@heroui/button';
import { XCircle, ChevronUp, ChevronDown } from 'lucide-react';

interface StringListProps {
  strings: string[];
  preserveItem?: string;
  onUpdate: (arr: string[]) => void;
  editable?: boolean;
}

const StringList: FC<StringListProps> = ({
  strings,
  preserveItem,
  onUpdate,
  editable = false,
}) => {

  const handleRemove = (index: number) => {
    if (index > -1 && strings.length < 50) {
      const arr = [...strings];
      arr.splice(index, 1);
      onUpdate(arr);
    }
  };

  const handleMove = (currentIndex: number, newIndex: number) => {
    const arr = [...strings];
    const item = arr.splice(currentIndex, 1)[0];
    arr.splice(newIndex, 0, item);
    onUpdate(arr);
  };

  return (
    <div className="mt-4 space-y-2">
      {strings.map((string, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-gray-100 p-3 rounded shadow-sm"
        >
          {/* String */}
          <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[70%]">
            {string}
          </span>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {editable && (
              <>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => handleMove(index, index - 1)}
                  isDisabled={index === 0}
                  aria-label="move up"
                >
                  <ChevronUp size={18} />
                </Button>

                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => handleMove(index, index + 1)}
                  isDisabled={index === strings.length - 1}
                  aria-label="move down"
                >
                  <ChevronDown size={18} />
                </Button>
              </>
            )}

            <Button
              isIconOnly
              variant="light"
              color="danger"
              size="sm"
              onPress={() => handleRemove(index)}
              isDisabled={string === preserveItem}
              aria-label="remove item"
            >
              <XCircle size={18} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StringList;
