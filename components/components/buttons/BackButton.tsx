'use client';

import React, { FC } from 'react';
import { Button } from "@heroui/button";
import { ChevronLeft } from "lucide-react";
import strings from '../../strings';
interface BackButtonProps {
  onClick: () => void;
}

const BackButton: FC<BackButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="light"
      color="secondary"
      startContent={<ChevronLeft size={20} />}
      onPress={onClick}
      size="lg"
    >
      {strings.goBack}
    </Button>
  );
};

export default BackButton;
