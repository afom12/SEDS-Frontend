# 🧭 Platform Flow - Sequence Diagrams

## 🔐 STEP 0: Registration Flow

```
User → Frontend → Backend → Database
  |       |          |          |
  |--Register Request-->|          |
  |       |--POST /api/auth/register-->|
  |       |          |--Create User-->|
  |       |          |--Status: UNVERIFIED-->|
  |       |<--Return User + Tokens--|
  |<--Show Role Selection--|
  |--Select Role-->|
  |--Upload Documents-->|
  |--Submit Verification-->|
  |       |--POST /api/users/verify-->|
  |       |          |--Status: PENDING_VERIFICATION-->|
  |<--Verification Pending--|
```

## 👤 AID SEEKER FLOW

### Step 1: Identity Verification

```
Aid Seeker → Frontend → Backend → Admin/Org
  |       |          |          |
  |--Login-->|          |          |
  |<--Dashboard (Unverified)-->|
  |--Complete Profile-->|
  |--Upload ID/Letter-->|
  |       |--POST /api/users/profile-->|
  |       |--POST /api/documents-->|
  |       |          |--Status: PENDING_VERIFICATION-->|
  |<--Profile Saved-->|
  |<--"Awaiting Verification" Message-->|
```

### Step 2: Admin/Org Review

```
Admin/Org → Frontend → Backend → Database
  |       |          |          |
  |--View Pending Users-->|
  |       |--GET /api/admin/users?status=PENDING-->|
  |<--List of Pending Users--|
  |--Review Profile-->|
  |--Review Documents-->|
  |--Approve/Reject-->|
  |       |--POST /api/admin/users/:id/verify-->|
  |       |          |--Status: VERIFIED-->|
  |       |          |--Send Notification-->|
  |<--User Verified-->|
```

### Step 3: Create Aid Request

```
Verified Seeker → Frontend → Backend → Database
  |       |          |          |
  |--Click "Request Help"-->|
  |<--Aid Type Selector-->|
  |--Select Aid Type-->|
  |--Enter Details-->|
  |  - Quantity
  |  - Urgency
  |  - Deadline (if food)
  |  - Delivery preference
  |       |--POST /api/requests-->|
  |       |          |--Status: SUBMITTED-->|
  |<--Request Created-->|
  |<--"Under Review" Message-->|
```

### Step 4: Request Verification

```
Admin/Org → Frontend → Backend → Database
  |       |          |          |
  |--View Pending Requests-->|
  |       |--GET /api/admin/requests?status=SUBMITTED-->|
  |<--List of Requests--|
  |--Review Request-->|
  |--Check Urgency-->|
  |--Approve/Reject-->|
  |       |--POST /api/admin/requests/:id/approve-->|
  |       |          |--Status: VERIFIED-->|
  |       |          |--Make Visible to Donors-->|
  |<--Request Verified-->|
```

### Step 5: Matching Phase

```
System → Backend → Database → Donors
  |       |          |          |
  |--Find Matching Offers-->|
  |       |--GET /api/aid-offers/available-->|
  |       |--Match Algorithm-->|
  |       |  - Urgency Priority
  |       |  - Location Match
  |       |  - Type Match
  |       |--Status: WAITING_FOR_MATCH-->|
  |--Notify Donors-->|
  |--Highlight Urgent-->|
```

### Step 6: Aid In Progress

```
Donor → Frontend → Backend → Seeker
  |       |          |          |
  |--Accept Match-->|
  |       |--POST /api/aid-offers/:id/accept-->|
  |       |          |--Status: MATCHED-->|
  |       |          |--Notify Seeker-->|
  |--Create Delivery-->|
  |       |--POST /api/deliveries-->|
  |       |          |--Status: IN_PROGRESS-->|
  |<--Delivery Scheduled-->|
```

### Step 7: Completion

```
Seeker → Frontend → Backend → Database
  |       |          |          |
  |--Receive Aid-->|
  |--Confirm Receipt-->|
  |       |--POST /api/deliveries/:id/confirm-->|
  |       |          |--Status: CONFIRMED-->|
  |       |          |--Request: COMPLETED-->|
  |--Upload Proof (Optional)-->|
  |       |--POST /api/deliveries/:id/proof-->|
  |<--Request Completed-->|
```

## 🤝 AID PROVIDER FLOW

### Step 1: Verification

```
Provider → Frontend → Backend → Admin
  |       |          |          |
  |--Complete Profile-->|
  |--Optional Org Link-->|
  |       |--POST /api/users/profile-->|
  |       |--Status: PENDING_VERIFICATION-->|
  |--Admin Reviews-->|
  |       |--POST /api/admin/users/:id/verify-->|
  |       |--Status: VERIFIED-->|
  |<--Verified-->|
```

### Step 2: Choose How to Help

