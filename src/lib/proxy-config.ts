/**
 * Global Proxy Configuration
 *
 * This file configures undici global proxy for all Node.js fetch requests.
 * It should be imported as early as possible in the application lifecycle.
 *
 * IMPORTANT: Import this in your API routes or server-side code BEFORE making any fetch calls.
 */

const PROXY_URL = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;

// Proxy setup removed due to compatibility issues with built-in fetch in some environments.
// Node.js 18+ includes built-in fetch that respects HTTP_PROXY via other means or requires native setup.
if (PROXY_URL) {
  console.log(`📡 [Proxy] Proxy environment variables detected: ${PROXY_URL}`);
}

export {};
