'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';

interface RouteGuardOptions {
  requireAuth?: boolean;
  requireVerified?: boolean;
  requireRole?: string[];
  redirectTo?: string;
}

/**
 * Higher-order function to protect routes based on authentication and role requirements
 */
export function withRouteGuard(Component: React.ComponentType<any>, options: RouteGuardOptions = {}) {
  const {
    requireAuth = true,
    requireVerified = false,
    requireRole = [],
    redirectTo,
  } = options;

  return function ProtectedRoute(props: any) {
    const { login, authCompleted } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!authCompleted) {
        // Wait for auth check to complete
        return;
      }

      // Check authentication requirement
      if (requireAuth && !login.authenticated) {
        router.push(redirectTo || '/auth/signin');
        return;
      }

      // Check verification requirement
      if (requireVerified && login.status !== 'VERIFIED') {
        router.push('/auth/verify');
        return;
      }

      // Check role requirement
      if (requireRole.length > 0 && login.role) {
        const hasRequiredRole = requireRole.includes(login.role);
        if (!hasRequiredRole) {
          router.push('/auth/privileged');
          return;
        }
      }
    }, [authCompleted, login, router]);

    // Show loading or nothing while checking auth
    if (!authCompleted) {
      return null; // or a loading spinner
    }

    // Don't render if requirements not met
    if (requireAuth && !login.authenticated) {
      return null;
    }

    if (requireVerified && login.status !== 'VERIFIED') {
      return null;
    }

    if (requireRole.length > 0 && login.role && !requireRole.includes(login.role)) {
      return null;
    }

    // All checks passed, render component
    return <Component {...props} />;
  };
}

/**
 * Check if a route is authenticated based on login state
 * This mimics the isAuthenticated function from the original SPA
 */
export function isRouteAuthenticated(
  path: string,
  login: {
    authenticated: boolean;
    status?: string;
    role?: string;
  }
): { allowed: boolean; redirectTo?: string } {
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/about',
    '/docs',
    '/auth/signin',
    '/auth/signup',
    '/auth/verify',
    '/auth/verified',
    '/auth/token-expired',
    '/auth/error',
    '/auth/success',
  ];

  // Check if it's a public route
  if (publicRoutes.some(route => path === route || path.startsWith(route))) {
    return { allowed: true };
  }

  // Routes that require authentication
  const protectedRoutes = [
    '/profile',
    '/dataset/new',
    '/dataset/list',
  ];

  const isProtectedRoute = protectedRoutes.some(route => 
    path === route || path.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!login.authenticated) {
      return { allowed: false, redirectTo: '/auth/signin' };
    }

    if (login.status !== 'VERIFIED') {
      return { allowed: false, redirectTo: '/auth/verify' };
    }
  }

  // Routes that require specific roles
  // Add role-based checks here if needed
  // Example:
  // if (path.startsWith('/admin') && login.role !== 'ADMIN') {
  //   return { allowed: false, redirectTo: '/auth/privileged' };
  // }

  return { allowed: true };
}