```
Provider → Frontend → Backend
  |       |          |
  |--View Dashboard-->|
  |       |--GET /api/requests?urgent=true-->|
  |<--Urgent Needs List--|
  |--OR Create Offer-->|
  |<--Offer Form-->|
```

### Step 3: Offer Aid

```
Provider → Frontend → Backend → Database
  |       |          |          |
  |--Fill Offer Form-->|
  |  - Aid Type
  |  - Quantity
  |  - Availability
  |  - Location
  |       |--POST /api/aid-offers-->|
  |       |          |--Status: AVAILABLE-->|
  |<--Offer Created-->|
```

### Step 4: Match & Confirm

```
System → Backend → Provider → Seeker
  |       |          |          |
  |--Auto-Match-->|
  |       |--POST /api/requests/:id/match/:offerId-->|
  |       |--Status: MATCHED-->|
  |--Notify Provider-->|
  |--Notify Seeker-->|
  |--Provider Confirms-->|
  |       |--POST /api/aid-offers/:id/accept-->|
  |       |--Status: ACCEPTED-->|
```

### Step 5: Delivery

```
Provider → Frontend → Backend → Seeker
  |       |          |          |
  |--Schedule Delivery-->|
  |       |--POST /api/deliveries-->|
  |       |--Status: SCHEDULED-->|
  |--Deliver Aid-->|
  |--Mark Delivered-->|
  |       |--PUT /api/deliveries/:id/status-->|
  |       |--Status: DELIVERED-->|
  |--Seeker Confirms-->|
  |       |--Status: CONFIRMED-->|
```

### Step 6: Impact Visibility

```
Provider → Frontend → Backend
  |       |          |
  |--View History-->|
  |       |--GET /api/deliveries?providerId=:id-->|
  |<--Delivery History--|
  |--View Impact Reports-->|
  |       |--GET /api/requests/:id/impact-->|
  |<--Impact Data--|
```

## 🏛️ ORGANIZATION FLOW

### Step 1: Verify Users

```
Org Admin → Frontend → Backend → Database
  |       |          |          |
  |--View Pending Users-->|
  |       |--GET /api/admin/users?status=PENDING-->|
  |<--User List--|
  |--Review User-->|
  |--Approve/Reject-->|
  |       |--POST /api/admin/users/:id/verify-->|
  |       |--Status: VERIFIED-->|
```

### Step 2: Verify Requests

```
Org Admin → Frontend → Backend → Database
  |       |          |          |
  |--View Pending Requests-->|
  |       |--GET /api/admin/requests?status=SUBMITTED-->|
  |<--Request List--|
  |--Review Request-->|
  |--Check Urgency-->|
  |--Approve/Reject-->|
  |       |--POST /api/admin/requests/:id/approve-->|
  |       |--Status: VERIFIED-->|
```

### Step 3: Match & Monitor

```
Org Admin → Frontend → Backend → System
  |       |          |          |
  |--View Urgent Requests-->|
  |       |--GET /api/requests?urgency=URGENT-->|
  |<--Urgent List--|
  |--Manual Match-->|
  |       |--POST /api/requests/:id/match/:offerId-->|
  |--Monitor Deliveries-->|
  |       |--GET /api/deliveries?status=IN_PROGRESS-->|
```

### Step 4: Confirm Completion

```
Org Admin → Frontend → Backend → Database
  |       |          |          |
  |--View Deliveries-->|
  |--Confirm Handover-->|
  |       |--POST /api/deliveries/:id/confirm-->|
  |       |--Status: CONFIRMED-->|
  |--Close Request-->|
  |       |--PUT /api/requests/:id-->|
  |       |--Status: COMPLETED-->|
```

## 🍎 FOOD-SPECIFIC FLOW

```
Seeker → System → Backend → Donors
  |       |          |          |
  |--Create Food Request-->|
  |--Set Expiry Date-->|
  |       |--POST /api/requests-->|
  |       |--isPerishable: true-->|
  |       |--expiresAt: [date]-->|
  |       |--urgency: URGENT-->|
  |--System Flags Urgent-->|
  |--Auto-Notify Donors-->|
  |--Priority in Matching-->|
  |--If Not Matched Before Expiry-->|
  |       |--Status: EXPIRED-->|
```

## 📊 ANALYTICS FLOW

```
User → Frontend → Backend → Database
  |       |          |          |
  |--View Dashboard-->|
  |       |--GET /api/admin/analytics-->|
  |       |          |--Query Database-->|
  |       |          |--Calculate Metrics-->|
  |       |          |  - Completed Requests
  |       |          |  - Food Saved
  |       |          |  - Time to Delivery
  |       |          |  - Aid by Category
  |       |<--Real Data--|
  |<--Display Analytics--|
  |--If No Data-->|
  |<--Show Empty State--|
```

