"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "@/auth/auth-context";
import { ShellProvider } from "@/context/ShellContext";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

// The AuthProvider is used to provide authentication context to the app
export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  return (
    <NextThemesProvider {...themeProps}>
      <HeroUIProvider>
        <AuthProvider>
          <ShellProvider>{children}</ShellProvider>
        </AuthProvider>
      </HeroUIProvider>
    </NextThemesProvider>
  );
}
