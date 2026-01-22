# Aid Coordination System - Architecture Document

## 🎯 System Overview

This document describes the transformation of SEDS from a money donation platform to a **comprehensive needs-based aid coordination system** for poor and needy people.

## 🏗️ Core Architecture

### User Roles

1. **AID_SEEKER** (Needy/Poor)
   - People who need various types of aid
   - Can request specific aid types (food, clothing, medical, etc.)
   - Do NOT directly ask for money
   - Select WHAT they need, not just how much

2. **AID_PROVIDER** (Donors/Helpers)
   - People/organizations offering aid
   - Can offer money, goods, or services
   - Can respond to specific requests
   - Can offer immediate or scheduled support

3. **ADMIN**
   - Platform administrators
   - Verify requests and organizations
   - Coordinate matching
   - Monitor urgent needs

4. **ORGANIZATION** (Trusted Entities)
   - Churches, NGOs, community groups, Idir
   - Can verify requests
   - Can manage distributions
   - Have verified badges

### Aid Types System

#### Predefined Aid Types

1. **FOOD_URGENT** - Perishable food, urgent need
   - Requires expiration date
   - High priority
   - Must be delivered quickly

2. **FOOD_CEREMONY** - Food for ceremonies/events
   - Can be scheduled
   - Future date allowed
   - Specific quantity needed

3. **CLOTHING** - Clothing items
   - Size, type, condition
   - Quantity needed

4. **MEDICAL** - Medical assistance
   - Medical supplies
   - Medical services
   - Medicine

5. **CASH** - Cash support
   - When physical aid not possible
   - Must be tied to specific need

6. **EDUCATION** - School supplies, books
   - Specific items needed
   - Grade/age appropriate

7. **SHELTER** - Housing/shelter support
   - Temporary shelter
   - Rent assistance
   - Housing materials

8. **SERVICES** - Service-based aid
   - Transportation
   - Labor
   - Professional services

9. **OTHER** - Custom aid type
   - Custom description required

## 📊 Database Schema

### Core Models

1. **AidType** - Defines aid categories
2. **AidRequest** - Extended Request model with aid-specific fields
3. **AidOffer** - What providers are offering
4. **Delivery** - Tracks actual aid handover
5. **Organization** - Trusted organizations
6. **OrganizationMember** - Users belonging to organizations

### Key Fields

#### AidRequest (Extended Request)
- `aidTypeId` - Type of aid needed
- `quantity` - How much needed
- `unit` - Unit of measurement
- `urgency` - Urgency level (LOW, MEDIUM, HIGH, URGENT)
- `neededBy` - When aid is needed
- `expiresAt` - Expiration (for perishable food)
- `isPerishable` - Is this perishable?
- `location` - Where aid is needed
- `deliveryMethod` - How aid will be delivered
- `verifiedByOrganizationId` - Organization that verified

#### AidOffer
- `aidTypeId` - Type of aid being offered
- `quantity` - How much available
- `amount` - Cash amount (if applicable)
- `availableFrom/Until` - Availability window
- `expiresAt` - Expiration (for perishable)
- `canDeliver` - Can provider deliver?
- `location` - Where aid is located
- `status` - AVAILABLE, MATCHED, DELIVERED, etc.

#### Delivery
- `requestId` - Related request
- `offerId` - Related offer
- `quantity` - Actual quantity delivered
- `deliveryMethod` - How it was delivered
- `scheduledAt` - When scheduled
- `deliveredAt` - When delivered
- `confirmedAt` - When seeker confirmed
- `proofPhotos` - Photos of delivery

## 🔄 Request Lifecycle

```
DRAFT → SUBMITTED → VERIFIED → MATCHED → IN_PROGRESS → COMPLETED
                                    ↓
                                 EXPIRED (if perishable and not delivered in time)
```

### Status Definitions

- **DRAFT**: Seeker is creating request
- **SUBMITTED**: Request submitted for verification
- **VERIFIED**: Admin or organization verified the need
- **MATCHED**: Aid offer matched to request
- **IN_PROGRESS**: Delivery scheduled/in progress
- **COMPLETED**: Aid delivered and confirmed
- **EXPIRED**: Request expired (especially perishable food)
- **REJECTED**: Request rejected during verification
- **CANCELLED**: Request cancelled by seeker

## 🎁 Offer Lifecycle

```
AVAILABLE → MATCHED → ACCEPTED → IN_TRANSIT → DELIVERED → CONFIRMED
     ↓
  EXPIRED (if perishable and not matched in time)
```

### Status Definitions

- **AVAILABLE**: Offer available for matching
- **MATCHED**: Matched to a request
- **ACCEPTED**: Seeker accepted the offer
- **IN_TRANSIT**: Being delivered
- **DELIVERED**: Delivered to seeker
- **CONFIRMED**: Seeker confirmed receipt
- **CANCELLED**: Offer cancelled
- **EXPIRED**: Offer expired (perishable items)

## 🔗 Matching Logic

