// Central config for the site the app wraps. Flip `USE_LOCAL` to test against a
// locally-running web build instead of production.
//
//   - Simulator: reaches the Mac via `localhost`.
//   - Physical device: use the Mac's LAN IP (both must be on the same Wi-Fi),
//     and note iOS needs an ATS exception to load plain http:// (see app.json).
const USE_LOCAL = false;

const PROD_BASE_URL = 'https://standard.co.me';
const LOCAL_BASE_URL = 'http://localhost:3000'; // change to http://192.168.1.172:3000 for a physical device

export const SITE_BASE_URL = USE_LOCAL ? LOCAL_BASE_URL : PROD_BASE_URL;

// Host (with port, if any) used to recognize same-site URLs, e.g. `localhost:3000`.
export const SITE_HOST = SITE_BASE_URL.replace(/^https?:\/\//, '');

// Convenience builder so screens don't hardcode the base URL.
export const siteUrl = (path = '/') =>
  `${SITE_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
