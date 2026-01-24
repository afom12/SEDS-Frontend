// Development Configuration
// Set to true to bypass verification checks during development
export const DEV_MODE = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true';

// Allow unverified users to access all features in dev mode
export const BYPASS_VERIFICATION = DEV_MODE;

// Auto-verify users in dev mode (optional)
export const AUTO_VERIFY_IN_DEV = DEV_MODE;

console.log('🔧 Development Mode:', DEV_MODE ? 'ENABLED' : 'DISABLED');
if (DEV_MODE) {
  console.log('⚠️ Verification bypass is ACTIVE - All users can access all features');
}

