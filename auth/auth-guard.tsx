// auth/auth-guard.tsx
"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";
import { useEffect, useState } from "react";

export function RequireAuth({ children, role }: { children: ReactNode; role?: string }) {
  const { login, authCompleted } = useAuth();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!authCompleted) return;

    if (!login.authenticated) {
      router.replace("/auth/signin");
      return;
    }

    if (login.status === "NOT_VERIFIED") {
      router.replace("/verify");
      return;
    }

    if (role && login.role !== role) {
      router.replace("/privileged");
      return;
    }

    setAllowed(true);
  }, [authCompleted, login, role, router]);

  if (!authCompleted || !allowed) return null; // or spinner

  return <>{children}</>;
}
