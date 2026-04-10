# 🚀 Quick Start Guide - Testing the Payment Flow

## Overview
This guide will help you test the complete booking and payment flow system.

## 🎯 Test URLs

### Student Pages
- **Browse Rooms**: http://localhost:5174/find
- **My Booking**: http://localhost:5174/student-booking
- **Payment History**: http://localhost:5174/student-payment

### Owner Pages
- **Booking Requests**: http://localhost:5174/owner-bookings
- **Payment Verification**: http://localhost:5174/owner-payment-dashboard
- **Owner Dashboard**: http://localhost:5174/owner-dashboard

## 📋 Test Scenario (Step by Step)

### Phase 1: Student Submits Booking Request

1. **Open Search Page**
   ```
   http://localhost:5174/find
   ```

2. **Browse Rooms**
   - You'll see the room finder with filters
   - Click on "Rooms" tab if not already selected
   - Browse through available rooms

3. **Submit Booking**
   - Click "Book Now" button on any room
   - Fill in the booking form:
     - Select "Individual Booking" or "Group Booking"
     - Enter name
     - Contact: +94 77 123 4567
     - Move-in Date: Choose a future date
     - Duration: 6 (months)
     - Notes: "Test booking request"
   - Click "Submit Booking Request"
   - You should see a success toast message

4. **View Booking Status**
   ```
   http://localhost:5174/student-booking
   ```
   - You should see your booking with "Awaiting Owner Review" status
   - Status badge will be yellow/amber colored

---

### Phase 2: Owner Reviews and Approves

1. **Open Owner Booking Management**
   ```
   http://localhost:5174/owner-bookings
   ```

2. **Review Dashboard**
   - See statistics: Total, Pending, Approved, Rejected bookings
   - Click "Pending" tab to filter pending requests
   - You should see the test booking you just created

3. **Review Booking Details**
   - Click on the booking card to expand
   - Review all student details:
     - Student name and contact
     - Room selected
     - Move-in date and duration
     - Special notes

4. **Approve the Booking**
   - Click the green "Approve Booking" button
   - Booking status changes to "Approved"
   - Payment status shows "Awaiting Payment Upload"

---

### Phase 3: Student Uploads Payment Slip

1. **Return to Student Dashboard**
   ```
   http://localhost:5174/student-booking
   ```

2. **Check Updated Status**
   - Status should now show "Booking Approved!" (green badge)
   - You should see "Upload Payment Slip" section
   - Owner contact information is now visible

3. **Upload Payment Slip**
   - Click "Upload Payment Slip" button
   - Modal opens
   - Click to select a file or drag & drop
   - Accepted formats: JPG, PNG, or PDF
   - Choose any image file from your computer
   - Click "Submit"
   - Success message appears
   - Status changes to "Payment Under Review" (blue badge)

---

### Phase 4: Owner Verifies Payment

1. **Open Owner Payment Dashboard**
   ```
   http://localhost:5174/owner-payment-dashboard
   ```

2. **Review Payment Slip**
   - Find the "New Payment Slips to Review" section
   - You should see the uploaded payment slip
   - Student name, room, and amount displayed

3. **Verify Payment**
   - Click "View Slip" button to preview (optional)
   - Click the green checkmark button (✓) to approve
   - Payment status updates to "Verified"

---

### Phase 5: Student Gets Receipt

1. **Return to Student Dashboard**
   ```
   http://localhost:5174/student-booking
   ```

2. **Download Receipt**
   - Status should now show "Payment Verified!" (green badge)
   - "Download Receipt" button is visible
   - Click to download your payment receipt
   - Receipt opens in new tab/downloads

---

## 🔄 Alternative Flow: Rejection Scenario

### Test Rejection Path

1. **From Owner Bookings Page**
   ```
   http://localhost:5174/owner-bookings
   ```

2. **Reject a Booking**
   - Find a pending booking
   - Click red "Reject Booking" button
   - Modal opens
   - Enter rejection reason (optional): "Room no longer available"
   - Click "Confirm Rejection"

3. **View on Student Dashboard**
   ```
   http://localhost:5174/student-booking
   ```
   - Status shows "Booking Rejected" (red badge)
   - Rejection reason is displayed
   - Room is moved to "Saved Rooms" wishlist
   - Student can browse the wishlist for alternative options

---

## 🎨 UI Elements to Check

### Student Dashboard (`/student-booking`)
✅ Booking status badge (Pending/Approved/Rejected)  
✅ Payment status section (changes based on state)  
✅ Upload payment slip button (when approved)  
✅ Owner contact information (when approved)  
✅ Download receipt button (when payment verified)  
✅ Saved rooms wishlist  
✅ Quick stats sidebar  

