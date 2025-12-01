/**
 * Analytics utilities for tracking page views and events
 */

let analyticsInitialized = false;

/**
 * Initialize analytics (placeholder - replace with your actual analytics service)
 * This would typically initialize Google Analytics, Mixpanel, etc.
 */
export function initializeAnalytics() {
  if (analyticsInitialized) return;
  
  // TODO: Initialize your analytics service here
  // Example for Google Analytics:
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('config', 'GA_MEASUREMENT_ID');
  // }
  
  analyticsInitialized = true;
  console.log('[Analytics] Initialized');
}

/**
 * Track a page view
 * @param path - The page path to track
 */
export function trackPageView(path: string) {
  if (!analyticsInitialized) {
    console.log('[Analytics] Not initialized, skipping page view:', path);
    return;
  }
  
  // TODO: Replace with your actual analytics tracking
  // Example for Google Analytics:
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', 'page_view', {
  //     page_path: path,
  //   });
  // }
  
  console.log('[Analytics] Page view:', path);
}

/**
 * Track a custom event
 * @param eventName - The event name
 * @param eventParams - Optional event parameters
 */
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (!analyticsInitialized) {
    console.log('[Analytics] Not initialized, skipping event:', eventName);
    return;
  }
  
  // TODO: Replace with your actual analytics tracking
  // Example for Google Analytics:
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', eventName, eventParams);
  // }
  
  console.log('[Analytics] Event:', eventName, eventParams);
}

/**
 * Debounce function to limit how often a function can be called
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
