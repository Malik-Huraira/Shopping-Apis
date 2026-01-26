# Shopping APIs - Complete Endpoint Documentation

## Base URL

```
http://localhost:3000
```

## Authentication

Most endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_token_here>
```

---

## 1. Authentication Service

### 1.1 User Signup

**Endpoint:** `POST /api/auth/signup`  
**Auth Required:** No  
**Role Required:** None

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "phone_number": "+1234567890",
  "role": "user",
  "status": "active",
  "address": "123 Main St, New York, NY",
  "description": "Regular customer"
}
```

**Response (201):**

```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone_number": "+1234567890"
  }
}
```

**Notes:**

- `role`: "admin" or "user" (default: "user")
- `status`: "active" or "inactive" (default: "active")
- Password must be strong

---

### 1.2 Admin Signup

**Endpoint:** `POST /api/auth/signup`  
**Auth Required:** No  
**Role Required:** None

**Request Body:**

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "AdminPass123!",
  "phone_number": "+9876543210",
  "role": "admin",
  "status": "active",
  "address": "456 Admin Ave, Los Angeles, CA",
  "description": "System administrator"
}
```

---

### 1.3 Login

**Endpoint:** `POST /api/auth/login`  
**Auth Required:** No  
**Role Required:** None

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

**Notes:**

- Save the `token` for subsequent authenticated requests
- Token expires in 24 hours (configurable)

---

### 1.4 Logout

**Endpoint:** `POST /api/auth/logout`  
**Auth Required:** Yes  
**Role Required:** Any authenticated user

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "message": "Logout successful"
}
```

---

## 2. Product Service

### 2.1 Create Product

**Endpoint:** `POST /api/products`  
**Auth Required:** Yes  
**Role Required:** Admin (role_id: 1)

**Request Body:**

```json
{
  "name": "Wireless Headphones",
  "description": "High-quality Bluetooth headphones with noise cancellation",
  "price": 99.99,
  "stock": 50
}
```

**Response (201):**

```json
{
  "message": "Product added successfully",
  "id": 1
}
```

---

### 2.2 Get All Products (Paginated)

**Endpoint:** `GET /api/products?page=1&limit=10`  
**Auth Required:** Yes  
**Role Required:** Any authenticated user

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200):**

```json
{
  "products": [
    {
      "id": 1,
      "name": "Wireless Headphones",
      "description": "High-quality Bluetooth headphones",
      "price": 99.99,
      "stock": 50,
      "created_at": "2026-01-25T10:30:00.000Z",
      "updated_at": "2026-01-25T10:30:00.000Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalProducts": 50,
  "limit": 10
}
```

---

### 2.3 Get Product by ID

**Endpoint:** `GET /api/products/:id`  
**Auth Required:** Yes  
**Role Required:** Any authenticated user

**Example:** `GET /api/products/1`

**Response (200):**

```json
{
  "id": 1,
  "name": "Wireless Headphones",
  "description": "High-quality Bluetooth headphones",
  "price": 99.99,
  "stock": 50,
  "created_at": "2026-01-25T10:30:00.000Z",
  "updated_at": "2026-01-25T10:30:00.000Z"
}
```

---

### 2.4 Update Product

**Endpoint:** `PUT /api/products/:id`  
**Auth Required:** Yes  
**Role Required:** Admin (role_id: 1)

**Request Body:**

```json
{
  "name": "Wireless Headphones Pro",
  "description": "Premium Bluetooth headphones with active noise cancellation",
  "price": 129.99,
  "stock": 45
}
```

**Response (200):**

```json
{
  "message": "Product updated successfully"
}
```

---

### 2.5 Delete Product

**Endpoint:** `DELETE /api/products/:id`  
**Auth Required:** Yes  
**Role Required:** Admin (role_id: 1)

**Example:** `DELETE /api/products/1`

**Response (200):**

```json
{
  "message": "Product deleted successfully"
}
```

---

### 2.6 Bulk Fetch Products

**Endpoint:** `POST /api/products/bulk`  
**Auth Required:** Yes  
**Role Required:** Any authenticated user

**Request Body:**

```json
{
  "ids": [1, 2, 3, 4, 5]
}
```

