# 🔧 Development Mode Guide

## Overview
Development mode allows you to bypass verification checks so you can test all features without going through the verification process.

## How It Works

### Automatic Detection
Development mode is **automatically enabled** when:
- Running `npm run dev` (Vite dev server)
- `import.meta.env.DEV` is `true`

### What Gets Bypassed
1. ✅ **Verification checks** - Unverified users can access all features
2. ✅ **Auto-verification** - Users are automatically marked as verified in dev mode
3. ✅ **Create requests/offers** - No verification required

### Console Messages
When dev mode is active, you'll see:
```
🔧 Development Mode: ENABLED
⚠️ Verification bypass is ACTIVE - All users can access all features
```

## Files Modified

### 1. `src/config/dev.js`
- New file that controls dev mode settings
- `DEV_MODE`: Automatically true in development
- `BYPASS_VERIFICATION`: Allows bypassing verification checks
- `AUTO_VERIFY_IN_DEV`: Auto-verifies users in dev mode

### 2. `src/pages/aid-seeker/CreateAidRequest.jsx`
- Updated to check `BYPASS_VERIFICATION` before blocking unverified users
- Removed verification check in render (if it existed)
- Updated `handleSubmit` to bypass verification in dev mode

### 3. `src/pages/aid-provider/CreateAidOffer.jsx`
- Updated to check `BYPASS_VERIFICATION` before blocking unverified users
- Updated `handleSubmit` to bypass verification in dev mode

### 4. `src/context/AuthContext.jsx`
- Auto-verifies users when fetching from `/auth/me` in dev mode
- Sets `verified: true` automatically

## Testing

### Test Unverified Access
1. Register a new account (will be unverified)
2. Try to create an aid request → Should work ✅
3. Try to create an aid offer → Should work ✅
4. Access all dashboards → Should work ✅

### Test Production Mode
To test production behavior:
1. Set `VITE_DEV_MODE=false` in `.env`
2. Or build the app: `npm run build`
3. Verification checks will be enforced

## Disabling Dev Mode

### Option 1: Environment Variable
Create `.env` file:
```env
VITE_DEV_MODE=false
```

### Option 2: Build for Production
```bash
npm run build
npm run preview
```

## Notes

- ⚠️ **Dev mode is ONLY active in development** (`npm run dev`)
- ⚠️ **Production builds** (`npm run build`) will enforce verification
- ✅ **Safe to commit** - Dev mode only works in development environment
- ✅ **No security risk** - Production builds ignore dev mode

## Troubleshooting

### Issue: Still seeing verification errors
**Solution**: 
1. Check browser console for dev mode message
2. Restart dev server: `npm run dev`
3. Clear browser cache
4. Check `src/config/dev.js` exists

### Issue: Want to test verification flow
**Solution**: 
1. Temporarily set `BYPASS_VERIFICATION = false` in `src/config/dev.js`
2. Or test in production build

---

**Status**: ✅ Active - You can now access all sections without verification!

