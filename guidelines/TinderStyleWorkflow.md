# BoardingBook Tinder-Style Workflow Screens

## 1. Splash Screen
- BoardingBook logo
- Quick load animation
- Check JWT session
- Redirect: Home (if logged in) / Onboarding (if not)

## 2. Onboarding Slides
- Slide 1: “Find safe, verified boarding near campus”
- Slide 2: “Match with roommates & book as a group”
- Slide 3: “Digital agreements & easy payments”
- CTA: Get Started / Skip

## 3. Auth Gate
- Sign In / Sign Up
- SLIIT email verification (students)
- Owner registration (KYC later)
- Admin verification queue

## 4. Profile Setup
- Student: Budget, Distance, Gender, Academic year, Roommate preferences
- Owner: Boarding details, Rooms, facilities, prices

## 5. Home (Browse Cards)
- Card-based boarding browsing
- Filters: price, distance, facilities, availability
- Actions: Save, View details, Add to shortlist, Create/join roommate group

## 6. Match Equivalent
- Student sends booking request
- Owner approves
- Group confirmed
- Digital agreement generated
- Success animation: “Booking Approved! 🎉”

## 7. Chat / Interaction
- Student ↔ Owner chat
- Group chat for roommates

## 8. Payment & Commitment
- Pay advance/deposit/rent
- Split payments for groups
- Progress bar: Agreement Signed → Payment Pending → Booking Confirmed

## 9. Post-Booking Dashboard
- Student: Booking status, Payment history, Receipts
- Owner: Tenants, Payments, Reminders

---

## Full Flow Diagram
Open App → Splash Screen → Onboarding → Sign In/Sign Up → Profile Setup → Home (Browse) → Save/Group/Request → Owner Approval (Match) → Agreement/Payment → Dashboard

---

## Implementation Plan
- SplashScreen.tsx
- OnboardingSlides.tsx
- SignInPage.tsx / SignUpPage.tsx
- ProfileSetup.tsx
- Home.tsx (Card browser)
- BoardingDetail.tsx
- GroupBooking.tsx
- ApprovalSuccess.tsx
- AgreementPayment.tsx
- Dashboard.tsx

---

## UX Principles
- Fast entry
- Core loop
- Match moment
- Guided setup
- Instant feedback
- Retention
