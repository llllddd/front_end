'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, debounce } from '@/utils/analytics';

// Debounced page tracking to avoid excessive calls
const debouncedTrackPageView = debounce((path: string) => {
  trackPageView(path);
}, 300);

/**
 * Hook to track page views on route changes
 * Add this to your layout or individual pages that need tracking
 */
export function usePageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      debouncedTrackPageView(pathname);
    }
  }, [pathname]);
}
