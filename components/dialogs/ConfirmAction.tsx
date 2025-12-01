'use client';

import React, { FC } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal';
import { Button } from '@heroui/button';
import strings from '../strings';

interface ConfirmActionProps {
  openContent?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmAction: FC<ConfirmActionProps> = ({
  openContent,
  onClose,
  onConfirm,
}) => {
  const isOpen = Boolean(openContent);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="opaque"
      size="sm"
      className="font-sans text-center"
    >
      <ModalHeader>{strings.pleaseConfirm}</ModalHeader>

      <ModalBody>
        <p className="pb-4">{openContent}</p>
      </ModalBody>

      <ModalFooter className="flex justify-center space-x-4 pb-6">
        <Button
          color="primary"
          onPress={() => {
            onClose();
            onConfirm();
          }}
        >
          {strings.buttonConfirm}
        </Button>

        <Button
          variant="flat"
          onPress={onClose}
        >
          {strings.buttonCancel}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmAction;