### Owner Bookings (`/owner-bookings`)
✅ Statistics cards (Total, Pending, Approved, Rejected)  
✅ Filter tabs  
✅ Booking request cards with full details  
✅ Approve/Reject buttons  
✅ Payment status badges  
✅ Link to payment dashboard  

### Owner Payment Dashboard (`/owner-payment-dashboard`)
✅ New payment slips section  
✅ Payment slip cards with student info  
✅ View/Approve/Reject buttons  
✅ Boarding place selection  
✅ Payment summary  

---

## 📊 Status Indicators Reference

### Booking Status
| Badge Color | Status | Meaning |
|-------------|--------|---------|
| 🟡 Amber | Pending | Awaiting owner review |
| 🟢 Green | Approved | Booking confirmed by owner |
| 🔴 Red | Rejected | Booking declined by owner |

### Payment Status
| Badge Color | Status | Meaning |
|-------------|--------|---------|
| 🟡 Amber | Not Uploaded | Student needs to upload slip |
| 🔵 Blue | Uploaded | Awaiting owner verification |
| 🟢 Green | Verified | Payment confirmed |
| 🔴 Red | Rejected | Payment slip rejected |

---

## 🐛 Troubleshooting

### Issue: Booking doesn't appear after submission
**Solution:** 
- Refresh the page
- Check if you're on the correct URL
- Verify form was filled correctly

### Issue: Payment slip won't upload
**Solution:**
- Check file size (must be under 5MB)
- Verify file format (JPG, PNG, or PDF only)
- Try a different image

### Issue: Changes not reflecting
**Solution:**
- Hard refresh the page (Ctrl + F5)
- Clear browser cache
- Check browser console for errors

### Issue: Modal not closing
**Solution:**
- Click outside the modal
- Press Escape key
- Click the close button (X)

---

## 💡 Tips for Testing

1. **Use Multiple Browser Windows**
   - One for student view
   - One for owner view
   - Test simultaneous updates

2. **Test Edge Cases**
   - Submit booking with empty fields (should show error)
   - Upload very large files (should fail)
   - Upload wrong file types (should reject)
   - Test rejection with and without reason

3. **Check Responsiveness**
   - Resize browser window
   - Test on mobile device
   - Check all breakpoints

4. **Verify Navigation**
   - Click all navigation links
   - Use browser back button
   - Test deep linking (direct URL access)

5. **Test Data Persistence**
   - Refresh pages
   - Navigate away and back
   - Check if data persists

---

## 📱 Mobile Testing

### Chrome DevTools
1. Press `F12` to open DevTools
2. Click the device toolbar icon (Ctrl + Shift + M)
3. Select a mobile device from dropdown
4. Test all flows on mobile view

### Key Mobile Features to Test
- ✅ Booking form fits on screen
- ✅ Buttons are easily tappable
- ✅ Payment upload works on mobile
- ✅ Images load correctly
- ✅ Navigation is accessible
- ✅ Modals display properly

---

## 🎯 Success Criteria

Your implementation is working correctly if:

✅ Student can browse rooms and submit booking  
✅ Owner sees booking request immediately  
✅ Owner can approve or reject bookings  
✅ Student sees updated status after owner action  
✅ Payment upload works smoothly  
✅ Owner can verify payments  
✅ Receipt is downloadable after verification  
✅ Rejected bookings move to wishlist  
✅ All navigation links work correctly  
✅ Status badges show correct colors and text  
✅ No console errors appear  
✅ Pages are responsive on mobile  

---

## 🚀 Next Steps

After testing:

1. **Connect to Real Backend**
   - Replace mock data with API calls
   - Implement database storage
   - Add authentication

2. **Add Notifications**
   - Email alerts for status changes
   - SMS reminders for payments
   - Push notifications

3. **Enhance Security**
   - Add file encryption for payment slips
   - Implement user authentication
   - Add payment gateway integration

4. **Improve UX**
   - Add loading states
   - Implement optimistic updates
   - Add animations and transitions

5. **Analytics**
   - Track user behavior
   - Monitor conversion rates
   - Analyze payment success rates

---

## 📞 Support

If you encounter any issues during testing:
- Check the [Complete Flow Documentation](BOOKING_PAYMENT_FLOW.md)
- Review browser console for errors
- Verify all dependencies are installed
- Ensure dev server is running

---

Happy Testing! 🎉

The system is now ready for demonstration and further development.
