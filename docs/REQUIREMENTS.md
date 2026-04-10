# Boarding Booking Management System - REQUIREMENTS

## Roles
- Student
- Boarding House Owner
- Admin (Campus Staff)

## 6 Core Modules

### 1. Boarding House & Room Management (Owner)
- Add, edit, delete boarding houses and rooms
- Upload photos, set prices, facilities (Wi-Fi, bathroom, meals, AC, etc.), number of beds/vacancies
- Manage availability, mark rooms as full/partially occupied
- Tenant overview dashboard (see who lives in each room)
- Send payment reminders to students or rooms
- View/download payment receipts

### 2. Search, Filtering & Discovery (Student)
- Search and real-time filters (price, distance, facilities, room type, availability)
- Interactive map view with pins and previews
- Listing cards with photos, badges, roommate hints
- Mobile-friendly, saved searches, “no results” suggestions

### 3. Roommate Finder & Group Formation (Student)
- Create roommate profile (description, budget, habits, preferences)
- Tag current/planned boarding house
- Browse/send/accept roommate requests
- Create booking groups, invite members, notifications
- Join existing room or form group for new place

### 4. Booking & Agreement Management (Student + Owner)
- Submit individual/group booking requests
- Owner reviews/approves/rejects with status tracking
- Auto-generate digital rental agreement (PDF)
- Students review/accept, owner confirms, signed agreement downloadable

### 5. Payment & Rental Management (Student + Owner)
- Pay advance, deposit, monthly rent through system
- Support split payments for shared rooms/groups
- View payment history, download receipts
- Automatic due-date reminders
- Owners see payment status per tenant/room

### 6. Administration & Monitoring (Admin)
- Verify student registrations (ID + photo)
- Approve/reject owner registrations
- Moderate listings, roommate profiles, complaints/disputes
- View system reports (bookings, tenants, payments, verification queue)
- Ensure security and trust

## Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT, bcrypt

## Project Structure

boarding-booking-system/
  backend/
    src/
      config/
      middleware/
      models/
      routes/
      controllers/
      services/
      utils/
      app.js
      server.js
  frontend/
    src/
      api/
      components/
      pages/
      routes/
      auth/

## API & UI/UX Principles
- RESTful APIs, error handling, validation
- Responsive, accessible, mobile-first UI
- Use Unsplash or similar for images
- Clear navigation, feedback, and onboarding
- Use Copilot Chat for module/file generation
