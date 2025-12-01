'use client';

import React, { FC, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { X, Save } from 'lucide-react';

import strings from '../strings';
import { addEmailToProfile } from '@/utils/api/auth';
import ConfirmAction from './ConfirmAction';

interface ChangeEmailProps {
  open: boolean;
  onClose: () => void;
}

const ChangeEmail: FC<ChangeEmailProps> = ({ open, onClose }) => {
  const [email, setEmail] = useState<string>('');
  const [openConfirm, setOpenConfirm] = useState<string | undefined>();
  const [error, setError] = useState<boolean>(false);

  /** Final confirm → call API */
  const changeEmail = async () => {
    try {
      await addEmailToProfile(email);
      setError(false);
      onClose();
    } catch {
      setError(true);
    }
  };

  /** Show confirm dialog */
  const handleChange = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenConfirm(strings.textConfirm);
  };

  return (
    <Modal isOpen={open} onClose={onClose} size="lg" backdrop="opaque">
      <form onSubmit={handleChange} autoComplete="off" className="font-sans">
        {/* HEADER */}
        <ModalHeader className="flex justify-between items-center">
          {strings.headerChangeEmail}
          <Button
            isIconOnly
            variant="light"
            aria-label="close"
            onPress={onClose}
          >
            <X size={20} />
          </Button>
        </ModalHeader>

        {/* CONTENT */}
        <ModalBody>
          <p className="p-2 mb-4">{strings.infoChangeEmail}</p>

          <Input
            type="email"
            isRequired
            label={strings.labelEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={60}
            fullWidth
          />

          {error && (
            <p className="text-red-600 mt-4">{strings.errorTryAgain}</p>
          )}
        </ModalBody>

        {/* ACTIONS */}
        <ModalFooter>
          <Button
            type="submit"
            color="primary"
            endContent={<Save size={18} />}
          >
            {strings.buttonSave}
          </Button>
        </ModalFooter>
      </form>

      {/* CONFIRMATION MODAL */}
      <ConfirmAction
        openContent={openConfirm}
        onClose={() => setOpenConfirm(undefined)}
        onConfirm={changeEmail}
      />
    </Modal>
  );
};

export default ChangeEmail;
