'use client';

import React, { FC, useContext } from 'react';
import Link from 'next/link';
import { Button } from "@heroui/button";
import { Download, MessageSquare } from 'lucide-react';

import strings from '../../strings';
import LoginContext from '@/context/LoginContext';

interface Dataset {
  id: number;
  contractStatus: string;
  policy: {
    terms?: boolean;
  };
}

interface Contract {
  datasetId: number;
  status: string;
}

interface DownloadButtonProps {
  dataset: Dataset;
  contract?: Contract | null;
  onNav: () => void;
  onDownload: () => void;
}

const DownloadButton: FC<DownloadButtonProps> = ({
  dataset,
  contract,
  onNav,
  onDownload,
}) => {
  const { login } = useContext(LoginContext);

  /**
   * Renders contract-related messages.
   */
  const renderContractInfo = () => {
    if (dataset.contractStatus === 'ACCEPTED') {
      return <p>{strings.ownerContract}</p>;
    }
    if (contract && contract.datasetId === dataset.id && contract.status === 'ACCEPTED') {
      return <p>{strings.contractExists}</p>;
    }
    if (contract && contract.datasetId === dataset.id && contract.status === 'PENDING') {
      return (
        <p>
          {strings.notifyEmail}
          <Link
            href="/contracts"
            className="text-blue-500 underline"
            onClick={onNav}
          >
            {strings.contractsPage}
          </Link>
          .
        </p>
      );
    }
    return null;
  };

  /**
   * Determine whether this button requests a contract or downloads the dataset.
   */
  let request = true;
  if (dataset.contractStatus === 'ACCEPTED' || !dataset.policy.terms) {
    request = false;
  }
  if (contract && contract.datasetId === dataset.id && contract.status === 'ACCEPTED') {
    request = false;
  }

  /**
   * Determine if the button should be disabled.
   */
  let disableButton = false;
  if (contract && contract.datasetId === dataset.id && contract.status === 'PENDING') {
    disableButton = true;
  }
  if (!login.authenticated || login.status !== 'VERIFIED') {
    disableButton = true;
  }

  return (
    <div className="pt-8 pb-4">
      {renderContractInfo()}

      {/* Not logged in */}
      {!login.authenticated && (
        <p>
          {strings.youMust}
          <Link href="/auth/signin" className="text-blue-500 underline">
            {strings.signIn}
          </Link>
          {strings.signInFirst}
        </p>
      )}

      {/* Not verified */}
      {login.authenticated && login.status !== 'VERIFIED' && (
        <p>{strings.verifyFirst}</p>
      )}

      <div className="mt-4">
        <Button
          color="primary"
          variant="solid"
          size="lg"
          isDisabled={disableButton}
          onPress={onDownload}
          endContent={
            request ? <MessageSquare size={20} /> : <Download size={20} />
          }
        >
          {request ? strings.headerProposal : strings.buttonDownload}
        </Button>
      </div>
    </div>
  );
};

export default DownloadButton;
