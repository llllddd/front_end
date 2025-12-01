// auth/auth-context.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { validateSession, invalidateSession } from "../utils/api/auth";
import createProfile from "../utils/create-profile";

export interface LoginState {
  authenticated: boolean;
  orcid?: string;
  name?: string;
  email?: string;
  organization?: string;
  role?: string;
  status?: "VERIFIED" | "NOT_VERIFIED" | string;
}

interface AuthContextValue {
  login: LoginState;
  setLogin: (s: LoginState) => void;
  authCompleted: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const initialLoginState: LoginState = {
  authenticated: false,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [login, setLogin] = useState<LoginState>(initialLoginState);
  const [authCompleted, setAuthCompleted] = useState(false);

  useEffect(() => {
    if (!authCompleted) {
      const authenticate = async () => {
        try {
          await validateSession();
          setLogin(createProfile(true));
        } catch {
          setLogin(createProfile(false));
        }
        setAuthCompleted(true);
      };
      authenticate();
    }
  }, [authCompleted]);

  const signOut = async () => {
    try {
      await invalidateSession();
    } catch {
      // ignore
    }
    setLogin(createProfile(false));
  };

  return (
    <AuthContext.Provider value={{ login, setLogin, authCompleted, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
