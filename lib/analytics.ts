/**
 * Firebase Analytics helper.
 * Wraps logEvent calls with typed, named event helpers.
 * Only runs client-side (SSR-safe).
 */

import { getAnalytics, logEvent, type Analytics } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';
import { app } from './firebase';

let analyticsInstance: Analytics | null = null;
let performanceInitialized = false;

function getAnalyticsInstance(): Analytics | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!analyticsInstance) {
      analyticsInstance = getAnalytics(app);
    }
    return analyticsInstance;
  } catch {
    return null;
  }
}

/** Initialize Firebase Performance Monitoring (call once on app start). */
export function initPerformance(): void {
  if (typeof window === 'undefined' || performanceInitialized) return;
  try {
    getPerformance(app);
    performanceInitialized = true;
  } catch {
    // Performance not available in all environments
  }
}

/** Log a page view event. */
export function trackPageView(pageName: string): void {
  const analytics = getAnalyticsInstance();
  if (!analytics) return;
  logEvent(analytics, 'page_view', { page_title: pageName });
}

/** Log when a user sends a chat message. */
export function trackChatQuery(questionLength: number): void {
  const analytics = getAnalyticsInstance();
  if (!analytics) return;
  logEvent(analytics, 'chat_query_sent', { question_length: questionLength });
}

/** Log when a user views a guide. */
export function trackGuideView(guideId: string, guideTitle: string): void {
  const analytics = getAnalyticsInstance();
  if (!analytics) return;
  logEvent(analytics, 'guide_viewed', { guide_id: guideId, guide_title: guideTitle });
}

/** Log auth events. */
export function trackAuthEvent(action: 'login' | 'logout', method = 'google'): void {
  const analytics = getAnalyticsInstance();
  if (!analytics) return;
  // Use custom event names to avoid conflict with Firebase's reserved 'login' overload
  const eventName = action === 'login' ? 'user_sign_in' : 'user_sign_out';
  logEvent(analytics, eventName, { method });
}
