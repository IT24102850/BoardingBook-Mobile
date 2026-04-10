# Payment Module - Implementation Details

**Created:** March 28, 2026  
**Module:** Payment Management System for BoardingBook

---

## 📁 Files Created

### 1. `services/paymentService.js`
**Reason:** To separate database queries and business logic from HTTP handling  
**Purpose:** 
- Fetch owner's boarding houses from MongoDB
- Calculate income and occupancy statistics
- Provide reusable functions for multiple controllers

**Functions:**
```javascript
getOwnerBoardingHouses(ownerId)     // Fetch all houses for owner
getHouseRooms(houseId)              // Get rooms in a house
calculateHouseIncome(houseId)       // Calculate monthly income
```

---

### 2. `controllers/paymentController.js`
**Reason:** To handle HTTP requests and format API responses  
**Purpose:**
- Receive and validate HTTP requests
- Call payment service for business logic
- Return properly formatted JSON responses
- Handle authentication via JWT

**Functions:**
```javascript
getOwnerBoardingPlaces(req, res)    // API: Get owner's boarding places
getHouseSummary(req, res)           // API: Get house income summary
```

---

### 3. `routes/paymentRoutes.js`
**Reason:** To centralize and organize all payment API endpoints  
**Purpose:**
- Map HTTP methods to controller functions
- Apply authentication middleware
- Define request/response format

**Routes:**
```
GET /api/payment/boarding-places
GET /api/payment/house-summary/:houseId
```

---

### 4. Updated `app.js`
**Changes:** Added payment routes to main application
```javascript
const paymentRoutes = require('./payment/routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);
```

---

## 🗄️ Database Queries

### Real Data - No Mock!

**Boarding Houses Query:**
```javascript
BoardingHouse.find({ ownerId: ownerId })
```

**Rooms Query:**
```javascript
Room.find({ houseId: houseId })
```

---

## 📡 API Documentation

### Endpoint 1: Get Boarding Places

**Request:**
```http
GET /api/payment/boarding-places
Authorization: Bearer {JWT_TOKEN}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Boarding places fetched successfully",
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Student Plaza Hostel",
      "address": "124, Old Parliament Road",
      "city": "Colombo",
      "monthlyPrice": 19500,
      "totalRooms": 5,
      "totalTenants": 8,
      "availableRooms": 2,
      "status": "active"
    }
  ]
}
```

**Response (No Places):**
```json
{
  "success": false,
  "message": "No boarding places found"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Failed to fetch boarding places",
  "error": "error details"
}
```

---

### Endpoint 2: Get House Payment Summary

**Request:**
```http
GET /api/payment/house-summary/507f1f77bcf86cd799439011
Authorization: Bearer {JWT_TOKEN}
```

**Response:**
```json
{
  "success": true,
  "message": "House summary fetched successfully",
  "data": {
    "houseName": "Student Plaza Hostel",
    "expectedMonthlyIncome": 156000,
    "capacityMonthlyIncome": 195000,
    "occupancyPercentage": "80.00"
  }
}
```

---

## 🔍 Data Flow

```
Frontend Request
    ↓
paymentRoutes.js (Map URL to controller)
    ↓
paymentController.js (Extract user ID, validate)
    ↓
paymentService.js (Query MongoDB)
    ↓
MongoDB (Return data)
    ↓
paymentService.js (Process results)
    ↓
paymentController.js (Format response)
    ↓
Frontend Response
```

---

## ✅ Features

- ✅ Real database queries (no mock data)
- ✅ Error handling for "No boarding places"
- ✅ Owner-specific data filtering via JWT
- ✅ Income calculations and statistics
- ✅ Comprehensive code comments
- ✅ Clear error messages

---

## 🚀 Next Features to Add

1. **Payment History** - Track all payments received
2. **Invoice Generation** - Create payment invoices
3. **Rent Cycle Management** - Monthly rent tracking
4. **Tenant Payments** - Student payment status
5. **Payment Verification** - Validate payment receipts
6. **Refund System** - Handle refunds
7. **Payment Reports** - Financial reporting

---

## 🔒 Security

- ✅ JWT authentication required
- ✅ Owner can only access own data
- ✅ Input validation on all parameters
- ✅ CORS enabled for frontend
- ✅ Rate limiting enabled

---

## 📝 How to Test

**Using cURL:**
```bash
curl -X GET http://localhost:5000/api/payment/boarding-places \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Using Postman:**
1. Set request to `GET`
2. URL: `http://localhost:5000/api/payment/boarding-places`
3. Headers: `Authorization: Bearer YOUR_JWT_TOKEN`
4. Send

---

## 📦 Code Quality

- ✅ MVC pattern implemented
- ✅ Error handling on all functions
- ✅ JSDoc comments on all functions
- ✅ Meaningful variable names
- ✅ DRY principle followed
- ✅ Input validation implemented

---

## 🎯 Status

✅ **Complete and Ready to Use**

All files created with:
- Clear documentation
- Comprehensive comments
- Real database integration
- Error handling
- Authentication

**Ready for frontend integration!**
