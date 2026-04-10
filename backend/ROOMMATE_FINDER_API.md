# Roommate Finder & Group Formation API Documentation

## Overview
This backend provides a complete API for the roommate finder and group formation features. It includes:
- Roommate profile management
- Tinder-style profile swiping
- Roommate request/messaging system
- Booking group formation and management
- Room/boarding house listings

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except `/roommates/rooms` and `/roommates/room/:roomId`) require JWT Bearer token:
```
Authorization: Bearer <token>
```

---

## Roommate Profile Endpoints

### 1. Create/Update Roommate Profile
Create a new or update existing roommate profile for the authenticated user.

**Endpoint:** `POST /roommates/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "description": "Clean, quiet, loves to cook",
  "image": "https://randomuser.me/api/portraits/women/44.jpg",
  "budget": 12000,
  "gender": "Female",
  "academicYear": "2nd Year",
  "preferences": "Early riser, non-smoker",
  "roomType": "Single Room",
  "billsIncluded": true,
  "availableFrom": "2024-02-01T00:00:00Z",
  "tags": ["Pet Friendly", "Vegetarian"],
  "boardingHouse": "Sunrise Boarding",
  "lookingFor": "Shared Room"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile saved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439010",
    "name": "Ayesha",
    "email": "ayesha@university.edu",
    "budget": 12000,
    "gender": "Female",
    "academicYear": "2nd Year",
    "roomType": "Single Room",
    "billsIncluded": true,
    "createdAt": "2024-02-01T00:00:00Z",
    "updatedAt": "2024-02-01T00:00:00Z"
  }
}
```

---

### 2. Get My Roommate Profile
Retrieve the authenticated user's roommate profile.

**Endpoint:** `GET /roommates/profile`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439010",
    "name": "Ayesha",
    "email": "ayesha@university.edu",
    "budget": 12000,
    "gender": "Female",
    "academicYear": "2nd Year",
    "roomType": "Single Room"
  }
}
```

---

### 3. Browse Roommate Profiles
Get list of roommate profiles for swiping (Tinder-style).

**Endpoint:** `GET /roommates/browse`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `gender` (optional): Filter by gender - "Male", "Female", "Other", "Any"
- `minBudget` (optional): Minimum budget in Rs.
- `maxBudget` (optional): Maximum budget in Rs.
- `roomType` (optional): "Single Room" or "Shared Room"
- `academicYear` (optional): "1st Year", "2nd Year", "3rd Year", "4th Year"

**Example Request:**
```
GET /roommates/browse?gender=Female&maxBudget=15000&roomType=Shared%20Room
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Ayesha",
      "budget": 12000,
      "gender": "Female",
      "academicYear": "2nd Year",
      "roomType": "Single Room",
      "image": "https://randomuser.me/api/portraits/women/44.jpg",
      "description": "Clean, quiet, loves to cook"
    }
  ]
}
```

---

### 4. Swipe Profile (Like/Pass)
Record a like or pass action on a profile (Tinder-style swiping).

**Endpoint:** `POST /roommates/swipe`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "profileId": "507f1f77bcf86cd799439011",
  "action": "like"
}
```

**Valid Actions:**
- `"like"` - Like the profile
- `"pass"` - Pass on the profile

**Response (200):**
```json
{
  "success": true,
  "message": "Profile liked successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439010",
    "targetProfileId": "507f1f77bcf86cd799439011",
    "action": "like",
    "createdAt": "2024-02-01T10:00:00Z"
  }
}
```

---

### 5. Get Liked Profiles
Retrieve all profiles liked by the authenticated user.

**Endpoint:** `GET /roommates/liked`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Ayesha",
      "budget": 12000,
      "gender": "Female"
    }
  ]
}
```

---

## Roommate Request Endpoints

### 1. Send Roommate Request
Send a connection request to another user.

**Endpoint:** `POST /roommates/request/send`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "recipientId": "507f1f77bcf86cd799439011",
  "message": "Hi! I think we would be great roommates!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Request sent successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "senderId": "507f1f77bcf86cd799439010",
    "recipientId": "507f1f77bcf86cd799439011",
    "message": "Hi! I think we would be great roommates!",
    "status": "pending",
    "createdAt": "2024-02-01T10:00:00Z"
  }
}
```

---

### 2. Get Inbox Requests
Retrieve requests sent to the authenticated user.

**Endpoint:** `GET /roommates/request/inbox`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Filter by status - "pending", "accepted", "rejected"

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "senderId": {
        "_id": "507f1f77bcf86cd799439010",
        "name": "Nuwan",
        "email": "nuwan@university.edu"
      },
      "message": "Want to room together?",
      "status": "pending",
      "createdAt": "2024-02-01T10:00:00Z"
    }
  ]
}
```

---

### 3. Get Sent Requests
Retrieve requests sent by the authenticated user.

**Endpoint:** `GET /roommates/request/sent`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Filter by status - "pending", "accepted", "rejected"

**Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "recipientId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Ayesha",
        "email": "ayesha@university.edu"
      },
      "message": "Hi! I think we would be great roommates!",
      "status": "pending",
      "createdAt": "2024-02-01T10:00:00Z"
    }
  ]
}
```

