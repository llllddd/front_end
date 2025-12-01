'use client';

import { useProtectedRoute } from '@/utils/hooks/useProtectedRoute';
import ProfilePage from './profile';

export default function ProtectedProfilePage() {
  const { allowed, authCompleted } = useProtectedRoute();

  // Show nothing while checking auth
  if (!authCompleted) {
    return null;
  }

  // Don't render if not authenticated / not verified / role mismatch
  if (!allowed) {
    return null;
  }

  // All checks passed, render the profile page
  return <ProfilePage />;
}
