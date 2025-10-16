# Bring2Life API Routes

## Overview

This directory contains all Next.js API routes for the Bring2Life platform.

## Implemented Routes

### ✅ Commissions
- `POST /api/commissions` - Create new commission
- `GET /api/commissions` - List commissions (with filters)
- `GET /api/commissions/[id]` - Get commission details
- `PATCH /api/commissions/[id]` - Update commission
- `DELETE /api/commissions/[id]` - Cancel commission

### 🔄 To Be Created (Next Steps)

#### Bids
- `POST /api/bids` - Submit bid
- `GET /api/bids` - List bids (by artist or commission)
- `GET /api/bids/[id]` - Get bid details
- `PATCH /api/bids/[id]` - Update bid
- `POST /api/bids/[id]/accept` - Accept bid
- `POST /api/bids/[id]/reject` - Reject bid

#### Milestones
- `POST /api/milestones` - Create milestones (batch)
- `GET /api/milestones` - List milestones for commission
- `POST /api/milestones/[id]/submit` - Submit milestone work
- `POST /api/milestones/[id]/approve` - Approve milestone
- `POST /api/milestones/[id]/reject` - Reject milestone

#### Users
- `POST /api/users` - Create user profile
- `GET /api/users/[id]` - Get user profile
- `PATCH /api/users/[id]` - Update user profile
- `GET /api/users/[id]/stats` - Get user statistics

#### IPFS
- `POST /api/ipfs/upload` - Upload file to Pinata
- `POST /api/ipfs/upload-json` - Upload JSON metadata

#### Payments
- `POST /api/payments/escrow-deposit` - Handle escrow deposit
- `POST /api/payments/milestone-payment` - Process milestone payment
- `GET /api/payments/transactions` - List transactions

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "pagination": { // if applicable
    "limit": 20,
    "offset": 0,
    "total": 100
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Authentication

Currently using Supabase RLS for authentication. Future: Add JWT middleware.

## Rate Limiting

To be implemented in production.

## Testing

Run API tests with: `pnpm run test:api` (to be created)
