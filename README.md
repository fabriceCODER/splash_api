# **Splash (Water Channel Management System API)**  
This API allows admins to manage plumbers, assign channels, and track daily reports. Plumbers receive real-time notifications for assigned channels, while admins get analytics and reports.  

## **📌 Base URL**  
- **Local:** `http://localhost:5000/api`  
- **Production:** `https://your-render-deployment-url.com/api`  

---

## **📌 Authentication**  
This API uses **JWT authentication**. Include the token in the `Authorization` header:  
```
Authorization: Bearer <your_token>
```

### **🔹 Admin Login**
#### **Request**
```http
POST /auth/login
Content-Type: application/json
```
```json
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```
#### **Response**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "admin_id",
    "name": "Admin Name",
    "email": "admin@example.com"
  }
}
```

---

## **📌 Plumbers**
### **🔹 Get All Plumbers**
#### **Request**
```http
GET /plumbers
Authorization: Bearer <admin_token>
```
#### **Response**
```json
[
  {
    "id": "plumber1",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "+250788123456"
  }
]
```

### **🔹 Create a Plumber**
#### **Request**
```http
POST /plumbers
Authorization: Bearer <admin_token>
Content-Type: application/json
```
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "nationalId": "123456789",
  "phone": "+250788123456"
}
```
#### **Response**
```json
{
  "message": "Plumber created successfully",
  "plumber": {
    "id": "plumber1",
    "name": "John Doe",
    "email": "johndoe@example.com"
  }
}
```

---

## **📌 Channels**
### **🔹 Get All Channels**
#### **Request**
```http
GET /channels
Authorization: Bearer <admin_token>
```
#### **Response**
```json
[
  {
    "id": "channel1",
    "name": "Water Line A",
    "location": "District 1",
    "stations": 5,
    "plumber": "John Doe"
  }
]
```

### **🔹 Assign a Channel to a Plumber**
#### **Request**
```http
POST /channels/assign
Authorization: Bearer <admin_token>
Content-Type: application/json
```
```json
{
  "channelId": "channel1",
  "plumberId": "plumber1"
}
```
#### **Response**
```json
{
  "message": "Channel assigned successfully"
}
```

---

## **📌 Real-Time Notifications**
Plumbers receive notifications when an issue occurs in their assigned channel.

- **Join Notification Room:** `socket.emit("joinPlumberRoom", plumberId);`
- **Receive Notification:** `socket.on("channelAlert", (data) => console.log(data));`

Example notification:
```json
{
  "channel": "Water Line A",
  "issue": "Leak detected at Station 3",
  "status": "Urgent"
}
```

---

## **📌 Daily Reports (Admin)**
### **🔹 Get Last 7 Days Reports**
#### **Request**
```http
GET /reports/daily
Authorization: Bearer <admin_token>
```
#### **Response**
```json
[
  {
    "date": "2025-03-04",
    "solvedIssues": 3,
    "unsolvedIssues": [
      { "location": "Station 2", "channel": "Water Line A" }
    ]
  }
]
```

---

## **📌 Analytics**
### **🔹 Get System Insights**
#### **Request**
```http
GET /analytics
Authorization: Bearer <admin_token>
```
#### **Response**
```json
{
  "totalChannels": 10,
  "totalPlumbers": 5,
  "averageLeakages": 2.3,
  "waterLost": "500 liters/day"
}
```

---

## **📌 Swagger API Documentation**
View detailed API docs at:
```
http://localhost:5000/api-docs
```

---

## **📌 Deployment**
1. **Push Code to GitHub**  
2. **Deploy on Render**  
3. **Set Environment Variables on Render**  
   - `DATABASE_URL`  
   - `JWT_SECRET`  
4. **Restart the Server**  



