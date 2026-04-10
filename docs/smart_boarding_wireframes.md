---
# BoardingBook Platform Wireframes

## Mobile App (Passenger)

### Login Screen
```
+-------------------------------+
|           [Logo]              |
|      Smart Boarding           |
|------------------------------|
| Email/Phone: [__________]     |
| Password:   [__________]      |
|------------------------------|
| [Login Button]                |
| [Create Account Link]         |
| Forgot Password               |
+-------------------------------+
```

### Sign Up Screen
```
+-------------------------------+
|      Create Account           |
|------------------------------|
| Full Name:   [__________]     |
| Email:       [__________]     |
| Phone:       [__________]     |
| Password:    [__________]     |
|------------------------------|
| [Sign Up Button]              |
| Already have an account? Login|
+-------------------------------+
```

### Home / Dashboard Screen
```
+-------------------------------+
| Welcome, [User Name]          |
|------------------------------|
| Next Trip:                    |
|  Destination: [_____]         |
|  Date & Time: [_____]         |
|  Gate: [__] Flight: [____]    |
|------------------------------|
| [View Boarding Pass Button]   |
| Boarding Status: [Status]     |
| [Notifications Button]        |
+-------------------------------+
```

### Boarding Pass Screen
```
+-------------------------------+
|      Boarding Pass            |
|------------------------------|
|      [QR Code Placeholder]    |
|------------------------------|
| Name: [_____]                 |
| Seat: [__] Group: [__]        |
| Trip: [____] Gate: [__]       |
| Status: [Boarding Now]        |
| [Refresh QR Code Button]      |
+-------------------------------+
```

### Live Boarding Status Screen
```
+-------------------------------+
|    Boarding Status            |
|------------------------------|
| Progress: [1][2][3][4][5]    |
| Currently Boarding: Group X   |
| Countdown: [00:05:00]         |
| Info: Arrive before time ends |
+-------------------------------+
```

### Notifications Screen
```
+-------------------------------+
|      Notifications            |
|------------------------------|
| [Icon] Boarding Started       |
| [Icon] Gate Changed           |
| [Icon] Delay Notification     |
| ...                          |
+-------------------------------+
```

### Profile Screen
```
+-------------------------------+
|      [Avatar Placeholder]     |
| Name: [_____]                 |
| Email/Phone: [_____]          |
|------------------------------|
| [Edit Profile Button]         |
| [Logout Button]               |
+-------------------------------+
```

---

## Admin Panel (Web/Tablet for Staff)

### Admin Login Screen
```
+-------------------------------+
|   Smart Boarding Admin        |
|------------------------------|
| Username: [__________]        |
| Password: [__________]        |
|------------------------------|
| [Login Button]                |
+-------------------------------+
```

### Admin Dashboard Screen
```
+-------------------------------+
|         Dashboard             |
|------------------------------|
| [Total Passengers Card]       |
| [Boarded Card]                |
| [Remaining Card]              |
| [Delayed Card]                |
|------------------------------|
| [Start Boarding Button]       |
| [Pause Boarding Button]       |
| [End Boarding Button]         |
+-------------------------------+
```

### Passenger List Screen
```
+-------------------------------+
|     Passenger List            |
|------------------------------|
| [Search Bar]                  |
|------------------------------|
| Name | Seat | Group | Status  |
|------------------------------|
| ...                          |
| [Filter Dropdown]             |
+-------------------------------+
```

### QR Scanner Screen
```
+-------------------------------+
|   Scan Boarding Pass          |
|------------------------------|
| [Camera View Placeholder]     |
|------------------------------|
| [Scan Result Popup]          |
|  Success/Error Message        |
+-------------------------------+
```

### Boarding Control Screen
```
+-------------------------------+
|    Boarding Control           |
|------------------------------|
| Current Group: [__]           |
|------------------------------|
| [Next Group Button]           |
| [Previous Group Button]       |
| [Close Gate Button]           |
|------------------------------|
| Boarded Count: [__]           |
+-------------------------------+
```

### Settings Screen
```
+-------------------------------+
|        Settings               |
|------------------------------|
| [Toggle] Enable Notifications |
| [Toggle] Auto-close Gate      |
| Boarding Time Limit: [__]     |
|------------------------------|
| [Save Settings Button]        |
+-------------------------------+
```
