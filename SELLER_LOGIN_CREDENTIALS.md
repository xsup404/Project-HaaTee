# 🏢 HaaTee Seller Portal - Login Credentials

## How to Test Seller Login & Dashboard

### ✅ Seller Credentials (All use password: `seller123456`)

| Seller Name | Email | Rating | Properties |
|-----------|-------|--------|-----------|
| คุณดำรง (Damrong) | damrong@haatee.com | ⭐ 4.8 | Property ID: 1, 2 |
| คุณสมศักดิ์ (Somsak) | somsak@haatee.com | ⭐ 4.4 | Property ID: 3 |
| คุณอนันต์ (Anant) | anant@haatee.com | ⭐ 4.6 | Property ID: 4 |
| คุณวิชัย (Vichai) | vichai@haatee.com | ⭐ 4.5 | Property ID: 5 |
| คุณวรรณี (Waruni) | waruni@haatee.com | ⭐ 4.9 | Property ID: 6 |
| บริษัท ดวลประมาณ (Company) | company@realestateasia.com | ⭐ 4.5 | Property ID: 7 |
| คุณเศรษฐ (Setthapol) | setthapol@haatee.com | ⭐ 4.7 | Property ID: 8 |
| คุณสิรินธร (Sirindhon) | sirindhon@haatee.com | ⭐ 4.6 | Property ID: 9 |
| คุณสมทรง (Somthorn) | somthorn@haatee.com | ⭐ 4.7 | Property ID: 10 |
| คุณอรษา (Arsa) | arsa@haatee.com | ⭐ 4.6 | Property ID: 11 |
| คุณนิยม (Niyom) | niyom@haatee.com | ⭐ 4.7 | Property ID: 12 |
| คุณสมบูรณ์ (Samboorn) | samboorn@haatee.com | ⭐ 4.5 | Property ID: 13 |
| คุณปิยา (Piyo) | piyo@haatee.com | ⭐ 4.8 | Property ID: 14 |
| คุณสมศรณ์ (Somshorn) | somshorn@haatee.com | ⭐ 4.9 | Property ID: 15 |
| คุณวัชรา (Wachara) | wachara@haatee.com | ⭐ 4.8 | Property ID: 16 |
| คุณวิมล (Vimon) | vimon@haatee.com | ⭐ 4.7 | Property ID: 17 |

---

## 📋 Login Steps

1. **Navigate to Login Page** → Click on "🏢 เจ้าของทรัพย์" tab
2. **Enter Email** → Use any email from the table above
3. **Enter Password** → `seller123456` (same for all sellers)
4. **OTP Code** → Enter `123456` when prompted
5. ✅ **Logged in!** → Dashboard shows seller's actual properties

---

## 🎯 What Each Seller Sees

### Dashboard Features:
- ✓ Their own properties listed
- ✓ Property views, contact requests, saves
- ✓ Rating and performance statistics
- ✓ Profile with name, email, phone
- ✓ Certifications and response time

### Example - Damrong (damrong@haatee.com):
- **Properties**: 
  - บ้านเดี่ยว 2 ชั้น สไตล์โมเดิร์น (ID: 1) - ฿12,900,000
  - บ้านหรู 2 ชั้น สไตล์ Contemporary (ID: 2) - ฿22,000,000
- **Rating**: ⭐ 4.8/5.0
- **Total Sales**: 5 sold
- **Response Time**: 2 hours
- **Status**: ✅ Verified

### Example - Waruni (waruni@haatee.com):
- **Properties**:
  - คอนโดหรู ริมแม่น้ำเจ้าพระยา (ID: 6) - ฿18,500,000
- **Rating**: ⭐ 4.9/5.0 (Top Agent!)
- **Total Sales**: 8 sold
- **Response Time**: 30 min
- **Status**: ✅ Verified

---

## 🔐 Technical Integration

### Backend Data Sources:
- **User Data**: `src/data/users.json` (16 sellers)
- **Property Data**: `src/data/properties.json` (17 properties with sellerId)
- **Authentication**: Login.jsx validates against SELLER_CREDENTIALS
- **Session Storage**: `localStorage.setItem('sellerEmail', email)`

### Component Flow:
```
Login Page → Seller Tab → Email/Password
    ↓
handleSellerLogin() → Check SELLER_CREDENTIALS
    ↓
OTP Verification → Store sellerEmail in localStorage
    ↓
Seller.jsx (useEffect) → Load from localStorage
    ↓
usersData.find(email) → Get seller profile
    ↓
propertiesData.filter(sellerId) → Get seller's properties
    ↓
Display Dashboard with actual data ✓
```

---

## 🧪 Testing Scenarios

### Test 1: Login as Top Agent
```
Email: waruni@haatee.com
Password: seller123456
OTP: 123456
Expected: 1 luxury condo, 4.9 rating, 30 min response
```

### Test 2: Login as Company
```
Email: company@realestateasia.com
Password: seller123456
OTP: 123456
Expected: 1 condo property, corporate info
```

### Test 3: Login as Unverified Seller
```
Email: somsak@haatee.com
Password: seller123456
OTP: 123456
Expected: 1 property, 4.4 rating, unverified badge
```

---

## ✨ Features Implemented

- ✅ Real seller login credentials from users.json
- ✅ Password authentication (seller123456 for all)
- ✅ OTP verification (123456)
- ✅ Seller profile with actual data
- ✅ Properties filtered by sellerId
- ✅ Ratings, certifications, response times
- ✅ Dashboard stats (views, contacts, sales)
- ✅ Seller verification badges
- ✅ Profile section with complete info

---

## 🚀 Future Enhancements

- [ ] Individual password per seller
- [ ] Property edit/delete functionality
- [ ] Real-time chat with buyers
- [ ] Contract management
- [ ] Analytics and performance tracking
- [ ] Photo upload for properties
- [ ] Lease/rent management

