'use client';

import React, { FC } from 'react';
import { Button } from '@heroui/button';
import { Info } from 'lucide-react';
import {Popover, PopoverTrigger, PopoverContent} from "@heroui/popover";

interface InfoPopoverProps {
  content?: string;
}

const InfoPopover: FC<InfoPopoverProps> = ({ content }) => {
  return (
    <Popover placement="right-start" showArrow offset={10}>
      <PopoverTrigger>
        <Button
          isIconOnly
          variant="light"
          color="primary"
          size="sm"
          aria-label="info"
          title="Click for more info"
        >
          <Info size={18} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-4 max-w-sm text-left leading-normal font-sans">
        {content ? (
          <div
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default InfoPopover;
