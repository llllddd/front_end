'use client';

import React, { FC } from 'react';
import InfoPopover from './InfoPopover';

interface InfoIconProps {
  info: string;
}

const InfoIcon: FC<InfoIconProps> = ({ info }) => (
  <span className="absolute -left-11 sm:-left-16 top-3">
    <InfoPopover content={info} />
  </span>
);

export default InfoIcon;