**Response (200):**

```json
[
  {
    "id": 1,
    "name": "Wireless Headphones",
    "price": 99.99,
    "stock": 50
  },
  {
    "id": 2,
    "name": "Smart Watch",
    "price": 199.99,
    "stock": 30
  }
]
```

---

## 3. Order Service

### 3.1 Create Order

**Endpoint:** `POST /api/orders`  
**Auth Required:** Yes  
**Role Required:** Admin or User (role_id: 1 or 2)

**Request Body:**

```json
{
  "products": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 2,
      "quantity": 1
    }
  ]
}
```

**Response (201):**

```json
{
  "message": "Order created successfully",
  "order_id": 1
}
```

**Notes:**

- User ID is extracted from the JWT token
- Product prices are fetched from Product Service
- Total price is calculated automatically
- Kafka event is published for email notification

---

### 3.2 Get Order by ID

**Endpoint:** `GET /api/orders/:id`  
**Auth Required:** Yes  
**Role Required:** Admin or User (role_id: 1 or 2)

**Example:** `GET /api/orders/1`

**Response (200):**

```json
{
  "id": 1,
  "user_id": 1,
  "total_price": 299.97,
  "status": "pending",
  "created_at": "2026-01-25T10:30:00.000Z",
  "updated_at": "2026-01-25T10:30:00.000Z"
}
```

---

### 3.3 Get User Orders (Paginated)

**Endpoint:** `GET /api/orders/user/:userId?page=1&limit=10`  
**Auth Required:** Yes  
**Role Required:** Admin or User (role_id: 1 or 2)

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example:** `GET /api/orders/user/1?page=1&limit=10`

**Response (200):**

```json
{
  "orders": [
    {
      "id": 1,
      "user_id": 1,
      "total_price": 299.97,
      "status": "pending",
      "created_at": "2026-01-25T10:30:00.000Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 3,
  "totalOrders": 25,
  "limit": 10
}
```

---

### 3.4 Update Order Status

**Endpoint:** `PUT /api/orders/:id/status`  
**Auth Required:** Yes  
**Role Required:** Admin (role_id: 1)

**Request Body:**

```json
{
  "status": "shipped"
}
```

**Response (200):**

```json
{
  "message": "Order status updated successfully"
}
```

**Valid Status Values:**

- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

---

### 3.5 Delete Order

**Endpoint:** `DELETE /api/orders/:id`  
**Auth Required:** Yes  
**Role Required:** Admin (role_id: 1)

**Example:** `DELETE /api/orders/1`

**Response (200):**

```json
{
  "message": "Order deleted successfully"
}
```

---

## 4. User Service

### 4.1 Get All Users

**Endpoint:** `GET /api/users`  
**Auth Required:** Yes  
**Role Required:** Admin (role_id: 1)

**Response (200):**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone_number": "+1234567890",
    "role_id": 2,
    "status_id": 1,
    "address": "123 Main St",
    "created_at": "2026-01-25T10:30:00.000Z"
  }
]
```

---

### 4.2 Get User by ID

**Endpoint:** `GET /api/users/:id`  
**Auth Required:** Yes  
**Role Required:** Admin or User (role_id: 1 or 2)

**Example:** `GET /api/users/1`

**Response (200):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone_number": "+1234567890",
  "role_id": 2,
  "status_id": 1,
  "address": "123 Main St",
  "description": "Regular customer",
  "created_at": "2026-01-25T10:30:00.000Z"
}
```

---

### 4.3 Create User

**Endpoint:** `POST /api/users`  
**Auth Required:** Yes  
**Role Required:** Admin (role_id: 1)

**Request Body:**

```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "password": "SecurePass456!",
  "phone_number": "+1122334455",
  "role_id": 2,
  "status_id": 1,
  "address": "789 Oak St, Chicago, IL",
  "description": "New customer"
}
```

**Response (201):**

```json
{
  "message": "User created successfully",
  "user": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane.smith@example.com"
  }
}
```

---

### 4.4 Update User

**Endpoint:** `PUT /api/users/:id`  
**Auth Required:** Yes  
**Role Required:** Admin (role_id: 1)

**Request Body:**

