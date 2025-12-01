'use client';

import React, { FC } from 'react';
import { Button } from '@heroui/button';
import { ChevronRight } from 'lucide-react'; 
import strings from '../../strings';

/**
 * Render next button
 */
const NextButton: FC = () => (
  <div className="absolute right-10">
    <Button
      color="primary"
      variant="solid"
      size="lg"
      type="submit"
      startContent={<ChevronRight size={20} />}
    >
      {strings.next}
    </Button>
  </div>
);

export default NextButton;
