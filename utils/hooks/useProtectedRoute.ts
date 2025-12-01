"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/auth/auth-context";

/**
 * Protect client pages by redirecting when unauthenticated, unverified, or role-mismatched.
 * Mirrors the CRA isAuthenticated() logic:
 * - Not authenticated -> /auth/signin
 * - Authenticated but NOT_VERIFIED -> /auth/verify
 * - Authenticated but role mismatch -> /privileged
 */
export function useProtectedRoute(requiredRole?: string) {
  const { login, authCompleted } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authCompleted) return;

    if (!login.authenticated) {
      router.replace("/auth/signin");
      return;
    }

    if (login.status === "NOT_VERIFIED") {
      router.replace("/auth/verify");
      return;
    }

    if (requiredRole && login.role !== requiredRole) {
      router.replace("/privileged");
    }
  }, [authCompleted, login, requiredRole, router]);

  const allowed = useMemo(() => {
    if (!authCompleted) return false;
    if (!login.authenticated) return false;
    if (login.status !== "VERIFIED") return false;
    if (requiredRole && login.role !== requiredRole) return false;
    return true;
  }, [authCompleted, login, requiredRole]);

  return { allowed, login, authCompleted };
}
