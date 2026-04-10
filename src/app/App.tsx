import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const LandingPage = lazy(() => import('./components/LandingPage'));
const SignInPage = lazy(() => import('./components/SignInPage'));
const SignUpPage = lazy(() => import('./components/SignUpPage'));
const ProfileSetup = lazy(() => import('./components/ProfileSetup'));
const SearchPage = lazy(() => import('./components/SearchPage'));
const VerifyEmailPage = lazy(() => import('./components/VerifyEmailPage'));

const MobileLayout = lazy(() => import('./components/mobile/MobileLayout'));
const MobileLogin = lazy(() =>
  import('./components/mobile/AuthScreens').then((m) => ({ default: m.MobileLogin }))
);
const MobileSignUp = lazy(() =>
  import('./components/mobile/AuthScreens').then((m) => ({ default: m.MobileSignUp }))
);
const MobileDashboard = lazy(() =>
  import('./components/mobile/AppScreens').then((m) => ({ default: m.MobileDashboard }))
);
const MobileBoardingPass = lazy(() =>
  import('./components/mobile/AppScreens').then((m) => ({ default: m.MobileBoardingPass }))
);
const MobileStatus = lazy(() =>
  import('./components/mobile/AppScreens').then((m) => ({ default: m.MobileStatus }))
);
const MobileNotifications = lazy(() =>
  import('./components/mobile/AppScreens').then((m) => ({ default: m.MobileNotifications }))
);
const MobileProfile = lazy(() =>
  import('./components/mobile/AppScreens').then((m) => ({ default: m.MobileProfile }))
);

const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminLogin = lazy(() =>
  import('./components/admin/AdminScreens').then((m) => ({ default: m.AdminLogin }))
);
const AdminDashboard = lazy(() =>
  import('./components/admin/AdminScreens').then((m) => ({ default: m.AdminDashboard }))
);
const UserManagement = lazy(() =>
  import('./components/admin/AdminScreens').then((m) => ({ default: m.UserManagement }))
);
const KYCVerification = lazy(() =>
  import('./components/admin/AdminScreens').then((m) => ({ default: m.KYCVerification }))
);
const SupportTickets = lazy(() =>
  import('./components/admin/AdminScreens').then((m) => ({ default: m.SupportTickets }))
);
const FeedbackManagement = lazy(() =>
  import('./components/admin/AdminScreens').then((m) => ({ default: m.FeedbackManagement }))
);
const AdminSettings = lazy(() =>
  import('./components/admin/AdminScreens').then((m) => ({ default: m.AdminSettings }))
);

const BoardingManagement = lazy(() => import('./components/boarding/BoardingManagement'));
const SearchDiscovery = lazy(() => import('./components/boarding/SearchDiscovery'));
const BookingAgreement = lazy(() => import('./components/boarding/BookingAgreement'));
const PaymentRentalPage = lazy(() => import('./components/payment/PaymentRentalPage'));
const BoardingPlaceDetail = lazy(() => import('./components/payment/BoardingPlaceDetail'));
const StudentPayment = lazy(() => import('./components/payment/StudentPayment'));
const AdministrationMonitoring = lazy(() => import('./components/boarding/AdministrationMonitoring'));
const RoommateFinderPage = lazy(() => import('./components/RoommateFinderPage'));
const RoommateFinderEnhanced = lazy(() => import('./components/RoommateFinderEnhanced'));
const ChatbotSection = lazy(() => import('./components/ChatbotSection'));
const OwnerDashboard = lazy(() => import('./components/OwnerDashboard'));
const StudentDashboard = lazy(() => import('./components/StudentDashboard'));

const BookingManagementSystem = lazy(() => import('./components/booking/BookingManagementSystem'));
const StudentBookingDashboard = lazy(() => import('./components/booking/StudentBookingDashboard'));
const UserProfileDashboard = lazy(() => import('./components/UserProfileDashboard'));

const BoardingDetail = lazy(() => import('./components/BoardingDetail'));
const GroupBooking = lazy(() => import('./components/GroupBooking'));
const ApprovalSuccess = lazy(() => import('./components/ApprovalSuccess'));
const AgreementPayment = lazy(() => import('./components/AgreementPayment'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Chat = lazy(() => import('./components/Chat'));
const RoommateFinderGroupPage = lazy(() => import('./components/RoommateFinderGroupPage'));
const OwnerApprovalPage = lazy(() => import('./components/OwnerApprovalPage'));


export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#cbd5e1' }}>
            Loading...
          </div>
        }
      >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/auth/signin" element={<Navigate to="/signin" replace />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/find" element={<SearchPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        
        {/* Mobile Routes */}
        <Route path="/mobile" element={<MobileLayout />}>
          <Route index element={<Navigate to="/mobile/login" replace />} />
          <Route path="login" element={<MobileLogin />} />
          <Route path="signup" element={<MobileSignUp />} />
          <Route path="dashboard" element={<MobileDashboard />} />
          <Route path="boarding-pass" element={<MobileBoardingPass />} />
          <Route path="status" element={<MobileStatus />} />
          <Route path="notifications" element={<MobileNotifications />} />
          <Route path="profile" element={<MobileProfile />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="kyc" element={<KYCVerification />} />
          <Route path="tickets" element={<SupportTickets />} />
          <Route path="feedback" element={<FeedbackManagement />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Boarding Booking Management System Core Functions */}
        <Route path="/boarding-management" element={<BoardingManagement />} />
        <Route path="/search-discovery" element={<SearchDiscovery />} />
        <Route path="/owner-agreements" element={<BookingAgreement />} />
        <Route path="/payment-rental" element={<PaymentRentalPage />} />
        <Route path="/payment-rental/:placeId" element={<BoardingPlaceDetail />} />
        <Route path="/owner-bookings" element={<BookingManagementSystem />} />
        <Route path="/student-booking" element={<StudentBookingDashboard />} />
        <Route path="/student-payment" element={<StudentPayment />} />
        <Route path="/admin-monitoring" element={<AdministrationMonitoring />} />
        <Route path="/profile" element={<UserProfileDashboard />} />

        {/* Roommate Finder Enhanced Routes (from main branch) */}
        <Route path="/roommate-finder" element={<RoommateFinderPage />} />
        <Route path="/roommate-finder-enhanced" element={<RoommateFinderEnhanced />} />
        <Route path="/roommate-group" element={<RoommateFinderGroupPage />} />
        <Route path="/boarding-detail/:id" element={<BoardingDetail />} />
        <Route path="/group-booking" element={<GroupBooking />} />
        <Route path="/approval-success" element={<ApprovalSuccess />} />
        <Route path="/booking-agreement" element={<AgreementPayment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/owner-approval" element={<OwnerApprovalPage />} />
        <Route path="/chatbot" element={<ChatbotSection standalone={true} />} />

        {/* Role-based dashboard routes */}
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />

        {/* Catch-all: Redirect unknown routes to /signin */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