### Automatic Matching

1. **Urgency-Based**: Urgent requests prioritized
2. **Location-Based**: Nearby offers matched first
3. **Type-Based**: Exact aid type match required
4. **Quantity-Based**: Offer quantity must meet or exceed request
5. **Timing-Based**: Perishable items matched immediately

### Manual Matching (Admin/Organization)

- Admin can manually match offers to requests
- Organizations can match within their network
- Override automatic matching when needed

## 📡 API Endpoints

### Aid Types
- `GET /api/aid-types` - Get all aid types
- `GET /api/aid-types/:id` - Get aid type details

### Aid Requests
- `POST /api/aid-requests` - Create aid request (AID_SEEKER)
- `GET /api/aid-requests` - List requests (with filters)
- `GET /api/aid-requests/urgent` - Get urgent requests
- `GET /api/aid-requests/perishable` - Get perishable food requests
- `GET /api/aid-requests/:id` - Get request details
- `PUT /api/aid-requests/:id` - Update request
- `POST /api/aid-requests/:id/submit` - Submit for verification
- `POST /api/aid-requests/:id/match/:offerId` - Match offer to request

### Aid Offers
- `POST /api/aid-offers` - Create offer (AID_PROVIDER)
- `GET /api/aid-offers` - List offers
- `GET /api/aid-offers/available` - Get available offers
- `GET /api/aid-offers/:id` - Get offer details
- `PUT /api/aid-offers/:id` - Update offer
- `POST /api/aid-offers/:id/accept` - Accept offer (seeker)
- `POST /api/aid-offers/:id/cancel` - Cancel offer

### Deliveries
- `POST /api/deliveries` - Create delivery record
- `GET /api/deliveries` - List deliveries
- `GET /api/deliveries/:id` - Get delivery details
- `PUT /api/deliveries/:id` - Update delivery status
- `POST /api/deliveries/:id/confirm` - Confirm delivery (seeker)
- `POST /api/deliveries/:id/proof` - Upload proof photos

### Organizations
- `POST /api/organizations` - Create organization (ADMIN)
- `GET /api/organizations` - List organizations
- `GET /api/organizations/:id` - Get organization details
- `POST /api/organizations/:id/verify` - Verify organization (ADMIN)
- `POST /api/organizations/:id/members` - Add member
- `GET /api/organizations/:id/requests` - Get verified requests

## 🎨 Frontend Components

### Aid Seeker Dashboard
- My Requests (with status timeline)
- Create New Request (with aid type selector)
- Received Aid (what has been delivered)
- Pending Matches (offers matched to my requests)

### Aid Provider Dashboard
- My Offers (what I'm offering)
- Available Requests (requests I can help)
- Urgent Needs (highlighted urgent requests)
- Delivery History (aid I've delivered)

### Admin Dashboard
- Verify Requests
- Match Aid (manual matching)
- Monitor Urgent Food (perishable items)
- Organization Management
- Audit Logs

## 🚨 Urgency Handling

### Perishable Food Priority

1. **Automatic Flagging**: System flags perishable food requests
2. **Urgent Dashboard**: Separate view for urgent needs
3. **Notifications**: Alert providers of urgent needs
4. **Expiration Tracking**: System tracks expiration dates
5. **Auto-Expire**: Requests expire automatically if not matched in time

### Urgency Levels

- **URGENT**: Must be addressed immediately (perishable food)
- **HIGH**: Needed within 24-48 hours
- **MEDIUM**: Needed within a week
- **LOW**: Can wait longer

## 🏢 Organization Model

### Organization Capabilities

1. **Verify Requests**: Organizations can verify requests from their community
2. **Manage Distributions**: Coordinate aid distribution
3. **Network Matching**: Match aid within organization network
4. **Trust Badge**: Verified organizations get trust badge

### Organization Types

- Church
- NGO
- Community Group (Idir)
- School
- Hospital
- Other

## 📊 Analytics (Real Data Only)

### Key Metrics

- Requests by aid type
- Urgent requests count
- Perishable food saved from waste
- Average time to match
- Average time to delivery
- Completion rate by aid type
- Organization performance
- Geographic distribution

### No Fake Numbers

- All metrics computed from database
- Empty states when no data
- Honest reporting

## 🔐 Security & Trust

1. **Identity Verification**: Seekers must verify identity
2. **Organization Verification**: Organizations verified by admin
3. **Request Verification**: All requests verified before matching
4. **Delivery Confirmation**: Seeker must confirm receipt
5. **Audit Trail**: All actions logged

## 🌍 Localization

- English + Amharic support
- Aid type names in both languages
- UI elements translated
- Cultural sensitivity in messaging

## 📱 Mobile-First Design

- Simple flows for low-literacy users
- Large buttons
- Clear icons
- Step-by-step guidance
- Photo upload for proof

## 🎯 Dignity-First Principles

- No shame language
- Respectful terminology
- Focus on needs, not begging
- Empowerment through choice
- Transparent process

