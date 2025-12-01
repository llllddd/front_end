'use client';

import React, { FC } from 'react';
import strings from '../strings';

interface License {
  name: string;
  description: string;
  url: string;
}

interface LicenseLinkProps {
  license?: License | null;
}

const LicenseLink: FC<LicenseLinkProps> = ({ license }) => {
  if (!license) return null;

  const { name, description, url } = license;

  return (
    <>
      <span className="font-light">
        {strings.labelLicense}:
      </span>

      <p className="break-words">{name}</p>

      <p className="break-words">{description}</p>

      <a
        className="text-blue-400 block overflow-hidden text-ellipsis"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title={url}
      >
        {url}
      </a>
    </>
  );
};

export default LicenseLink;
