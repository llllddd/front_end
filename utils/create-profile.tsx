"use client";

import Cookies from "universal-cookie";

export interface UserProfile {
  authenticated: boolean;
  orcid?: string;
  name?: string;
  email?: string;
  organization?: string;
  role?: string;
  status?: string;
}

const COOKIE_NAME =
  process.env.NEXT_PUBLIC_AUTH_COOKIE ||
  process.env.REACT_APP_AUTH_COOKIE ||
  "auth_token";

/**
 * Normalize profile structure
 */
export const setProfile = (profile: any): UserProfile => {
  const authenticated = Boolean(profile?.email);

  return {
    authenticated,
    orcid: profile?.orcid,
    name: profile?.name,
    email: profile?.email,
    organization: profile?.organization,
    role: profile?.role,
    status: profile?.status,
  };
};

/**
 * Load profile from cookie
 */
export const createProfile = (authenticated: boolean): UserProfile => {
  const cookies = new Cookies();

  if (authenticated) {
    const stored = cookies.get(COOKIE_NAME);
    return setProfile(stored);
  }

  return setProfile(undefined);
};

export default createProfile;
