# Booking & Agreement Management

This module now contains a working end-to-end flow for booking and rental agreement management, integrated with backend APIs and MongoDB persistence.

## Implemented Features

- Submit individual or group booking requests
- Owner reviews requests and approves/rejects with decision note
- Status tracking for each booking through all stages
- Auto-generate digital rental agreement using submitted booking data
- Students review and digitally accept agreement (checkbox + confirm)
- Owner confirms after all student signatures
- Signed agreement can be downloaded/opened as a generated PDF data URI
- Agreement signing is enforced before final booking completion

## Backend Integration

Booking screen now calls Express APIs under `/api/bookings` and persists records in MongoDB.

If MongoDB is unavailable, backend now falls back to in-memory booking storage so APIs remain usable during development. In-memory data resets when server restarts.

- `GET /api/bookings`: list bookings
- `POST /api/bookings/request`: create booking request
- `PATCH /api/bookings/:id/owner-decision`: approve/reject booking
- `POST /api/bookings/:id/generate-agreement`: generate digital agreement
- `POST /api/bookings/:id/student-sign`: student signs agreement
- `POST /api/bookings/:id/owner-confirm`: owner final confirmation + PDF generation
- `GET /api/bookings/:id/agreement-pdf`: fetch generated agreement PDF data URI

## File Structure

- `booking/screens/BookingAgreementScreen.tsx`: Main workflow UI and state transitions
- `booking/types.ts`: Booking and agreement models
- `booking/utils/agreementPdf.ts`: PDF generation utility (data URI)

## Navigation

The screen is wired into app navigation as:

- Route name: `BookingAgreement`
- Title: `Booking & Agreement`

Open it via navigation in `App.tsx` stack.
