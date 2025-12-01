"use client";

import { ReactNode, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/auth/auth-context";
import { useShell } from "@/context/ShellContext";
import AuthHeader from "@/components/components/AuthHeader";
import CookieNotice from "@/components/components/CookieNotice";
import { initializeAnalytics } from "@/utils/analytics";
import { usePageTracking } from "@/utils/hooks/usePageTracking";

export function LayoutContent({ children }: { children: ReactNode }) {
  const { login, authCompleted, signOut } = useAuth();
  const { 
    secondaryNav, 
    setSecondaryNav, 
    cookieConsent, 
    setCookieConsent,
    setAuthCompleted: setShellAuthCompleted 
  } = useShell();

  // Track page views on route changes
  usePageTracking();

  // Sync auth completion state
  useEffect(() => {
    setShellAuthCompleted(authCompleted);
  }, [authCompleted, setShellAuthCompleted]);

  // Handle cookie consent
  const handleCookieConsent = () => {
    setCookieConsent('true');
    // Initialize analytics when user consents
    initializeAnalytics();
  };

  // Initialize analytics if consent was already given
  useEffect(() => {
    if (cookieConsent === 'true') {
      initializeAnalytics();
    }
  }, [cookieConsent]);

  if (!authCompleted) {
    // Wait for validateSession to complete
    return null;
  }

  return (
    <div className="relative flex flex-col h-screen">
      <Navbar
        login={login}
        authCompleted={authCompleted}
        signOut={signOut}
      />

      {login.authenticated && (
        <AuthHeader 
          login={login} 
          onSignOut={() => {
            signOut();
            setSecondaryNav((n: number) => n + 1);
          }} 
        />
      )}

      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        {children}
      </main>

      <CookieNotice onConsent={handleCookieConsent} />
    </div>
  );
}
