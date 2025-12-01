"use client";

import * as React from "react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

const AUTH_ENDPOINT = "/auth/orcid";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export function LoginButton({ children = "Sign in with ORCID", className = "", onClick }: { children?: React.ReactNode; className?: string; onClick?: () => void }) {
  // If onClick is provided, prefer client-side redirect via callback.
  if (onClick) {
    return (
      <Button onClick={onClick} className={className} color="primary" variant="solid">
        {children}
      </Button>
    );
  }

  // Default: render link-style button that navigates to backend ORCID endpoint.
  return (
    <Button
      as={Link}
      className={className}
      color="primary"
      href={`${API_BASE}${AUTH_ENDPOINT}`}
      isExternal
      variant="solid"
    >
      {children}
    </Button>
  );
}

export default LoginButton;