```json
{
  "name": "Jane Smith Updated",
  "email": "jane.smith.updated@example.com",
  "phone_number": "+1122334466",
  "address": "789 Oak St, Apt 5B, Chicago, IL",
  "description": "Updated customer info"
}
```

**Response (200):**

```json
{
  "message": "User updated successfully"
}
```

---

### 4.5 Delete User

**Endpoint:** `DELETE /api/users/:id`  
**Auth Required:** Yes  
**Role Required:** Admin (role_id: 1)

**Example:** `DELETE /api/users/2`

**Response (200):**

```json
{
  "message": "User deleted successfully"
}
```

---

## 5. Email Service

### 5.1 Send Email Notification

**Endpoint:** `POST /api/emails/send-notification`  
**Auth Required:** No  
**Role Required:** None

**Request Body:**

```json
{
  "to": "customer@example.com",
  "subject": "Order Confirmation",
  "body": "Thank you for your order! Your order #12345 has been confirmed.",
  "type": "order_confirmation"
}
```

**Response (200):**

```json
{
  "message": "Email notification sent successfully"
}
```

**Email Types:**

- `order_confirmation`
- `order_shipped`
- `order_delivered`
- `password_reset`
- `welcome`

---

## 6. Health Check Endpoints

### 6.1 API Gateway Health

**Endpoint:** `GET /health`  
**Response:** `{"status":"OK","service":"API Gateway"}`

### 6.2 Auth Service Health

**Endpoint:** `GET http://localhost:5001/health`  
**Response:** `{"status":"OK","service":"Auth Service"}`

### 6.3 Product Service Health

**Endpoint:** `GET http://localhost:5004/health`  
**Response:** `{"status":"OK","service":"Product Service"}`

### 6.4 Order Service Health

**Endpoint:** `GET http://localhost:5003/health`  
**Response:** `{"status":"OK","service":"Order Service"}`

### 6.5 User Service Health

**Endpoint:** `GET http://localhost:5005/health`  
**Response:** `{"status":"OK","service":"User Service"}`

### 6.6 Email Service Health

**Endpoint:** `GET http://localhost:5002/health`  
**Response:** `{"status":"OK","service":"Email Service"}`

### 6.7 Chat Service Health

**Endpoint:** `GET http://localhost:5006/health`  
**Response:** `{"status":"OK","service":"Chat Service"}`

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Validation error",
  "message": "Invalid input data"
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Invalid credentials"
}
```

### 403 Forbidden

```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 409 Conflict

```json
{
  "error": "Conflict",
  "message": "User already exists"
}
```

### 500 Internal Server Error

```json
{
  "error": "Server error",
  "message": "Internal server error"
}
```

---

## Testing Workflow

### 1. Setup

1. Import `Shopping-APIs-Postman-Collection.json` into Postman
2. Ensure all services are running: `docker-compose ps`

### 2. Authentication Flow

1. **Signup Admin**: Create an admin account
2. **Signup User**: Create a regular user account
3. **Login**: Get authentication token (auto-saved to collection variable)

### 3. Product Management (Admin)

1. **Create Products**: Add multiple products
2. **Get All Products**: View paginated list
3. **Update Product**: Modify product details
4. **Get Product by ID**: View specific product

### 4. Order Flow (User)

1. **Login as User**: Get user token
2. **Get All Products**: Browse available products
3. **Create Order**: Place an order with multiple products
4. **Get User Orders**: View order history
5. **Get Order by ID**: View specific order details

### 5. Admin Operations

1. **Login as Admin**: Get admin token
2. **Update Order Status**: Change order status (shipped, delivered, etc.)
3. **Get All Users**: View all registered users
4. **Delete Order**: Remove an order (if needed)

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Pagination defaults: page=1, limit=10
- JWT tokens expire after 24 hours
- Redis caching is enabled for products and orders (5 minutes TTL)
- Kafka events are published for orders and user registrations
- Rate limiting is applied to authentication endpoints
- All prices are in USD (or your configured currency)

---

## Support

For issues or questions, check the service logs:

```bash
docker-compose logs <service-name>
```

Example:

```bash
docker-compose logs auth-service
docker-compose logs product-service
docker-compose logs order-service
```
