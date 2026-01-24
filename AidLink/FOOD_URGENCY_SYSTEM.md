# 🍎 Food-Specific Urgency System

## Overview
The food urgency system automatically calculates and updates urgency levels for perishable food items based on their expiration dates. This ensures urgent food items are prioritized and matched quickly.

## Features

### 1. **Automatic Urgency Calculation**
- **URGENT**: Expires within 6 hours - "MUST BE GIVEN TODAY"
- **HIGH**: Expires within 24 hours - Needs immediate attention
- **MEDIUM**: Expires within 3 days - Normal priority
- **LOW**: More than 3 days until expiry

### 2. **Auto-Update on Creation**
When creating a request with perishable food:
- System automatically calculates urgency based on expiration date
- Overrides manual urgency selection for perishable items
- Uses aid type default urgency for non-perishable items

### 3. **Scheduled Updates**
Cron job runs hourly to:
- Update urgency levels for expiring items
- Mark expired items as EXPIRED
- Prioritize urgent food in matching algorithm

### 4. **Visual Indicators**
- **UrgencyBadge Component**: Shows urgency with color-coded badges
- **Time Remaining**: Displays countdown until expiration
- **Expiring Today**: Special highlight for items expiring within 24 hours

## Implementation

### Backend Files

#### `backend/utils/food-urgency.js`
Core utility functions:
- `calculateFoodUrgency()` - Calculate urgency from expiration date
- `isExpiringToday()` - Check if item expires today
- `isExpired()` - Check if item has expired
- `getUrgencyBadge()` - Get badge configuration
- `getTimeRemaining()` - Human-readable time remaining
- `updateFoodUrgency()` - Batch update all perishable items
- `autoSetFoodUrgency()` - Auto-set urgency on creation

#### `backend/routes/cron.routes.js`
Scheduled task endpoints:
- `GET /api/cron/update-food-urgency` - Update urgency levels
- `GET /api/cron/expire-items` - Mark expired items
- `GET /api/cron/run-all` - Run all cron jobs

**Security**: Protected with API key (`CRON_API_KEY` env variable)

#### `backend/controllers/request.controller.js`
Updated to:
- Auto-calculate urgency for perishable food on creation
- Use aid type default urgency for non-perishable items

### Frontend Files

#### `src/utils/food-urgency.js`
Client-side urgency utilities (mirrors backend logic)

#### `src/components/UrgencyBadge.jsx`
React component for displaying urgency:
```jsx
<UrgencyBadge 
  urgency="URGENT" 
  expiresAt={expiresAt}
  showTimeRemaining={true}
  size="md"
/>
```

#### `src/pages/aid-seeker/CreateAidRequest.jsx`
Updated to:
- Auto-update urgency when expiration date changes
- Show urgency preview in form

## Usage

### Creating a Request with Perishable Food

1. Select aid type: "Urgent Food (Perishable)"
2. Set expiration date (required for perishable)
3. System automatically sets urgency based on expiration:
   - If expires in 6 hours → URGENT
   - If expires in 24 hours → HIGH
   - If expires in 3 days → MEDIUM
   - Otherwise → LOW

### Displaying Urgency

```jsx
import UrgencyBadge from '../components/UrgencyBadge';

<UrgencyBadge 
  urgency={request.urgency}
  expiresAt={request.expiresAt}
  showTimeRemaining={true}
/>
```

### Matching Algorithm Priority

The matching algorithm (`backend/utils/aid-matching.js`) prioritizes:
1. Urgent requests (expiring soon)
2. Perishable items
3. Items expiring today

## Cron Job Setup

### Manual Trigger (Development)
```bash
curl -H "X-API-Key: dev-cron-key" http://localhost:3000/api/cron/update-food-urgency
```

### Production Setup

#### Option 1: External Cron Service
Use a service like:
- **cron-job.org**
- **EasyCron**
- **Cronitor**

Schedule: Every hour
```
GET https://your-api.com/api/cron/update-food-urgency
Headers: X-API-Key: your-secret-key
```

#### Option 2: Node-Cron (Internal)
Add to `backend/server.js`:
```javascript
import cron from 'node-cron';

// Run every hour
cron.schedule('0 * * * *', async () => {
  await updateFoodUrgency();
  await expireOldItems();
});
```

## Environment Variables

Add to `.env`:
```env
CRON_API_KEY=your-secret-cron-key-here
```

## Testing

### Test Urgency Calculation
```javascript
import { calculateFoodUrgency } from './utils/food-urgency';

const expiresIn6Hours = new Date(Date.now() + 6 * 60 * 60 * 1000);
console.log(calculateFoodUrgency(expiresIn6Hours)); // "URGENT"

const expiresIn2Days = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
console.log(calculateFoodUrgency(expiresIn2Days)); // "MEDIUM"
```

### Test Badge Display
```jsx
<UrgencyBadge urgency="URGENT" expiresAt={expiresAt} />
// Shows: 🚨 URGENT – MUST BE GIVEN TODAY
```

## Benefits

1. ✅ **Prevents Food Waste**: Urgent items are matched quickly
2. ✅ **Automatic Prioritization**: No manual urgency setting needed
3. ✅ **Real-time Updates**: Urgency updates as time passes
4. ✅ **Clear Visual Indicators**: Users see urgency at a glance
5. ✅ **Better Matching**: Algorithm prioritizes urgent food

## Future Enhancements

- [ ] Push notifications for urgent food
- [ ] Email alerts for expiring items
- [ ] Dashboard widget for urgent food count
- [ ] Analytics on food waste prevention
- [ ] Integration with food banks/organizations

---

**Status**: ✅ Implemented - Food urgency system is fully functional!