---

### 4. Get Specific Request
Retrieve a specific roommate request by ID.

**Endpoint:** `GET /roommates/request/:requestId`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "senderId": { "name": "Nuwan", "email": "nuwan@university.edu" },
    "recipientId": { "name": "Ayesha", "email": "ayesha@university.edu" },
    "message": "Want to room together?",
    "status": "pending"
  }
}
```

---

### 5. Accept Roommate Request
Accept an incoming roommate request.

**Endpoint:** `PATCH /roommates/request/:requestId/accept`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Request accepted",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "status": "accepted",
    "respondedAt": "2024-02-01T11:00:00Z"
  }
}
```

---

### 6. Reject Roommate Request
Reject an incoming roommate request.

**Endpoint:** `PATCH /roommates/request/:requestId/reject`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Request rejected",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "status": "rejected",
    "respondedAt": "2024-02-01T11:00:00Z"
  }
}
```

---

## Booking Group Endpoints

### 1. Create Booking Group
Create a new booking group for house booking.

**Endpoint:** `POST /roommates/group`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "SLIIT Friends 2026",
  "boardingHouse": "Sunrise Boarding",
  "description": "Group looking for accommodation",
  "memberEmails": ["friend1@university.edu", "friend2@university.edu"],
  "totalBudget": 54000
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Group created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "name": "SLIIT Friends 2026",
    "creatorId": "507f1f77bcf86cd799439010",
    "members": [
      {
        "userId": "507f1f77bcf86cd799439010",
        "email": "creator@university.edu",
        "name": "You",
        "status": "accepted",
        "joinedAt": "2024-02-01T10:00:00Z"
      }
    ],
    "boardingHouse": "Sunrise Boarding",
    "status": "forming",
    "createdAt": "2024-02-01T10:00:00Z"
  }
}
```

---

### 2. Get User's Groups
Retrieve all groups the authenticated user is part of (as creator or member).

**Endpoint:** `GET /roommates/groups`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "name": "SLIIT Friends 2026",
      "status": "forming",
      "members": 4,
      "createdAt": "2024-02-01T10:00:00Z"
    }
  ]
}
```

---

### 3. Get Specific Group
Retrieve details of a specific booking group.

**Endpoint:** `GET /roommates/group/:groupId`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "name": "SLIIT Friends 2026",
    "creatorId": "507f1f77bcf86cd799439010",
    "members": [
      {
        "userId": {
          "_id": "507f1f77bcf86cd799439010",
          "name": "You",
          "email": "your@university.edu"
        },
        "status": "accepted",
        "joinedAt": "2024-02-01T10:00:00Z"
      },
      {
        "userId": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "Ayesha",
          "email": "ayesha@university.edu"
        },
        "status": "pending",
        "joinedAt": "2024-02-01T10:30:00Z"
      }
    ],
    "boardingHouse": "Sunrise Boarding",
    "status": "forming",
    "totalBudget": 54000
  }
}
```

---

### 4. Add Member to Group
Add a new member to a group (group creator only).

**Endpoint:** `POST /roommates/group/:groupId/member`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "memberEmail": "newmember@university.edu"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Member added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "members": [
      {
        "email": "newmember@university.edu",
        "status": "pending",
        "joinedAt": "2024-02-01T11:00:00Z"
      }
    ]
  }
}
```

---

### 5. Remove Member from Group
Remove a member from a group (creator can remove anyone, members can remove themselves).

**Endpoint:** `DELETE /roommates/group/:groupId/member/:memberId`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Member removed successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "members": []
  }
}
```

---

### 6. Respond to Group Invite
Accept or reject a group invitation.

**Endpoint:** `PATCH /roommates/group/:groupId/respond`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "accepted"
}
```

**Valid Statuses:**
- `"accepted"` - Accept group invitation
- `"rejected"` - Reject group invitation

**Response (200):**
```json
{
  "success": true,
  "message": "Group invitation accepted",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "members": [
      {
        "status": "accepted"
      }
    ]
  }
}
```

---

### 7. Update Group Status
Update the group status (forming → ready → booked). Creator only.

**Endpoint:** `PATCH /roommates/group/:groupId/status`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "ready"
}
```

**Valid Statuses:**
- `"forming"` - Group is forming
- `"ready"` - Group is ready to book
- `"booked"` - Group has booked accommodation

**Response (200):**
```json
{
  "success": true,
  "message": "Group status updated",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "status": "ready"
  }
}
```

---

## Room/Boarding House Endpoints

### 1. Get All Available Rooms
Retrieve list of available boarding houses/rooms.

**Endpoint:** `GET /roommates/rooms`

**Query Parameters:**
- `location` (optional): Search by location
- `minPrice` (optional): Minimum price in Rs.
- `maxPrice` (optional): Maximum price in Rs.
- `minVacancy` (optional): Minimum available spots
- `facilities` (optional): Filter by facilities (can be array)
- `sort` (optional): Sort by "price" or "createdAt"

