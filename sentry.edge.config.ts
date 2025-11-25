// Sentry initialization configuration for Next.js Edge features (Middleware, Edge API Routes).
// This configuration runs in Vercel's Edge Runtime environment.

import * as Sentry from '@sentry/nextjs';
import { beforeSend, beforeSendSpan } from './sentryUtils';

Sentry.init({
  // WARNING: Ensure this DSN is NOT exposed publicly if it's not meant for the client side.
  // Use a non-public environment variable if configuration is strictly for Edge/Server.
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Determines the percentage of transactions to send to Sentry for performance monitoring.
  // Set to 1.0 (100%) for development/testing, but should be reduced significantly (e.g., 0.1 or 0.01)
  // in high-traffic production environments to manage costs and data volume.
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this to true prints useful information to the console during setup.
  // Should be false in production.
  debug: false,
  
  // Custom hooks to modify event data before it is sent to Sentry.
  beforeSend,
  
  // Custom hooks to modify performance span data before it is sent to Sentry.
  beforeSendSpan,
});
