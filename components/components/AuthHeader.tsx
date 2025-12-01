'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import strings from '../strings';

interface AuthHeaderProps {
  login: {
    email?: string;
  };
  onSignOut: () => void;
}

const AuthHeader: FC<AuthHeaderProps> = ({ login, onSignOut }) => (
  <span className="hidden sm:inline absolute mt-2 right-1 text-xs z-10 -top-1 font-light">
    {login.email}{' '}
    <Link href="/" className="text-darkGrey font-bold" title={strings.signOut}>
      {/* Wrapping to allow click handler */}
      <span onClick={onSignOut}>{strings.signOutsmall}</span>
    </Link>
  </span>
);

export default AuthHeader;