**Example Request:**
```
GET /roommates/rooms?location=Malabe&minPrice=8000&maxPrice=15000&minVacancy=2&sort=price
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "name": "Malabe Comfort Stay",
      "location": "Malabe, Colombo",
      "price": 8500,
      "totalSpots": 4,
      "occupancy": 3,
      "vacancy": 1,
      "facilities": ["WiFi", "AC", "Bathroom"],
      "owner": "Mr. Silva",
      "ownerPhone": "+94701234567",
      "ownerEmail": "owner@boarding.com"
    }
  ]
}
```

---

### 2. Get Specific Room
Retrieve detailed information about a room.

**Endpoint:** `GET /roommates/room/:roomId`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "name": "Malabe Comfort Stay",
    "location": "Malabe, Colombo",
    "price": 8500,
    "totalSpots": 4,
    "occupancy": 3,
    "vacancy": 1,
    "facilities": ["WiFi", "AC", "Bathroom"],
    "amenities": ["Laundry", "Common Area", "Kitchen"],
    "rules": ["No smoking", "Quiet hours after 10 PM"],
    "description": "Clean and comfortable boarding house",
    "owner": "Mr. Silva",
    "ownerPhone": "+94701234567",
    "ownerEmail": "owner@boarding.com",
    "images": ["url1", "url2"]
  }
}
```

---

### 3. Create Room
Create a new room listing (admin/owner only).

**Endpoint:** `POST /roommates/room`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Malabe Premium Annex",
  "location": "Malabe, Colombo",
  "price": 18000,
  "totalSpots": 6,
  "facilities": ["WiFi", "AC", "Parking", "Laundry"],
  "description": "Premium boarding with all amenities",
  "owner": "Mr. Perera",
  "ownerPhone": "+94702345678",
  "ownerEmail": "owner@premium.com",
  "amenities": ["Gym", "Common Area", "Security"],
  "rules": ["No visitors after 10 PM"]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "name": "Malabe Premium Annex",
    "location": "Malabe, Colombo",
    "price": 18000,
    "totalSpots": 6,
    "occupancy": 0
  }
}
```

---

### 4. Update Room
Update room details (admin/owner only).

**Endpoint:** `PATCH /roommates/room/:roomId`

**Headers:** `Authorization: Bearer <token>`

**Request Body (send only fields to update):**
```json
{
  "description": "Updated description",
  "amenities": ["Gym", "WiFi"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Room updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "description": "Updated description",
    "amenities": ["Gym", "WiFi"]
  }
}
```

---

### 5. Update Room Occupancy
Update number of occupied spots in a room.

**Endpoint:** `PATCH /roommates/room/:roomId/occupancy`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "occupancy": 4
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Occupancy updated",
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "totalSpots": 6,
    "occupancy": 4,
    "vacancy": 2
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error or invalid input"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authorization header missing or invalid"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## Testing Guide

### 1. Create Roommate Profile
```bash
curl -X POST http://localhost:5000/api/roommates/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "budget": 12000,
    "gender": "Female",
    "academicYear": "2nd Year",
    "roomType": "Single Room",
    "availableFrom": "2024-02-01T00:00:00Z",
    "description": "Clean and quiet",
    "preferences": "Early riser"
  }'
```

### 2. Browse Profiles
```bash
curl http://localhost:5000/api/roommates/browse \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Swipe on Profile
```bash
curl -X POST http://localhost:5000/api/roommates/swipe \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profileId": "507f1f77bcf86cd799439011",
    "action": "like"
  }'
```

### 4. Send Roommate Request
```bash
curl -X POST http://localhost:5000/api/roommates/request/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId": "507f1f77bcf86cd799439011",
    "message": "Hi! I think we would be great roommates!"
  }'
```

### 5. Create Booking Group
```bash
curl -X POST http://localhost:5000/api/roommates/group \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "SLIIT Friends 2026",
    "boardingHouse": "Sunrise Boarding",
    "memberEmails": ["friend1@university.edu"]
  }'
```

### 6. Get Available Rooms
```bash
curl "http://localhost:5000/api/roommates/rooms?location=Malabe&maxPrice=15000"
```

---

## Next Steps for Frontend Integration

1. **Update API Client** - Add methods for roommate finder endpoints in your `authApi.ts`
2. **Create Roommate Profile on User Signup** - Call `/roommates/profile` after successful signup
3. **Connect Browse Component** - Use `/roommates/browse` with filters
4. **Implement Swipe Logic** - Call `/roommates/swipe` on each like/pass
5. **Wire Requests Section** - Use `/roommates/request/*` endpoints for messaging
6. **Connect Group Creation** - Use `/roommates/group` endpoints for group management
7. **Display Rooms** - Use `/roommates/rooms` endpoint with filters

---

## Database Models Summary

- **RoommateProfile**: User's roommate finder profile
- **RoommateRequest**: Connection requests between users
- **RoommateMatch**: Track user likes/passes (for preventing duplicates)
- **BookingGroup**: Groups formed for booking accommodation
- **Room**: Available boarding houses/rooms

All models have timestamps and proper indexing for performance.
