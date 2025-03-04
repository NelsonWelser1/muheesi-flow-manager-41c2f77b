
// Common paths for auto-navigation
export const COMMON_PATHS = [
  '/',
  '/dashboard',
  '/manage-inventory',
  '/manage-companies',
  '/feedback',
  '/manage-inventory/kajon-export',
  '/manage-inventory/kajon-export/export-manager',
  '/manage-inventory/kashari-farm',
  '/manage-inventory/bukomero-dairy',
  '/manage-inventory/smart-production',
  '/manage-inventory/sales-marketing',
];

// Sandbox reset cooldown time (reduced from 1 hour to 3 minutes for better UX)
export const SANDBOX_RESET_COOLDOWN = 3 * 60 * 1000;

// Default timeout before showing fallback UI (increased to 30 seconds)
export const DEFAULT_TIMEOUT_MS = 30000;
