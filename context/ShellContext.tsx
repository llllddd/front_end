'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCookieConsentValue } from 'react-cookie-consent';

interface ShellContextType {
  secondaryNav: number;
  setSecondaryNav: (value: number | ((prev: number) => number)) => void;
  cookieConsent: string | undefined;
  setCookieConsent: (value: string | undefined) => void;
  showMap: boolean;
  setShowMap: (value: boolean) => void;
  mapWidth: number;
  setMapWidth: (value: number) => void;
  authCompleted: boolean;
  setAuthCompleted: (value: boolean) => void;
  feedbackTrigger: number;
  setFeedbackTrigger: (value: number | ((prev: number) => number)) => void;
}

const ShellContext = createContext<ShellContextType | undefined>(undefined);

export function ShellProvider({ children }: { children: ReactNode }) {
  const [secondaryNav, setSecondaryNav] = useState(0);
  const [cookieConsent, setCookieConsent] = useState<string | undefined>(getCookieConsentValue());
  const [showMap, setShowMap] = useState(true);
  const [mapWidth, setMapWidth] = useState(0);
  const [authCompleted, setAuthCompleted] = useState(false);
  const [feedbackTrigger, setFeedbackTrigger] = useState(0);

  /**
   * Resize map on window size change and orientation change
   */
  const resizeMap = () => {
    setShowMap(false);
    setTimeout(() => setMapWidth(window.innerWidth), 500);
  };

  /**
   * Add event listener for resize (for Map)
   */
  useEffect(() => {
    const handleResize = () => resizeMap();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /**
   * Render map after new width has been calculated
   */
  useEffect(() => {
    setShowMap(true);
  }, [mapWidth]);

  /**
   * Check for cookie consent changes
   */
  useEffect(() => {
    const currentConsent = getCookieConsentValue();
    if (currentConsent !== cookieConsent) {
      setCookieConsent(currentConsent);
    }
  }, [cookieConsent]);

  const value: ShellContextType = {
    secondaryNav,
    setSecondaryNav,
    cookieConsent,
    setCookieConsent,
    showMap,
    setShowMap,
    mapWidth,
    setMapWidth,
    authCompleted,
    setAuthCompleted,
    feedbackTrigger,
    setFeedbackTrigger,
  };

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell() {
  const context = useContext(ShellContext);
  if (context === undefined) {
    throw new Error('useShell must be used within a ShellProvider');
  }
  return context;
}

export default ShellContext;
